import api from "./axios";

export const getProfile = async () => {
  try {
    // Using PUT as per reqres.txt specifications for fetching profile
    const response = await api.put("/api/profile");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile",
    };
  }
};
