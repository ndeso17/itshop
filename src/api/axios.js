import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Store reference to getAccessToken function
let getAccessTokenFn = null;

export const setAuthTokenGetter = (fn) => {
  getAccessTokenFn = fn;
};

api.interceptors.request.use(
  (config) => {
    // Get token from AuthContext via getter function
    let token = getAccessTokenFn ? getAccessTokenFn() : null;

    // Fallback: Check localStorage if context is not ready or empty
    if (!token) {
      token = localStorage.getItem("accessToken");
    }

    let language = localStorage.getItem("appLanguage") || "en";

    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Accept-Language"] = language;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Store callbacks
let logoutHandler = null;
let updateTokenHandler = null;

export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

export const setUpdateTokenHandler = (fn) => {
  updateTokenHandler = fn;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no response (network error)
    if (!error.response) {
      console.error("[Axios] Network error:", error.message);
      return Promise.reject(error);
    }

    // Prevent infinite loops if refresh endpoint itself fails
    if (originalRequest.url?.includes("/auth/refresh")) {
      console.error("[Axios] Refresh token request failed, logging out...");
      if (logoutHandler) logoutHandler();
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("[Axios] 401 received for:", originalRequest.url);

      // If already refreshing, queue this request
      if (isRefreshing) {
        console.log(
          "[Axios] Token refresh in progress, queuing request:",
          originalRequest.url
        );
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log(
              "[Axios] Retrying queued request:",
              originalRequest.url
            );
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark this request as retrying
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        console.log(
          "[Axios] Refresh token from localStorage:",
          refreshToken ? "exists" : "missing"
        );

        // Build headers
        const headers = {};
        if (refreshToken) {
          headers["Authorization"] = `Bearer ${refreshToken}`;
        }

        console.log("[Axios] Attempting to refresh token...");

        // Use clean axios with withCredentials to send cookies
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          {
            headers: headers,
            withCredentials: true, // Send HttpOnly cookies
          }
        );

        const { token } = response.data.data;
        console.log("[Axios] Token refreshed successfully");

        // Update local storage and context
        localStorage.setItem("accessToken", token);
        if (updateTokenHandler) updateTokenHandler(token);

        // Update defaults
        api.defaults.headers.common["Authorization"] = "Bearer " + token;

        // Process queued requests with new token
        console.log(
          "[Axios] Processing",
          failedQueue.length,
          "queued requests"
        );
        processQueue(null, token);
        isRefreshing = false;

        // Retry original request
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (err) {
        console.error("[Axios] Token refresh failed:", err.message);
        processQueue(err, null);
        isRefreshing = false;
        if (logoutHandler) logoutHandler();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
