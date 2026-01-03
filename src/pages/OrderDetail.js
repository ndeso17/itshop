import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { ArrowLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { getCheckoutDetail } from "../api/checkout";
import { useTranslation } from "react-i18next";

import { formatCurrency } from "../utils/currency";

const OrderDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();

  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await getCheckoutDetail(id);
        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.message);
        }
      } catch {
        setError("Failed to load order detail");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return <div className="container py-5 text-center">Loading...</div>;
  if (error || !order)
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="container order-detail-page">
      <Link to="/orders" className="back-link mb-4">
        <ArrowLeft size={18} /> Back to Orders
      </Link>

      <div className="order-header-card">
        <div className="flex justify-between items-start">
          <div>
            <h1>Order #{order.id}</h1>
            <p className="text-muted">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <div className={`status-badge-lg ${order.status?.toLowerCase()}`}>
            {order.status}
          </div>
        </div>

        {/* Helper Action: Track Order */}
        {["shipped", "delivered"].includes(order.status?.toLowerCase()) && (
          <Link
            to={`/orders/${order.id}/track`}
            className="btn btn-dark mt-3 inline-flex items-center gap-2"
          >
            <Truck size={18} /> Track Package
          </Link>
        )}
      </div>

      <div className="order-grid">
        {/* Left Col: Items */}
        <div className="items-section">
          <h3 className="section-title">Items</h3>
          <div className="items-list">
            {order.items &&
              order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-img">
                    {/* Fallback if image not present in item structure, depends on API */}
                    <img
                      src={item.image || "https://via.placeholder.com/80"}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>
                      Qty: {item.qty} x{" "}
                      {formatCurrency(item.price, i18n.language)}
                    </p>
                    {item.variant && (
                      <span className="variant-tag">{item.variant}</span>
                    )}
                  </div>
                  <div className="item-total">
                    {formatCurrency(item.price * item.qty, i18n.language)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="info-sidebar">
          <div className="info-card">
            <h3>
              <MapPin size={18} /> Shipping Address
            </h3>
            <p className="address-text">
              {order.shipping_address || order.address}
            </p>
          </div>

          <div className="info-card">
            <h3>
              <CreditCard size={18} /> Payment Info
            </h3>
            <p>Method: {order.payment_method}</p>
            <p>Status: {order.payment_status || order.status}</p>
          </div>

          <div className="info-card summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>
                {formatCurrency(
                  order.subtotal ||
                    order.total_amount - (order.shipping_cost || 0),
                  i18n.language
                )}
              </span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {formatCurrency(order.shipping_cost || 0, i18n.language)}
              </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount, i18n.language)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-detail-page { padding: 40px 0; min-height: 80vh; }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: #666; font-weight: 500; margin-bottom: 20px; }
        
        .order-header-card { 
            background: white; padding: 30px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 30px; 
        }
        .order-header-card h1 { margin: 0; font-size: 28px; color: var(--darker); }
        
        .status-badge-lg { 
            padding: 8px 16px; border-radius: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;
        }
        .status-badge-lg.pending { background: #fff3cd; color: #856404; }
        .status-badge-lg.paid { background: #cce5ff; color: #004085; }
        .status-badge-lg.shipped { background: #d4edda; color: #155724; }
        
        .order-grid { display: grid; grid-template-columns: 1fr 350px; gap: 30px; }
        
        .section-title { font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        
        .items-list { background: white; border-radius: 12px; border: 1px solid #eee; overflow: hidden; }
        .order-item { display: flex; align-items: center; padding: 20px; border-bottom: 1px solid #eee; }
        .order-item:last-child { border-bottom: none; }
        
        .item-img { width: 80px; height: 80px; background: #f8f8f8; border-radius: 8px; overflow: hidden; margin-right: 20px; flex-shrink: 0; }
        .item-img img { width: 100%; height: 100%; object-fit: cover; }
        
        .item-info { flex: 1; }
        .item-info h4 { margin: 0 0 5px 0; font-size: 16px; }
        .variant-tag { font-size: 12px; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; color: #666; }
        
        .item-total { font-weight: 700; font-size: 16px; }
        
        .info-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 20px; }
        .info-card h3 { font-size: 16px; display: flex; align-items: center; gap: 10px; margin: 0 0 15px 0; color: var(--darker); }
        
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666; }
        .summary-divider { height: 1px; background: #eee; margin: 15px 0; }
        .summary-row.total { font-size: 18px; font-weight: 700; color: var(--darker); margin-bottom: 0; }
        
        @media(max-width: 768px) {
            .order-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
