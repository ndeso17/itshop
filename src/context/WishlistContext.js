import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  // Helper to get count safely
  const getInitialCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      return Array.isArray(wishlist) ? wishlist.length : 0;
    } catch (error) {
      console.error("Failed to parse wishlist:", error);
      return 0;
    }
  };

  const [wishlistCount, setWishlistCount] = useState(getInitialCount);

  const updateCount = () => {
    setWishlistCount(getInitialCount());
  };

  useEffect(() => {
    // Initial count is handled by useState lazy initialization

    // Listen for custom event from utils/cart.js
    const handleWishlistUpdate = () => {
      updateCount();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    // Also listen for storage events (in case of multiple tabs, though local storage event works differently)
    window.addEventListener("storage", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("storage", handleWishlistUpdate);
    };
  }, []);

  const value = {
    wishlistCount,
    refreshWishlist: updateCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
