import React, { createContext, useState, useContext, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Persist language choice
    const saved = localStorage.getItem("appLanguage");
    return saved || "en";
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  // Helper function to get nested translation value
  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to English if missing
        let fallback = translations["en"];
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found
          }
        }
        return fallback;
      }
    }
    return value;
  };

  // Price formatting and conversion
  const formatPrice = (priceInUSD) => {
    switch (language) {
      case "id":
        // Approx 1 USD = 15,000 IDR
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(priceInUSD * 15000);
      case "kr":
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
