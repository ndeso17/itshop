import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import { addToCart as apiAddToCart } from "../api/cart";
import { useAuth } from "../context/AuthContext";

import { formatCurrency } from "../utils/currency";

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Initialize from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse wishlist from localStorage", e);
      return [];
    }
  });

  // Sync to localStorage whenever wishlistItems changes
  React.useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const handleBuyNow = (product) => {
    const lang = i18n.language;
    const name =
      product.name[lang] ||
      (lang === "ko" ? product.name["kr"] : null) ||
      product.name["en"];

    const productData = {
      id: product.id,
      slug: product.slug, // Ensure slug is passed
      name: name,
      price: product.price,
      image: product.image,
      category:
        product.category || (product.categories && product.categories[0]),
    };

    navigate("/buy-now", { state: { product: productData } });
  };

  const removeFromWishlist = (id) => {
    Swal.fire({
      title: t("wishlist.confirmRemoveItem") || "Remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("auth.yes") || "Yes",
      cancelButtonText: t("common.cancel") || "Cancel",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: t("wishlist.removed") || "Removed",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-custom-popup",
          },
        });
      }
    });
  };

  const clearAllWishlist = () => {
    Swal.fire({
      title: t("wishlist.confirmClear"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("wishlist.clearAll"),
      cancelButtonText: t("common.cancel") || "Cancel",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn-danger",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setWishlistItems([]);
        localStorage.removeItem("wishlist");
        Swal.fire({
          icon: "success",
          title: t("wishlist.cleared") || "Wishlist cleared",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-custom-popup",
          },
        });
      }
    });
  };

  const handleMoveToCart = async (product) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: t("auth.loginRequired") || "Login Required",
        text: t("auth.pleaseLogin"),
        showCancelButton: true,
        confirmButtonText: t("auth.login") || "Login",
        cancelButtonText: t("common.cancel") || "Cancel",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    const result = await apiAddToCart({ variant_id: product.id, qty: 1 });

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: t("cart.added"),
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
      });
      removeFromWishlist(product.id);
    } else {
      Swal.fire({
        icon: "error",
        title: t("cart.error"),
        text: result.message,
      });
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page container empty-wishlist">
        <h2>{t("wishlist.emptyTitle")}</h2>
        <p>{t("wishlist.emptySubtitle")}</p>
        <Link to="/products" className="btn btn-primary mt-4">
          {t("common.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      <div className="page-header-flex">
        <h1 className="page-title">{t("common.myWishlist")}</h1>
        <button
          className="btn btn-warning btn-sm"
          onClick={clearAllWishlist}
          disabled={wishlistItems.length === 0}
        >
          <Trash2 size={16} style={{ marginRight: "5px" }} />{" "}
          {t("wishlist.clearAll")}
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => {
          // Find full product details to support dynamic translation
          // Fallback to item itself since products data file is removed
          const productDetails = item;

          // Name Translation
          let displayName = productDetails.name;
          if (typeof productDetails.name === "object") {
            displayName =
              productDetails.name[i18n.language] ||
              (i18n.language === "ko" ? productDetails.name["kr"] : null) ||
              productDetails.name["en"];
          }

          // Category Translation
          const categoryName =
            productDetails.category ||
            (productDetails.categories && productDetails.categories[0]) ||
            "General";
          const displayCategory = t(`category.${categoryName.toLowerCase()}`, {
            defaultValue: categoryName,
          });

          return (
            <div key={item.id} className="wishlist-item fade-in">
              <div className="item-image">
                <Link to={`/products/${item.id}`}>
                  <img src={productDetails.image} alt={displayName} />
                </Link>
              </div>
              <div className="item-info">
                <span className="item-cat">{displayCategory}</span>
                <Link to={`/products/${item.id}`} className="item-name">
                  {displayName}
                </Link>
                <span className="item-price">
                  {formatCurrency(productDetails.price, i18n.language)}
                </span>

                <div className="item-actions">
                  <button
                    className="btn btn-dark btn-sm btn-buy"
                    onClick={() => handleBuyNow(productDetails)}
                  >
                    {t("product.buyNow")}
                  </button>
                  <button
                    className="btn btn-dark btn-sm btn-icon-action"
                    onClick={() => handleMoveToCart(productDetails)}
                    title={t("wishlist.moveToCart")}
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm btn-remove"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .page-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .btn-warning {
            background-color: #fff;
            color: #dc3545;
            border: 1px solid #dc3545;
            display: flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .btn-warning:hover {
            background-color: #dc3545;
            color: #fff;
        }
      `}</style>

      <style>{`
                .wishlist-page {
                    padding-top: 40px;
                    padding-bottom: 80px;
                }
                .empty-wishlist {
                    text-align: center;
                    padding: 100px 20px;
                }
                .page-title {
                    margin-bottom: 40px;
                    font-size: 28px;
                }
                .wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                }
                .wishlist-item {
                    border: 1px solid #eee;
                    border-radius: 4px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .item-image {
                    height: 300px;
                    background: #f5f5f5;
                }
                .item-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .item-info {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .item-cat {
                    font-size: 11px;
                    color: #999;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .item-name {
                    font-weight: 600;
                    margin-bottom: 5px;
                    font-size: 16px;
                }
                .item-price {
                    font-weight: 600;
                    color: var(--darker);
                    margin-bottom: 15px;
                }
                .item-actions {
                    margin-top: auto;
                    display: flex;
                    gap: 8px;
                }
                .btn-buy {
                    flex: 1;
                    background: var(--darker);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    font-weight: 600;
                    padding: 0 16px;
                    height: 40px;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                .btn-buy:hover {
                    background: #000;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .btn-icon-action {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 0;
                    flex-shrink: 0;
                }
                .btn-icon-action:first-of-type { /* Cart button */
                   background: var(--darker);
                   color: white;
                }
                .btn-icon-action:first-of-type:hover {
                   background: var(--gold);
                   transform: translateY(-1px);
                }
                
                .btn-remove {
                   /* inherit typical btn styles or kept simple */
                }
            `}</style>
    </div>
  );
};

export default Wishlist;
