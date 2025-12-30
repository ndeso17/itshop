import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { products } from "../data/products";
import { addToCart } from "../utils/cart";

const Wishlist = () => {
  const { t, i18n } = useTranslation();
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

  const handleMoveToCart = (product) => {
    addToCart(product, t);
    removeFromWishlist(product.id);
  };

  const formatPrice = (price) => {
    if (!price) return "";

    // Check for 'id' directly
    if (i18n.language === "id") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(price * 15000);
    }

    // Check for 'kr' or 'ko' or 'ko-KR'
    if (i18n.language === "kr" || i18n.language === "ko" || i18n.language === "ko-KR") {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
      }).format(price * 1300);
    }

    // Default to USD
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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
        <h1 className="page-title">{t("common.myWishlist")} ({wishlistItems.length})</h1>
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
          // Ensure both IDs are compared as strings or numbers
          const productDetails = products.find(p => String(p.id) === String(item.id)) || item;

          // Name Translation
          let displayName = productDetails.name;
          if (typeof productDetails.name === 'object') {
            displayName = productDetails.name[i18n.language] || (i18n.language === 'kr' ? productDetails.name['ko'] : null) || (i18n.language === 'ko' ? productDetails.name['kr'] : null) || productDetails.name["en"];
          }

          // Category Translation
          const categoryName = productDetails.category || (productDetails.categories && productDetails.categories[0]) || "General";
          const displayCategory = t(`category.${categoryName.toLowerCase()}`, { defaultValue: categoryName });

          return (
            <div key={item.id} className="wishlist-item fade-in">
              <div className="item-image">
                <img src={productDetails.image} alt={displayName} />
              </div>
              <div className="item-info">
                <span className="item-cat">{displayCategory}</span>
                <Link to={`/products/${item.id}`} className="item-name">
                  {displayName}
                </Link>
                <span className="item-price">{formatPrice(productDetails.price)}</span>

                <div className="item-actions">
                  <button
                    className="btn btn-primary btn-sm btn-move"
                    onClick={() => handleMoveToCart(productDetails)}
                  >
                    <ShoppingBag size={16} /> {t("wishlist.moveToCart")}
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
                    gap: 10px;
                }
                .btn-move {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                .btn-remove {
                    padding: 8px 12px;
                }
            `}</style>
    </div>
  );
};

export default Wishlist;
