import api from "./axios";

export const checkout = async (checkoutData) => {
  try {
    const response = await api.post("/api/checkout", checkoutData);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Checkout failed",
    };
  }
};

export const getCheckoutHistory = async () => {
  try {
    const response = await api.get("/api/checkout");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch history",
    };
  }
};

export const getCheckoutDetail = async (id) => {
  try {
    const response = await api.get(`/api/checkout/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch order detail",
    };
  }
};

export const getTracking = async (id) => {
  try {
    const response = await api.get(`/api/checkout/tracking/${id}`); // Assuming endpoint
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch tracking info",
    };
  }
};
