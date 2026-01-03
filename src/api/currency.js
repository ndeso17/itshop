import axios from "axios";

const API_URL = "https://api.exchangerate-api.com/v4/latest/IDR";

export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL);
    if (response.data && response.data.rates) {
      return response.data.rates;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    throw error;
  }
};
