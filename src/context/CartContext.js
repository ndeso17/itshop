import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart } from "../api/cart";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch cart data
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const result = await getCart();
      if (result.success && result.data && result.data.items) {
        setCartItems(result.data.items);
        // Calculate total quantity of items
        const count = result.data.items.reduce((acc, item) => {
          return acc + (Number(item.qty) || Number(item.quantity) || 1);
        }, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      // Don't reset cart count on error to avoid flickering if it's just a network blip?
      // Or maybe safer to reset. Let's keep previous state if error.
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when auth state changes, but wait for auth loading to complete
  useEffect(() => {
    // Don't fetch cart while auth context is still restoring session
    if (authLoading) {
      return;
    }
    fetchCart();
  }, [isAuthenticated, authLoading]);

  const value = {
    cartCount,
    cartItems,
    refreshCart: fetchCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
