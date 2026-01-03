import { fetchExchangeRates } from "../api/currency";

const CACHE_KEY = "exchangeRates";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Fallback rates if API fails
const FALLBACK_RATES = {
  USD: 0.0000625, // 1/16000
  KRW: 0.0864,
  IDR: 1,
};

export const updateExchangeRates = async () => {
  try {
    const rates = await fetchExchangeRates();
    const cacheData = {
      rates,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log("Exchange rates updated successfully");
    return true;
  } catch (error) {
    console.error(
      "Failed to update exchange rates, using cached or fallback",
      error
    );
    return false;
  }
};

const getRates = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return FALLBACK_RATES;

    const { rates, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      // Expired, but return it for now while we might trigger update in bg
      // For now, we rely on App.js to trigger update
      return rates;
    }
    return rates;
  } catch {
    return FALLBACK_RATES;
  }
};

/**
 * Format currency based on the selected language/locale.
 *
 * @param {number} price - The price in IDR (Rupiah).
 * @param {string} language - The current language code (e.g., 'id', 'en', 'ko', 'kr').
 * @returns {string} - The formatted price string with symbol.
 */
export const formatCurrency = (price, language = "en") => {
  if (price === undefined || price === null || isNaN(price)) return "";

  const rates = getRates();

  try {
    switch (language) {
      case "id":
      case "id-ID":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price);

      case "kr":
      case "ko":
      case "ko-KR": {
        const rate = rates.KRW || FALLBACK_RATES.KRW;
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price * rate);
      }

      default: {
        // en, en-US, etc.
        const rate = rates.USD || FALLBACK_RATES.USD;
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price * rate);
      }
    }
  } catch (error) {
    console.error("Currency formatting error:", error);
    return String(price);
  }
};
