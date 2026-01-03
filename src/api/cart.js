import api from "./axios";

export const getCart = async () => {
  try {
    const response = await api.get("/api/cart");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch cart",
    };
  }
};

export const addToCart = async (data) => {
  try {
    const response = await api.post("/api/cart", data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add to cart",
    };
  }
};
