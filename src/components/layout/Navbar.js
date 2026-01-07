import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import {
  IoSearchOutline,
  IoPersonOutline,
  IoHeartOutline,
  IoBagOutline,
  IoLogOutOutline,
} from "react-icons/io5";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/products");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: t("common.logout") || "Logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("auth.yes") || "Yes",
      cancelButtonText: t("common.cancel") || "Cancel",
      confirmButtonColor: "var(--cta-primary)",
      cancelButtonColor: "#6c757d",
    });

    if (result.isConfirmed) {
      const logoutResult = await logout();
      if (logoutResult.success) {
        navigate("/");
      }
    }
  };

  return (
    <header className="fixed-top">
      {/* Top Bar - Brand, Search, User Actions */}
      <nav className="navbar navbar-expand-lg bg-navbar shadow-sm py-2">
        <div className="container">
          {/* Brand */}
          <Link
            to="/"
            className="navbar-brand fw-bold text-uppercase"
            style={{ letterSpacing: "2px" }}
          >
            ITShop
          </Link>

          {/* Search Bar - Desktop & Mobile (Simplified on mobile) */}
          <div
            className="d-none d-md-block flex-grow-1 mx-4"
            style={{ maxWidth: "500px" }}
          >
            <form onSubmit={handleSearch} className="input-group">
              <input
                type="text"
                className="form-control border-end-0 bg-white"
                placeholder={
                  t("common.searchPlaceholder") || "Search products..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary border-start-0 bg-white"
                type="submit"
              >
                <IoSearchOutline size={20} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-lg-block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Search Toggle (Optional, if space is tight) */}
            <button
              className="btn btn-link text-dark d-md-none p-0"
              onClick={() => navigate("/products")}
            >
              <IoSearchOutline size={24} />
            </button>

            {/* Desktop Actions */}
            <div className="d-none d-md-flex align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="btn btn-link text-dark text-decoration-none p-0"
                  >
                    <IoPersonOutline size={24} />
                    <span className="ms-1 d-none d-lg-inline">
                      {t("nav.profile") || "Profile"}
                    </span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="btn btn-link text-dark position-relative p-0"
                  >
                    <IoHeartOutline size={24} />
                    {wishlistCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/cart"
                    className="btn btn-link text-dark position-relative p-0"
                  >
                    <IoBagOutline size={24} />
                    {cartCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-dark p-0"
                    title={t("common.logout") || "Logout"}
                  >
                    <IoLogOutOutline size={24} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm rounded-pill px-4"
                  >
                    {t("common.login") || "Login"}
                  </Link>
                  <Link
                    to="/cart"
                    className="btn btn-link text-dark position-relative p-0"
                  >
                    <IoBagOutline size={24} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Cart Icon (Always Visible) */}
            <Link
              to="/cart"
              className="d-md-none btn btn-link text-dark position-relative p-0"
            >
              <IoBagOutline size={24} />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Secondary Nav - Categories (Desktop Only) */}
      <div className="bg-white border-bottom d-none d-md-block">
        <div className="container">
          <ul className="nav justify-content-center py-2">
            {["wanita", "pria", "anak", "bayi", "unisex"].map((cat) => (
              <li className="nav-item" key={cat}>
                <Link
                  to={`/products?category=${cat}`}
                  className="nav-link text-secondary text-uppercase fw-semibold"
                  style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                >
                  {t(`category.${cat}`) || cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
