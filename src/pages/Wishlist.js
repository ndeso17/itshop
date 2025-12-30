import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useToast } from "../context/ToastContext";
import { addToCart } from "../utils/cart";

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
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
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    addToast(t("wishlist.removed") || "Removed from wishlist", "info");
  };

  const clearAllWishlist = () => {
    Swal.fire({
      title: t("wishlist.confirmClear") || "Clear wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("common.yes") || "Yes",
      cancelButtonText: t("common.no") || "No",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setWishlistItems([]);
        localStorage.removeItem("wishlist");
        addToast(t("wishlist.cleared") || "Wishlist cleared", "success");
      }
    });
  };

  const handleMoveToCart = (item) => {
    addToCart(item, t);
    addToast(t("cart.added"), "success");
    removeFromWishlist(item.id);
  };

  const formatPrice = (amount) => {
    switch (i18n.language) {
      case "id":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount * 15000);
      case "kr":
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
          minimumFractionDigits: 0,
        }).format(amount * 1300);
      default:
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page container empty-wishlist">
        <h2>{t("wishlist.empty") || "Your Wishlist is Empty"}</h2>
        <p>{t("wishlist.emptyDesc") || "Save items you love for later."}</p>
        <Link to="/products" className="btn btn-primary mt-4">
          {t("common.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      <div className="page-header-flex">
        <h1 className="page-title">
          {t("wishlist.title") || "My Wishlist"} ({wishlistItems.length})
        </h1>
        <button
          className="btn btn-secondary btn-sm btn-clear-wishlist"
          onClick={clearAllWishlist}
          disabled={wishlistItems.length === 0}
        >
          <Trash2 size={16} style={{ marginRight: "5px" }} />{" "}
          {t("wishlist.clearAll")}
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-item fade-in">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info">
              <span className="item-cat">{item.category}</span>
              <Link to={`/products/${item.id}`} className="item-name">
                {item.name}
              </Link>
              <span className="item-price">{formatPrice(item.price)}</span>

              <div className="item-actions">
                <button 
                  className="btn btn-primary btn-sm btn-move"
                  onClick={() => handleMoveToCart(item)}
                >
                  <ShoppingBag size={16} /> {t("wishlist.moveToCart") || "Move to Cart"}
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
        ))}
      </div>

      <style>{`
        .page-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        .btn-clear-wishlist {
            background-color: #fff;
            color: #dc3545;
            border: 1px solid #dc3545;
            display: flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .btn-clear-wishlist:hover {
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
