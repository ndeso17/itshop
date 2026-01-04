import React, { useEffect } from "react";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { setAuthTokenGetter } from "./api/axios";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

import { updateExchangeRates } from "./utils/currency";

// Inner component to access AuthContext
const AppContent = () => {
  const { getAccessToken } = useAuth();

  useEffect(() => {
    // Connect axios with AuthContext token getter
    setAuthTokenGetter(getAccessToken);

    // Initial fetch of exchange rates
    updateExchangeRates();
  }, [getAccessToken]);

  return <AppRoutes />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
