import React, { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  // Sync local state with i18n if needed, or just expose i18n's language
  // For compatibility with existing consumers, we can provide a setLanguage wrapper
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const language = i18n.language;

  // Price formatting and conversion
  const formatPrice = (priceInUSD) => {
    switch (language) {
      case "id":
      case "id-ID":
        // Approx 1 USD = 15,000 IDR
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(priceInUSD * 15000);
      case "ko":
      case "ko-KR":
        // Approx 1 USD = 1,300 KRW
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
          minimumFractionDigits: 0,
        }).format(priceInUSD * 1300);
      default:
        // Default USD
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(priceInUSD);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
