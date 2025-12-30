import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
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
    const token = getAccessTokenFn ? getAccessTokenFn() : null;
    let language = localStorage.getItem("appLanguage") || "en";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Accept-Language"] = language;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-logout here, let AuthContext handle it
    // Just pass the error through
    return Promise.reject(error);
  }
);

export default api;
