import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { setLogoutHandler, setUpdateTokenHandler } from "../api/axios";

import * as authAPI from "../api/auth";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef(null);

  // Logout helper (internal, no confirmation)
  const performLogout = React.useCallback(() => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("hasAuth");
    localStorage.removeItem("deviceId");
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    navigate("/login");
  }, [navigate]);

  // Auto-refresh token every 9 minutes (540,000ms)
  const startAutoRefresh = React.useCallback(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    console.log("[Auth] Starting auto-refresh interval (every 9 minutes)");

    // Set new interval
    refreshIntervalRef.current = setInterval(async () => {
      console.log("[Auth] Auto-refreshing token...");
      const result = await authAPI.refreshToken();

      if (result.success && result.data) {
        setAccessToken(result.data.token);
        setUser(result.data.user);
        localStorage.setItem("accessToken", result.data.token);
        localStorage.setItem("userData", JSON.stringify(result.data.user));
        localStorage.setItem("hasAuth", "true");
        console.log("[Auth] Token refreshed successfully");
      } else {
        console.error(
          "[Auth] Auto-refresh failed:",
          result.status,
          result.message
        );
        // Only logout on explicit auth failures (401/403)
        // For network errors or server errors, keep trying
        if (result.status === 401 || result.status === 403) {
          console.error("[Auth] Session expired, logging out");
          performLogout();
        } else {
          console.warn(
            "[Auth] Refresh failed but keeping session (will retry next interval)"
          );
        }
      }
    }, 540000); // 9 minutes
  }, [performLogout]);

  // Register axios handlers
  useEffect(() => {
    setLogoutHandler(performLogout);
    setUpdateTokenHandler((token) => {
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    });
    return () => {
      setLogoutHandler(null);
      setUpdateTokenHandler(null);
    };
  }, [performLogout]);

  const isInitializingRef = useRef(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Prevent double initialization (React Strict Mode fix)
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      const hasAuth = localStorage.getItem("hasAuth");

      if (hasAuth === "true") {
        console.log("[Auth] Attempting to restore session...");
        try {
          const result = await authAPI.refreshToken();

          if (result.success && result.data) {
            setUser(result.data.user);
            localStorage.setItem("accessToken", result.data.token);
            localStorage.setItem("userData", JSON.stringify(result.data.user));
            localStorage.setItem("hasAuth", "true");
            console.log("[Auth] Session restored successfully");
            startAutoRefresh();
          } else {
            console.log(
              "[Auth] Session restoration failed with status:",
              result.status
            );
            // Only force logout on strict authentication failure (401/403)
            // If it's a network error (0/undefined) or server error (500), keep the local session
            if (result.status === 401 || result.status === 403) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userData");
              localStorage.removeItem("hasAuth");
              setUser(null);
              setAccessToken(null);
            } else {
              console.log(
                "[Auth] Keeping local session despite refresh failure (likely network or rate limit)"
              );
              startAutoRefresh(); // Try again later
            }
          }
        } catch (error) {
          console.error("[Auth] Unexpected error during init:", error);
        }
      }

      setLoading(false);
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [startAutoRefresh]);

  /**
   * Step 1: Login - Request OTP
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, data?: {email, device_id}, message: string}>}
   */
  const login = async (email, password) => {
    const result = await authAPI.login(email, password);

    if (!result.success) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.message,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }

    return result;
  };

  /**
   * Step 2: Verify OTP - Complete Login
   * @param {string} email
   * @param {string} device_id
   * @param {string} otp
   * @param {boolean} rememberMe
   * @returns {Promise<{success: boolean}>}
   */
  const verifyOTP = async (email, device_id, otp, rememberMe) => {
    const result = await authAPI.verifyOTP(email, device_id, otp, rememberMe);

    if (result.success) {
      setAccessToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem("accessToken", result.data.token);
      if (result.data.refreshToken) {
        localStorage.setItem("refreshToken", result.data.refreshToken);
      }
      // Store device_id for logout
      if (device_id) {
        localStorage.setItem("deviceId", device_id);
      }
      localStorage.setItem("userData", JSON.stringify(result.data.user));
      localStorage.setItem("hasAuth", "true");

      // Start auto-refresh
      startAutoRefresh();

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${result.data.user.full_name}!`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "swal-custom-popup",
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: result.message,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }

    return result;
  };

  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<{success: boolean}>}
   */
  const register = async (userData) => {
    const result = await authAPI.register(userData);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        html: `
          <p>${result.message}</p>
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            Please check your email to verify your account.
          </p>
        `,
        confirmButtonText: "Go to Login",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: result.message,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }

    return result;
  };

  /**
   * Logout current user
   * Note: Confirmation dialog should be shown by the caller (e.g., Navbar)
   */
  const logout = async () => {
    // Call logout API
    await authAPI.logout();

    // Clear state using performLogout
    performLogout();

    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: "swal-custom-popup",
      },
    });

    return { success: true };
  };

  /**
   * Request password reset link
   * @param {string} email
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const forgotPassword = async (email) => {
    const result = await authAPI.forgotPassword(email);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Link Reset Terkirim",
        text: result.message || "Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda.",
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Gagal Mengiring Link",
        text: result.message,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }

    return result;
  };

  /**
   * Get current access token (for axios interceptor)
   */
  const getAccessToken = () => {
    return accessToken;
  };

  const value = {
    user,
    accessToken,
    login,
    verifyOTP,
    logout,
    register,
    forgotPassword,
    getAccessToken,
    isAuthenticated: !!user && !!accessToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
