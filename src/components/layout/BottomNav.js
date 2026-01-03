import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoHomeOutline,
  IoGridOutline,
  IoHeartOutline,
  IoBagOutline,
  IoPersonOutline,
} from "react-icons/io5";

const BottomNav = () => {
  const { t } = useTranslation();

  // Helper to determine active state class
  const getLinkClass = ({ isActive }) =>
    `nav-link text-center ${
      isActive ? "active text-primary-custom" : "text-secondary"
    }`;

  return (
    <nav
      className="navbar fixed-bottom bg-navbar d-md-none border-top"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="container-fluid">
        <div className="d-flex justify-content-around w-100 py-1">
          <NavLink to="/" className={getLinkClass}>
            <IoHomeOutline size={22} className="mb-0.5" />
            <small className="d-block" style={{ fontSize: "10px" }}>
              {t("nav.home") || "Home"}
            </small>
          </NavLink>

          <NavLink to="/products" className={getLinkClass}>
            <IoGridOutline size={22} className="mb-0.5" />
            <small className="d-block" style={{ fontSize: "10px" }}>
              {t("nav.shop") || "Shop"}
            </small>
          </NavLink>

          <NavLink to="/wishlist" className={getLinkClass}>
            <IoHeartOutline size={22} className="mb-0.5" />
            <small className="d-block" style={{ fontSize: "10px" }}>
              {t("nav.wishlist") || "Wishlist"}
            </small>
          </NavLink>

          <NavLink to="/cart" className={getLinkClass}>
            <IoBagOutline size={22} className="mb-0.5" />
            <small className="d-block" style={{ fontSize: "10px" }}>
              {t("nav.cart") || "Cart"}
            </small>
          </NavLink>

          <NavLink to="/profile" className={getLinkClass}>
            <IoPersonOutline size={22} className="mb-0.5" />
            <small className="d-block" style={{ fontSize: "10px" }}>
              {t("nav.profile") || "Profile"}
            </small>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
