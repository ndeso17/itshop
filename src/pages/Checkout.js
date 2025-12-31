import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    MapPin,
    ChevronRight,
    Truck,
    CreditCard,
    Ticket,
    ShieldCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Checkout = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    // Mock initial data - normally this comes from Cart or Context
    // accessing via localStorage directly since Cart.js saves to it
    const [cartItems] = useState(() => {
        try {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [shippingMethod, setShippingMethod] = useState("Regular");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // Shipping Methods Mock
    const shippingOptions = [
        { id: "Regular", label: "Regular", price: 15000, eta: "3-5 Hari" },
        { id: "Instant", label: "Instant", price: 35000, eta: "3 Jam" },
        { id: "Prioritas", label: "Prioritas", price: 25000, eta: "1 Hari" },
        { id: "Next Day", label: "Next Day", price: 20000, eta: "Senin" },
        { id: "Hemat", label: "Hemat Kargo", price: 10000, eta: "5-7 Hari" },
    ];

    // Payment Methods Mock
    const paymentOptions = [
        { id: "COD_CEK", label: "COD - Cek Dulu" },
        { id: "COD", label: "COD" },
        { id: "CC", label: "Kartu Kredit/Debit" },
        { id: "TRANSFER", label: "Transfer Bank" },
        { id: "SPAY", label: "SPayLater" },
        { id: "SHOPEEPAY", label: "Saldo Shopee Pay" },
        { id: "MITRA", label: "Bayar Tunai Mitra/Agen" },
    ];

    // Calculations
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (item.qty || 1);
    }, 0);

    const selectedShipping =
        shippingOptions.find((s) => s.id === shippingMethod) || shippingOptions[0];
    const shippingCost = selectedShipping.price;
    const serviceFee = 1000;
    const total = subtotal + shippingCost + serviceFee;

    const handlePlaceOrder = () => {
        Swal.fire({
            title: "Confirm Order",
            text: `Total payment: Rp ${total.toLocaleString()}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Place Order",
            customClass: {
                popup: "swal-custom-popup",
                confirmButton: "swal-confirm-btn",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Order Placed!",
                    text: "Thank you for your purchase.",
                    timer: 2000,
                }).then(() => {
                    localStorage.removeItem("cart");
                    navigate("/products");
                });
            }
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: "40px", textAlign: "center" }}>
                <h2>No items to checkout</h2>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/products")}
                >
                    Back to Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container container">
                <div className="checkout-header-logo">
                    <span className="brand-highlight">CHECKOUT</span>
                </div>

                {/* Address Section */}
                <div className="checkout-card address-card">
                    <div className="card-header-line">
                        <MapPin size={18} className="text-primary" />
                        <h3>Alamat Pengiriman</h3>
                    </div>
                    <div className="address-content">
                        <div className="user-details">
                            <strong>Fajar Niko Pratama</strong> | (+62) 812-3456-7890
                        </div>
                        <div className="address-text">
                            Jalan Teknologi No. 12, Komplek IT Shop, Jakarta Selatan, DKI Jakarta
                            12345
                        </div>
                        <div className="address-badges">
                            <span className="badge badge-primary">Utama</span>
                            <span className="badge badge-secondary">Kantor</span>
                        </div>
                    </div>
                    <button className="btn-change">Ubah</button>
                </div>

                {/* Products Section */}
                <div className="checkout-card product-card">
                    <div className="card-header-line">
                        <h3>Produk Dipesan</h3>
                    </div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="checkout-item">
                            <div className="seller-info">
                                <span className="seller-badge">Official Store</span>
                                <span className="seller-name">{item.brand || "ITShop Official"}</span>
                            </div>
                            <div className="item-row">
                                <img src={item.image} alt={item.name} className="item-thumb" />
                                <div className="item-info">
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-variant">Variasi: Default</div>
                                </div>
                                <div className="item-pricing">
                                    <div className="item-price">
                                        Rp {Number(item.price).toLocaleString()}
                                    </div>
                                    <div className="item-qty">x{item.qty}</div>
                                    <div className="item-subtotal">
                                        Rp {(Number(item.price) * item.qty).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Voucher Section */}
                <div className="checkout-card voucher-card">
                    <div className="voucher-row">
                        <div className="flex-center">
                            <Ticket size={18} className="icon-gold" />
                            <span>Promo & Voucher</span>
                        </div>
                        <button className="text-link">Pilih Voucher</button>
                    </div>
                </div>

                {/* Shipping Method Filter */}
                <div className="checkout-card shipping-card">
                    <h3>Metode Pengiriman</h3>
                    <div className="filter-chips">
                        {shippingOptions.map((option) => (
                            <button
                                key={option.id}
                                className={`chip ${shippingMethod === option.id ? "active" : ""}`}
                                onClick={() => setShippingMethod(option.id)}
                            >
                                {option.label}
                                {shippingMethod === option.id && (
                                    <div className="chip-check">✓</div>
                                )}
                            </button>
                        ))}
                        <button className="chip">Lainnya</button>
                    </div>
                    <div className="selected-shipping-info">
                        <span>Estimasi tiba: {selectedShipping.eta}</span>
                        <span className="price">
                            Rp {selectedShipping.price.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Payment Method Filter */}
                <div className="checkout-card payment-card">
                    <h3>Metode Pembayaran</h3>
                    <div className="filter-chips">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.id}
                                className={`chip ${paymentMethod === option.id ? "active" : ""}`}
                                onClick={() => setPaymentMethod(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="checkout-footer">
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Total Pesanan ({cartItems.length} Produk)</span>
                            <span>Rp {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Total Pengiriman</span>
                            <span>Rp {shippingCost.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Biaya Layanan</span>
                            <span>Rp {serviceFee.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="footer-action">
                        <div className="total-display">
                            <span className="label">Total Pembayaran</span>
                            <span className="value">Rp {total.toLocaleString()}</span>
                        </div>
                        <button className="btn-place-order" onClick={handlePlaceOrder}>
                            Buat Pesanan
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .checkout-page {
          background-color: #f3f4f6;
          min-height: 100vh;
          padding-top: 20px;
          padding-bottom: 100px;
          font-family: 'Inter', sans-serif;
        }
        .checkout-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .checkout-header-logo {
          padding: 15px 0;
          margin-bottom: 10px;
          border-left: 4px solid var(--primary);
          padding-left: 15px;
          color: var(--primary);
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 1px;
        }
        
        /* Cards */
        .checkout-card {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          padding: 24px;
          margin-bottom: 20px;
          position: relative;
        }
        .card-header-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
          color: var(--primary);
        }
        .card-header-line h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        /* Address */
        .address-content {
          font-size: 14px;
          color: #444;
          line-height: 1.6;
        }
        .user-details {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .address-badges {
          margin-top: 8px;
          display: flex;
          gap: 5px;
        }
        .badge {
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 2px;
          border: 1px solid #ddd;
        }
        .badge-primary {
          color: var(--primary);
          border-color: var(--primary);
        }
        .btn-change {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          color: blue;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }
        
        /* Products */
        .checkout-item {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .checkout-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }
        .seller-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .seller-badge {
          background: #d0011b;
          color: white;
          padding: 2px 4px;
          font-size: 10px;
          border-radius: 2px;
        }
        .item-row {
          display: flex;
          gap: 15px;
        }
        .item-thumb {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #eee;
        }
        .item-info {
          flex: 1;
        }
        .item-name {
          font-size: 14px;
          margin-bottom: 4px;
          line-height: 1.4;
        }
        .item-variant {
          font-size: 12px;
          color: #888;
          background: #f5f5f5;
          display: inline-block;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .item-pricing {
          text-align: right;
          font-size: 14px;
        }
        .item-subtotal {
          font-weight: 700;
          margin-top: 5px;
        }
        
        /* Voucher */
        .voucher-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
        .flex-center {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }
        .icon-gold {
          color: #f5a623;
        }
        .text-link {
          background: none;
          border: none;
          color: blue;
          cursor: pointer;
        }
        
        /* Filter Chips */
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        .chip {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
          color: #555;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .chip:hover {
          border-color: #bbb;
        }
        .chip.active {
          border-color: #d0011b;
          color: #d0011b;
          background: #fff5f5;
        }
        .chip-check {
          position: absolute;
          top: -1px;
          right: -1px;
          background: #d0011b;
          color: white;
          font-size: 8px;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom-left-radius: 4px;
        }
        
        /* Selected Shipping Info */
        .selected-shipping-info {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #eee;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #666;
        }
        
        /* Summary Footer */
        .checkout-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-top: 1px solid #eee;
          padding: 20px 0;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
          z-index: 100;
        }
        .summary-details {
          max-width: 800px;
          margin: 0 auto;
          margin-bottom: 15px;
          padding: 0 20px;
          font-size: 14px;
          color: #666;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .footer-action {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 20px;
        }
        .total-display {
          text-align: right;
        }
        .total-display .label {
          display: block;
          font-size: 12px;
          color: #888;
        }
        .total-display .value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #d0011b;
        }
        .btn-place-order {
          background: #d0011b;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(208, 1, 27, 0.2);
          transition: all 0.2s;
        }
        .btn-place-order:hover {
          background: #b00117;
        }
        
        @media (max-width: 600px) {
           .checkout-footer {
              padding: 15px;
           }
           .footer-action {
              justify-content: space-between;
              gap: 10px;
           }
           .btn-place-order {
              padding: 10px 20px;
              font-size: 14px;
           }
        }
      `}</style>
        </div>
    );
};

export default Checkout;
