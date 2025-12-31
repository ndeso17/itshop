import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const BuyNow = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize from navigation state
    const [items, setItems] = useState(() => {
        if (location.state?.products) {
            return location.state.products.map(p => ({
                ...p,
                qty: Number(p.qty) || Number(p.quantity) || 1,
                price: Number(p.price) || 0
            }));
        }
        return location.state?.product ? [{ ...location.state.product, qty: 1, price: Number(location.state.product.price) || 0 }] : [];
    });

    useEffect(() => {
        if (!items || items.length === 0) {
            navigate("/products");
        }
    }, [items, navigate]);

    if (!items || items.length === 0) return null;

    // Form State
    const [formData, setFormData] = useState({
        name: user?.full_name || "",
        phone: user?.phone_number || user?.phone || user?.phoneNumber || "",
        address: user?.address || ""
    });

    const [selectedVoucher, setSelectedVoucher] = useState("");
    const [selectedShipping, setSelectedShipping] = useState("");
    const [selectedPayment, setSelectedPayment] = useState("");

    // Mock Data
    const vouchers = [
        { id: "V01", name: "Diskon Pengguna Baru", value: 10000 },
        { id: "V02", name: "Gratis Ongkir", value: 15000 },
        { id: "V03", name: "Flash Sale", value: 5000 }
    ];

    const shippingMethods = [
        { id: "JNE", name: "JNE Regular", price: 15000 },
        { id: "JNT", name: "J&T Express", price: 15000 },
        { id: "SICEPAT", name: "SiCepat Halu", price: 12000 },
        { id: "GOSEND", name: "GoSend Instant", price: 35000 }
    ];

    const paymentMethods = [
        { id: "COD_CHECK", name: "paymentCODCheck" },
        { id: "COD", name: "paymentCOD" },
        { id: "CC", name: "paymentCreditCard" },
        { id: "TRANSFER", name: "paymentTransfer" },
        { id: "EWALLET", name: "paymentEWallet" }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Dynamic Shipping Cost
    const shippingCost = selectedShipping
        ? shippingMethods.find(m => m.id === selectedShipping)?.price || 0
        : 0;

    // Dynamic Discount
    const discount = selectedVoucher
        ? vouchers.find(v => v.id === selectedVoucher)?.value || 0
        : 0;

    const total = Math.max(0, subtotal + shippingCost - discount);

    const handleCreateOrder = () => {
        if (!formData.name || !formData.phone || !formData.address || !selectedShipping || !selectedPayment) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Data",
                text: "Please fill in all shipping and payment details.",
                customClass: { popup: "swal-custom-popup" }
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Order Created!",
            text: "Thank you for your order.",
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: "swal-custom-popup" }
        }).then(() => {
            navigate("/profile");
        });
    };

    // Format price
    const formatPrice = (amount) => {
        switch (i18n.language) {
            case "id":
                return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount * 15000);
            case "kr": return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", minimumFractionDigits: 0 }).format(amount * 1300);
            default: return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
        }
    };

    return (
        <div className="cart-page container">
            <div className="page-header-flex">
                <h1 className="page-title">{t("cart.createOrder") || "Buat Pesanan"}</h1>
            </div>

            <div className="cart-layout">
                {/* Left Column: Items & Address */}
                <div className="checkout-left">
                    {/* Items Section */}
                    <div className="cart-items section-box">
                        {items.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="item-details">
                                    <div className="item-header">
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <div className="item-footer">
                                        <span className="item-qty">Qty: {item.qty}</span>
                                        <span className="item-price">{formatPrice(item.price * item.qty)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Address Section */}
                    <div className="address-section section-box">
                        <h3>{t("cart.shippingAddress")}</h3>
                        <div className="form-group">
                            <label>{t("cart.recipientName")}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder={t("cart.recipientName")}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("cart.phoneNumber")}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder={t("cart.phoneNumber")}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("cart.address")}</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder={t("cart.address")}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary & Selects */}
                <div className="cart-summary">
                    <h3>{t("cart.orderSummary")}</h3>

                    {/* Promo & Voucher */}
                    <div className="selector-group">
                        <label className="selector-label">{t("cart.promoVoucher")}</label>
                        <select
                            className="custom-select"
                            value={selectedVoucher}
                            onChange={(e) => setSelectedVoucher(e.target.value)}
                        >
                            <option value="">{t("cart.selectVoucher") || "Select Voucher"}</option>
                            {vouchers.map(v => (
                                <option key={v.id} value={v.id}>{v.name} (-{formatPrice(v.value)})</option>
                            ))}
                        </select>
                    </div>

                    {/* Shipping Method */}
                    <div className="selector-group">
                        <label className="selector-label">{t("cart.shippingMethod")}</label>
                        <select
                            className="custom-select"
                            value={selectedShipping}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                        >
                            <option value="">{t("cart.selectShipping") || "Select Shipping"}</option>
                            {shippingMethods.map(m => (
                                <option key={m.id} value={m.id}>{m.name} (+{formatPrice(m.price)})</option>
                            ))}
                        </select>
                    </div>

                    {/* Payment Method */}
                    <div className="selector-group">
                        <label className="selector-label">{t("cart.paymentMethod")}</label>
                        <select
                            className="custom-select"
                            value={selectedPayment}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        >
                            <option value="">{t("cart.selectPayment") || "Select Payment"}</option>
                            {paymentMethods.map(m => (
                                <option key={m.id} value={m.id}>{t(`cart.${m.name}`) || m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                        <span>{t("cart.subtotal")}</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    {/* Shipping Cost Display */}
                    {selectedShipping && (
                        <div className="summary-row">
                            <span>{t("cart.shipping")}</span>
                            <span>{formatPrice(shippingCost)}</span>
                        </div>
                    )}
                    {/* Discount Display */}
                    {selectedVoucher && (
                        <div className="summary-row">
                            <span>{t("cart.voucher")}</span>
                            <span style={{ color: '#ea5b6d' }}>- {formatPrice(discount)}</span>
                        </div>
                    )}

                    <div className="summary-divider"></div>
                    <div className="summary-total">
                        <span>{t("cart.total")}</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <button
                        className="btn btn-primary btn-block checkout-btn"
                        onClick={handleCreateOrder}
                    >
                        {t("cart.createOrder")} <ArrowRight size={18} />
                    </button>

                    <div className="secure-checkout">
                        <span>🔒 {t("cart.secureCheckout")}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .cart-page { padding: 30px 20px 80px; max-width: 1200px; margin: 0 auto; }
                .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
                .page-title { font-size: 28px; font-weight: 700; color: #2c2c2c; margin: 0; }
                
                .cart-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; align-items: start; }
                
                .checkout-left { display: flex; flex-direction: column; gap: 20px; }
                .section-box { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
                
                /* Form Styles */
                .address-section h3 { font-size: 18px; margin-bottom: 15px; color: #2c2c2c; }
                .form-group { margin-bottom: 15px; }
                .form-group label { display: block; font-size: 14px; font-weight: 600; color: #555; margin-bottom: 6px; }
                .form-group input, .form-group textarea, .custom-select {
                    width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; transition: border 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus, .custom-select:focus { outline: none; border-color: #2c2c2c; }
                .form-group textarea { min-height: 80px; resize: vertical; }

                /* Selectors in Summary */
                .selector-group { margin-bottom: 15px; }
                .selector-label { display: block; font-size: 13px; font-weight: 600; color: #888; margin-bottom: 5px; }
                
                .cart-items .cart-item { border: none; padding: 0; margin-bottom: 20px; }
                .cart-items .cart-item:last-child { margin-bottom: 0; }
                .item-image { width: 80px; height: 80px; background: #f8f8f8; border-radius: 8px; overflow: hidden; }
                .item-image img { width: 100%; height: 100%; object-fit: cover; }
                .item-details { flex: 1; padding-left: 15px; display: flex; flex-direction: column; justify-content: center; }
                .quantity-controls { transform: scale(0.9); transform-origin: left; }

                .cart-summary { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); position: sticky; top: 20px; }
                .cart-summary h3 { margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #2c2c2c; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; color: #666; }
                .summary-row span:last-child { font-weight: 600; color: #2c2c2c; }
                .summary-divider { height: 1px; background: #e0e0e0; margin: 15px 0; }
                .summary-total { display: flex; justify-content: space-between; font-size: 20px; font-weight: 700; color: #2c2c2c; margin-bottom: 25px; }
                .checkout-btn { width: 100%; background: #2c2c2c; color: white; border: none; padding: 15px; border-radius: 10px; font-weight: 600; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; }
                .checkout-btn:hover { background: #1a1a1a; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .secure-checkout { text-align: center; margin-top: 15px; font-size: 12px; color: #888; }
                
                @media (max-width: 968px) { .cart-layout { grid-template-columns: 1fr; } .cart-summary { position: static; } }
            `}</style>
        </div>
    );
};

export default BuyNow;
