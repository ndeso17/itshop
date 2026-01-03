import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Package,
  Clock,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { getCheckoutHistory } from "../api/checkout";
import { useAuth } from "../context/AuthContext";

import { formatCurrency } from "../utils/currency";

const OrderHistory = () => {
  const { t, i18n } = useTranslation();

  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getCheckoutHistory();
        if (result.success) {
          // Sort by date desc
          const sorted = Array.isArray(result.data)
            ? result.data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
              )
            : [];
          setOrders(sorted);
        } else {
          setError(result.message);
        }
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container order-history-page">
      <div className="page-header">
        <Link to="/profile" className="back-link">
          <ArrowLeft size={20} /> Back
        </Link>
        <h1>{t("orders.title") || "Order History"}</h1>
      </div>

      {error ? (
        <div className="error-state">
          <AlertCircle size={48} className="text-red-500 mb-3" />
          <p>{error}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <Package size={64} className="text-gray-300 mb-4" />
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary mt-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card fade-in">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    <Clock size={14} className="mr-1" />
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <span
                  className={`status-badge ${getStatusColor(order.status)}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-body">
                <div className="order-summary">
                  <span>Total Amount:</span>
                  <span className="amount">
                    {formatCurrency(order.total_amount, i18n.language)}
                  </span>
                </div>
                <div className="order-items-preview">
                  {/* If API returns items, show count */}
                  {order.items
                    ? `${order.items.length} Items`
                    : "View details for items"}
                </div>
              </div>

              <div className="order-footer">
                <Link to={`/orders/${order.id}`} className="btn-detail">
                  View Details <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-history-page { padding: 40px 0; min-height: 80vh; }
        .page-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
        .page-header h1 { margin: 0; font-size: 24px; }
        .back-link { display: flex; align-items: center; gap: 5px; color: #666; font-weight: 500; }
        
        .empty-state, .error-state { 
            text-align: center; padding: 60px 20px; background: white; 
            border-radius: 12px; border: 1px solid #eee; 
        }

        .orders-list { display: flex; flex-direction: column; gap: 20px; max-width: 800px; margin: 0 auto; }
        
        .order-card { 
            background: white; border: 1px solid #eee; border-radius: 12px; 
            overflow: hidden; transition: box-shadow 0.2s; 
        }
        .order-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .order-header { 
            background: #f8f9fa; padding: 15px 20px; display: flex; 
            justify-content: space-between; align-items: center; border-bottom: 1px solid #eee;
        }
        .order-id { font-weight: 700; color: #333; margin-right: 15px; }
        .order-date { color: #666; font-size: 13px; display: inline-flex; align-items: center; }
        
        .status-badge { 
            padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; 
        }
        
        .order-body { padding: 20px; }
        .order-summary { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 10px; }
        .amount { color: var(--darker); font-size: 18px; }
        .order-items-preview { font-size: 14px; color: #666; }

        .order-footer { padding: 15px 20px; border-top: 1px solid #eee; text-align: right; }
        .btn-detail { 
            display: inline-flex; align-items: center; gap: 5px; color: var(--darker); 
            font-weight: 600; font-size: 14px; transition: gap 0.2s; 
        }
        .btn-detail:hover { gap: 8px; color: var(--gold); }
        
        /* Tailwind Utilities Fallback */
        .bg-yellow-100 { background-color: #fef3c7; } .text-yellow-800 { color: #92400e; }
        .bg-blue-100 { background-color: #dbeafe; } .text-blue-800 { color: #1e40af; }
        .bg-green-100 { background-color: #d1fae5; } .text-green-800 { color: #065f46; }
        .bg-red-100 { background-color: #fee2e2; } .text-red-800 { color: #991b1b; }
        .bg-gray-100 { background-color: #f3f4f6; } .text-gray-800 { color: #1f2937; }
        .bg-purple-100 { background-color: #f3e8ff; } .text-purple-800 { color: #6b21a8; }
      `}</style>
    </div>
  );
};

export default OrderHistory;
