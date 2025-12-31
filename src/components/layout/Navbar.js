import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Search, Menu, X, User, Sun, Moon } from "lucide-react"; // Ensure lucide-react is installed
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <header className="sticky-header">
      <div className="container">
        <div className="navbar-content">
          {/* Brand */}
          <Link to="/" className="brand-logo">
            ITShop
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <Link to="/products?category=Pria">{t("common.men")}</Link>
            <Link to="/products?category=Wanita">{t("common.women")}</Link>
            <Link to="/products?category=Pria & Wanita">
              {t("common.unisex")}
            </Link>
            <Link to="/products?category=Anak">{t("common.kids")}</Link>
            <Link to="/products?category=Bayi">{t("common.baby")}</Link>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder={t("common.searchPlaceholder")}
                className="nav-search-input"
              />
              <Search size={18} className="search-icon" />
            </div>

            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="action-icon">
                  <Heart size={24} />
                </Link>
                <Link to="/cart" className="action-icon">
                  <ShoppingBag size={24} />
                </Link>
                <Link to="/profile" className="user-profile-link">
                  <User size={24} className="profile-icon" />
                  <span className="user-name">
                    {user?.full_name || user?.email || "User"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-logout-text"
                >
                  {t("common.logout") || "Logout"}
                </button>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  {t("common.login")}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  {t("common.register")}
                </Link>
              </div>
            )}
            
            <button 
              onClick={toggleTheme} 
              className="action-icon theme-toggle" 
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>
 
             {/* Mobile Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <nav>
            <Link
              to="/products?category=Pria"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.men")}
            </Link>
            <Link
              to="/products?category=Wanita"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.women")}
            </Link>
            <Link
              to="/products?category=Pria & Wanita"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.unisex")}
            </Link>
            <Link
              to="/products?category=Anak"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.kids")}
            </Link>
            <Link
              to="/products?category=Bayi"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.baby")}
            </Link>
            {isAuthenticated && (
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                {t("profile.title") || "My Profile"}
              </Link>
            )}
          </nav>
        </div>
      )}

      <style>{`
        .sticky-header {
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: var(--white);
            border-bottom: 1px solid var(--gray-200);
            padding: 0;
            transition: var(--transition);
        }
        
        .navbar-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
        }
        
        .brand-logo {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--darker);
            transition: var(--transition);
        }
        
        .brand-logo:hover {
            color: var(--gold);
            opacity: 1;
        }
        
        .desktop-nav {
            display: none;
            gap: 40px;
            margin: 0 20px;
        }
        
        .desktop-nav a {
            font-weight: 500;
            font-size: 13px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--text-dark);
            position: relative;
            transition: var(--transition);
            white-space: nowrap;
        }
        
        .desktop-nav a::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--darker);
            transition: width 0.3s ease;
        }
        
        .desktop-nav a:hover {
            color: var(--darker);
            opacity: 1;
        }
        
        .desktop-nav a:hover::after {
            width: 100%;
        }
        
        .nav-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .search-bar-wrapper {
            display: none;
            position: relative;
        }
        
        .nav-search-input {
            width: 300px;
            height: 38px;
            padding: 0 40px 0 16px;
            border: 1px solid var(--gray-300);
            border-radius: 4px;
            background: var(--gray-50);
            outline: none;
            font-size: 13px;
            transition: var(--transition);
        }
        
        .nav-search-input:focus {
            background: var(--white);
            border-color: var(--darker);
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
            width: 350px;
        }
        
        .nav-search-input::placeholder {
            color: var(--gray-500);
        }
        
        .search-icon {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray-600);
            pointer-events: none;
        }
        
        .action-icon {
            color: var(--darker);
            display: flex;
            align-items: center;
            transition: var(--transition);
            position: relative;
        }
        
        .action-icon:hover {
            color: var(--gold);
            opacity: 1;
            transform: translateY(-2px);
        }
        
        .btn-sm {
            padding: 8px 20px;
            font-size: 13px;
            font-weight: 600;
        }
        
        .auth-buttons {
            display: none;
            gap: 12px;
        }
        
        .user-profile-link {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: var(--darker);
            transition: var(--transition);
            padding: 4px 8px;
            border-radius: 6px;
        }
        
        .user-profile-link:hover {
            background-color: var(--gray-50);
            color: var(--gold);
        }

        .profile-icon {
            color: var(--darker);
        }

        .user-name {
            font-size: 14px;
            font-weight: 600;
            color: inherit;
            display: none;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .btn-logout-text {
            background: none;
            border: 1px solid var(--gray-300);
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            color: var(--darker);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .btn-logout-text:hover {
            background: var(--gray-50);
            border-color: var(--darker);
        }
        
        .theme-toggle {
            cursor: pointer;
            border: none;
            background: none;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            color: var(--darker);
            border-radius: 50%;
            transition: var(--transition);
        }
        
        .theme-toggle:hover {
            background-color: var(--gray-100);
            color: var(--gold);
        }
        
        .mobile-menu-toggle {
            background: none;
            display: block;
            color: var(--darker);
            padding: 8px;
        }
        
        .mobile-menu {
            position: fixed;
            top: 64px;
            left: 0;
            width: 100%;
            height: calc(100vh - 64px);
            background: var(--white);
            z-index: 999;
            padding: 24px 40px;
            display: flex;
            flex-direction: column;
            animation: slideDown 0.3s ease-out forwards;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mobile-menu nav {
            display: flex;
            flex-direction: column;
            gap: 0;
        }
        
        .mobile-menu nav a {
            padding: 16px 0;
            font-weight: 600;
            font-size: 18px;
            color: var(--text-dark);
            border-bottom: 1px solid var(--gray-100);
            transition: var(--transition);
        }
        
        .mobile-menu nav a:hover {
            color: var(--darker);
            padding-left: 8px;
        }
        
        @media (min-width: 768px) {
            .desktop-nav {
                display: flex;
            }
            
            .auth-buttons {
                display: flex;
            }
            
            .user-name {
                display: block;
            }
            
            .mobile-menu-toggle {
                display: none;
            }
            
            .search-bar-wrapper {
                display: block;
            }
            
            .mobile-menu {
                display: none;
            }
        }
        
        @media (min-width: 1024px) {
            .navbar-content {
                height: 72px;
            }
            
            .nav-search-input {
                width: 450px;
            }
            
            .nav-search-input:focus {
                width: 500px;
            }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
