import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { setAuthTokenGetter } from "./api/axios";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

// Inner component to access AuthContext
const AppContent = () => {
  const { getAccessToken } = useAuth();

  useEffect(() => {
    // Connect axios with AuthContext token getter
    setAuthTokenGetter(getAccessToken);
  }, [getAccessToken]);

  return <AppRoutes />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
