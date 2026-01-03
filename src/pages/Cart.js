import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { getCart } from "../api/cart";

import { formatCurrency } from "../utils/currency";

const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Initialize cartItems
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from API
  React.useEffect(() => {
    const fetchCart = async () => {
      const result = await getCart();
      if (result.success && result.data && result.data.items) {
        const mappedItems = result.data.items.map((item) => ({
          id: item.cart_item_id, // Use cart_item_id as primary ID
          product_id: item.product.id,
          variant_id: item.variant.id,
          name: item.product.name,
          image: item.product.image,
          price: item.price,
          qty: item.qty,
          category: item.product.category, // Assuming category name might be here or undefined
          original_data: item,
        }));
        setCartItems(mappedItems);
      }
    };
    fetchCart();
  }, []);

  // Removed localStorage sync to prioritize API source

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentQty = Number(item.qty) || Number(item.quantity) || 1;
          const newQty = Math.max(1, currentQty + delta);
          return { ...item, qty: newQty, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    Swal.fire({
      title: t("cart.confirmRemoveItem") || "Remove this item?",
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
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: t("cart.removed") || "Removed",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-custom-popup",
          },
        });
      }
    });
  };

  const clearAllCart = () => {
    Swal.fire({
      title: t("cart.confirmClear"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("cart.clearAll"),
      cancelButtonText: t("common.cancel") || "Cancel",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn-danger",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems([]);
        localStorage.removeItem("cart");
        Swal.fire({
          icon: "success",
          title: t("cart.cleared") || "Cart cleared",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: "swal-custom-popup",
          },
        });
      }
    });
  };

  // Checkout Selection Logic
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize selectedItems to empty or all?
  // User asked for choice. Let's auto-select all initially for better UX, or empty?
  // Let's go with empty initially to force choice, or all.
  // Actually, usually carts select all by default.
  // But let's follow the "pilih salah satu atau pilih semua" literally.

  const handleSelectItem = (id) => {
    setSelectedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // Filter calculation based on selection
  const subtotal = cartItems.reduce((sum, item) => {
    if (!selectedItems.includes(item.id)) return sum;
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  // Voucher Discount Logic (Mock)
  const voucherDiscount =
    selectedItems.length > 0 ? 5000 * selectedItems.length : 0;
  const total = Math.max(0, subtotal - voucherDiscount);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container empty-cart">
        <h2>{t("cart.emptyCart")}</h2>
        <p>{t("cart.emptyCartDesc") || "Start adding items to your cart"}</p>
        <Link to="/products" className="btn btn-primary mt-4">
          {t("common.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="page-header-flex">
        <h1 className="page-title">{t("cart.shoppingCart")}</h1>
        <button
          className="btn btn-clear-all"
          onClick={clearAllCart}
          disabled={cartItems.length === 0}
        >
          <Trash2 size={16} /> {t("cart.clearAll")}
        </button>
      </div>

      <div className="cart-controls">
        <label className="select-all-checkbox">
          <input
            type="checkbox"
            checked={
              cartItems.length > 0 && selectedItems.length === cartItems.length
            }
            onChange={handleSelectAll}
            disabled={cartItems.length === 0}
          />
          {t("cart.selectAll")}
        </label>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => {
            const qty = Number(item.qty) || Number(item.quantity) || 1;
            const price = Number(item.price) || 0;

            return (
              <div
                key={item.id}
                className={`cart-item ${
                  selectedItems.includes(item.id) ? "selected" : ""
                }`}
              >
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </div>
                <div className="item-image">
                  <Link to={`/products/${item.id}`}>
                    <img src={item.image} alt={item.name} />
                  </Link>
                </div>
                <div className="item-details">
                  <div className="item-header">
                    <Link to={`/products/${item.id}`} className="item-name">
                      {item.name}
                    </Link>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {item.category && (
                    <div className="item-category">
                      {t(`category.${item.category.toLowerCase()}`, {
                        defaultValue: item.category,
                      })}
                    </div>
                  )}
                  <div className="item-footer">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        <Minus size={16} />
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="item-price">
                      {formatCurrency(price * qty, i18n.language)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h3>{t("cart.orderSummary")}</h3>
          <div className="summary-row">
            <span>{t("cart.subtotal")}</span>
            <span>{formatCurrency(subtotal, i18n.language)}</span>
          </div>
          <div className="summary-row">
            <span>{t("cart.subtotal")}</span>
            <span>{formatCurrency(subtotal, i18n.language)}</span>
          </div>
          <div className="summary-row">
            <span>{t("cart.voucher")}</span>
            <span style={{ color: "#ea5b6d" }}>
              - {formatCurrency(voucherDiscount, i18n.language)}
            </span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>{t("cart.total")}</span>
            <span>{formatCurrency(total, i18n.language)}</span>
          </div>
          <button
            className="btn btn-primary btn-block checkout-btn"
            disabled={selectedItems.length === 0}
            onClick={() => {
              const productsToCheckout = cartItems.filter((item) =>
                selectedItems.includes(item.id)
              );
              navigate("/buy-now", { state: { products: productsToCheckout } });
            }}
          >
            {t("cart.proceedToCheckout")} <ArrowRight size={18} />
          </button>
          <div className="secure-checkout">
            <span>🔒 {t("cart.secureCheckout")}</span>
          </div>
        </div>
      </div>

      <style>{`
        /* SweetAlert Custom Theme */
        .swal-custom-popup {
          border-radius: 16px !important;
          padding: 30px !important;
          font-family: inherit !important;
        }
        .swal-confirm-btn {
          background-color: #2c2c2c !important;
          color: white !important;
          border: none !important;
          padding: 12px 30px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          margin: 0 8px !important;
          transition: all 0.2s !important;
        }
        .swal-confirm-btn:hover {
          background-color: #1a1a1a !important;
          transform: translateY(-2px) !important;
        }
        .swal-confirm-btn-danger {
          background-color: #dc3545 !important;
          color: white !important;
          border: none !important;
          padding: 12px 30px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          margin: 0 8px !important;
        }
        .swal-cancel-btn {
          background-color: #f5f5f5 !important;
          color: #2c2c2c !important;
          border: 1px solid #ddd !important;
          padding: 12px 30px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          margin: 0 8px !important;
        }
        
        /* Cart Page */
        .cart-page {
          padding: 30px 20px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .empty-cart {
          text-align: center;
          padding: 80px 20px;
        }
        .empty-cart h2 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #2c2c2c;
        }
        .empty-cart p {
          color: #666;
          margin-bottom: 30px;
        }
        
        .page-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #2c2c2c;
          margin: 0;
        }

        .cart-controls {
            margin-bottom: 20px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .select-all-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            color: #555;
            cursor: pointer;
        }
        
        .select-all-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--darker);
            cursor: pointer;
        }

        .item-checkbox {
            display: flex;
            align-items: center;
            padding-right: 15px;
        }

        .item-checkbox input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--darker);
            cursor: pointer;
        }

        .checkout-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .btn-clear-all {
          background: white;
          color: #dc3545;
          border: 1.5px solid #dc3545;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .btn-clear-all:hover:not(:disabled) {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }
        .btn-clear-all:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          align-items: start;
        }
        
        .cart-items {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .cart-item {
          display: flex;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item:hover {
          background: #fafafa;
          border-radius: 8px;
        }
        
        .item-image {
          width: 100px;
          height: 100px;
          background: #f8f8f8;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
        }
        .item-name {
          font-weight: 600;
          font-size: 16px;
          color: #2c2c2c;
          text-decoration: none;
          flex: 1;
        }
        .item-name:hover {
          color: #d6a99d;
        }
        .item-category {
          font-size: 13px;
          color: #888;
          text-transform: capitalize;
        }
        .btn-remove {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 4px;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .btn-remove:hover {
          color: #dc3545;
          background: #fff5f5;
        }
        
        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
        }
        .quantity-controls button {
          background: white;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-controls button:hover {
          background: #f5f5f5;
        }
        .quantity-controls span {
          padding: 0 16px;
          font-weight: 600;
          font-size: 15px;
          min-width: 40px;
          text-align: center;
        }
        .item-price {
          font-weight: 700;
          font-size: 18px;
          color: #2c2c2c;
        }
        
        .cart-summary {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 20px;
        }
        .cart-summary h3 {
          margin: 0 0 25px 0;
          font-size: 20px;
          font-weight: 700;
          color: #2c2c2c;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 15px;
          color: #666;
        }
        .summary-row span:last-child {
          font-weight: 600;
          color: #2c2c2c;
        }
        .summary-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 20px 0;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 700;
          color: #2c2c2c;
          margin-bottom: 25px;
        }
        .checkout-btn {
          width: 100%;
          background: #2c2c2c;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .checkout-btn:hover {
          background: #1a1a1a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .secure-checkout {
          text-align: center;
          margin-top: 16px;
          font-size: 13px;
          color: #888;
        }
        
        @media (max-width: 968px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          .cart-summary {
            position: static;
          }
        }
        
        @media (max-width: 640px) {
          .page-header-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          .page-title {
            font-size: 22px;
          }
          .cart-item {
            flex-direction: column;
          }
          .item-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
