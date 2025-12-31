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
export const verifyOTP = async (email, device_id, otp) => {
  try {
    const response = await api.put("/api/auth/verify-login", {
      email,
      device_id,
      otp,
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
    const response = await api.delete("/api/auth/logout");

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
 * Request Password Reset
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/api/auth/forgot-password", { email });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to send reset code. Please try again.",
      error: error.response?.data,
    };
  }
};

/**
 * Reset Password with OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code from email
 * @param {string} password - New password
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPassword = async (email, otp, password) => {
  try {
    const response = await api.put("/api/auth/reset-password", {
      email,
      otp,
      password,
      password_confirmation: password,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Reset password failed. Please try again.",
      error: error.response?.data,
    };
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post("/api/auth/refresh");

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Token refresh failed. Please login again.",
      error: error.response?.data,
    };
  }
};

export default {
  login,
  verifyOTP,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
};
