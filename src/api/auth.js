import api from "./axios";

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

/**
 * Step 1: Login - Request OTP
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data: {email, device_id, device_name, expires_in}, message: string}>}
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Login failed. Please check your credentials.",
      error: error.response?.data,
    };
  }
};

/**
 * Step 2: Verify OTP - Complete Login
 * @param {string} email - User email
 * @param {string} device_id - Device ID from login response
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<{success: boolean, data: {token, user, expires_in}, message: string}>}
 */
export const verifyOTP = async (email, device_id, otp, rememberMe) => {
  try {
    const response = await api.put("/api/auth/verify-login", {
      email,
      device_id,
      otp,
      remember_me: rememberMe,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "OTP verification failed. Please try again.",
      error: error.response?.data,
    };
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {string} userData.email - Email
 * @param {string} userData.phone_number - Phone number
 * @param {string} userData.role - User role (default: "user")
 * @param {string} userData.full_name - Full name
 * @param {string} userData.gender - Gender (L/P)
 * @param {string} userData.birth_date - Birth date (YYYY-MM-DD)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Registration failed. Please try again.",
      error: error.response?.data,
    };
  }
};

/**
 * Logout current user
 * Requires Bearer token in headers (handled by axios interceptor)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const logout = async () => {
  try {
    const deviceId = localStorage.getItem("deviceId");
    const response = await api.delete("/api/auth/logout", {
      data: { device_id: deviceId },
    });

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Logout error:", error);
    // Even if API call fails, we should still clear local state
    return {
      success: true, // Force success to clear local state
      message: "Logged out successfully",
      error: error.response?.data,
    };
  }
};

/**
 * Refresh access token
 * Sends both cookies and Authorization header for compatibility
 * @returns {Promise<{success: boolean, data: {token, user, expires_in}, message: string}>}
 */
export const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem("refreshToken");

    console.log(
      "[Auth API] Refresh token from localStorage:",
      storedRefreshToken ? "exists" : "missing"
    );

    // Build headers - always include Content-Type
    const headers = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if we have a stored refresh token
    if (storedRefreshToken) {
      headers["Authorization"] = `Bearer ${storedRefreshToken}`;
    }

    console.log(
      "[Auth API] Calling refresh token endpoint with headers:",
      Object.keys(headers)
    );

    // Use fetch with credentials to send cookies AND Authorization header
    const response = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: headers,
      credentials: "include", // This sends HttpOnly cookies
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Auth API] Refresh failed:", response.status, data);
      return {
        success: false,
        status: response.status,
        message: data.message || "Token refresh failed. Please login again.",
        error: data,
      };
    }

    console.log("[Auth API] Refresh successful");
    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error("[Auth API] Token refresh error:", error);
    return {
      success: false,
      status: 0,
      message: "Network error during token refresh.",
      error: error,
    };
  }
};

/**
 * Step 1: Forgot Password - Request Reset Link
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send reset link.",
      error: error.response?.data,
    };
  }
};

/**
 * Step 2: Reset Password
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.put("/api/auth/reset-password", {
      token,
      password,
    });
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to reset password.",
      error: error.response?.data,
    };
  }
};

/**
 * Check if credentials (username, email, phone) are available
 * @param {Object} data - Key-value pair to check (e.g. {username: "foo"})
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkCredentials = async (data) => {
  try {
    const response = await api.post("/api/auth/check-credentials", data);

    // Handle cases where API returns 200 OK but body contains error status
    if (response.data.statusCode && response.data.statusCode !== 200) {
      return {
        success: false,
        message: response.data.message || "Validation failed",
        data: response.data,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Validation failed",
      data: error.response?.data,
    };
  }
};

export default {
  login,
  verifyOTP,
  register,
  logout,
  refreshToken,
  checkCredentials,
  forgotPassword,
  resetPassword,
};
