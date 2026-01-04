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

export const updateProfile = async (formData) => {
  try {
    // Using POST with FormData for file upload support
    const response = await api.post("/api/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile",
    };
  }
};
