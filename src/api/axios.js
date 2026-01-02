import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 15000, // 15 seconds timeout
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

    // Prevent infinite loops if refresh endpoint itself fails
    if (originalRequest.url.includes("/auth/refresh")) {
      if (logoutHandler) logoutHandler();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        // Use clean axios to avoid interceptors
        const response = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const { token } = response.data.data;

        // Update local storage and context
        localStorage.setItem("accessToken", token);
        if (updateTokenHandler) updateTokenHandler(token);

        // Update defaults
        api.defaults.headers.common["Authorization"] = "Bearer " + token;

        // Process queue
        processQueue(null, token);
        isRefreshing = false;

        // Retry original
        originalRequest.headers["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (err) {
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
