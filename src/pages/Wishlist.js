import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const { t } = useTranslation();
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
  };

  const clearAllWishlist = () => {
    if (window.confirm(t("wishlist.confirmClear"))) {
      setWishlistItems([]);
      localStorage.removeItem("wishlist");
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page container empty-wishlist">
        <h2>Your Wishlist is Empty</h2>
        <p>Save items you love for later.</p>
        <Link to="/products" className="btn btn-primary mt-4">
          {t("common.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      <div className="page-header-flex">
        <h1 className="page-title">My Wishlist ({wishlistItems.length})</h1>
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
              <span className="item-price">${item.price.toFixed(2)}</span>

              <div className="item-actions">
                <button className="btn btn-primary btn-sm btn-move">
                  <ShoppingBag size={16} /> Move to Cart
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
