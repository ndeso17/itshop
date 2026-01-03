import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Archive,
  Truck,
  Package,
} from "lucide-react";
import { getTracking } from "../api/checkout";

const OrderTracking = () => {
  const { id } = useParams();

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const result = await getTracking(id);
        if (result.success) {
          setTrackingData(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [id]);

  // Mock tracking steps if API return is simple
  const steps = [
    { status: "confirmed", label: "Order Confirmed", icon: Archive },
    { status: "processed", label: "Order Processed", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const getCurrentStep = (status) => {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === "delivered") return 4;
    if (s === "shipped") return 3;
    if (s === "processed") return 2;
    return 1;
  };

  const currentStep = trackingData ? getCurrentStep(trackingData.status) : 0;

  return (
    <div className="container tracking-page">
      <div className="header">
        <Link to={`/orders/${id}`} className="back-link">
          <ArrowLeft size={18} /> Back to Order
        </Link>
        <h1>Track Package #{id}</h1>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading tracking info...</div>
      ) : trackingData ? (
        <div className="tracking-content fade-in">
          <div className="tracking-info-card">
            <div className="info-row">
              <span className="label">Carrier:</span>
              <span className="value">
                {trackingData.courier || "JNE Express"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Tracking Number:</span>
              <span className="value active">
                {trackingData.resi || "JP1234567890"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Estimated Delivery:</span>
              <span className="value">
                {trackingData.estimation || "2-3 Days"}
              </span>
            </div>
          </div>

          <div className="timeline-container">
            {/* Horizontal Stepper */}
            <div className="stepper-wrapper">
              {steps.map((step, idx) => {
                const isCompleted = idx + 1 <= currentStep;
                const isActive = idx + 1 === currentStep;
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`stepper-item ${
                      isCompleted ? "completed" : ""
                    } ${isActive ? "active" : ""}`}
                  >
                    <div className="step-counter">
                      <Icon size={20} />
                    </div>
                    <div className="step-name">{step.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Detailed History */}
            <div className="tracking-history">
              <h3>Tracking History</h3>
              {trackingData.history ? (
                <ul className="history-list">
                  {trackingData.history.map((event, i) => (
                    <li key={i} className="history-item">
                      <div className="history-time">{event.date}</div>
                      <div className="history-detail">
                        <strong>{event.status}</strong>
                        <p>{event.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No detailed history available yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <h3>Tracking info not found</h3>
          <p>
            It seems this order hasn't been shipped yet or the tracking ID is
            invalid.
          </p>
        </div>
      )}

      <style>{`
                .tracking-page { padding: 40px 0; min-height: 80vh; }
                .header { margin-bottom: 30px; }
                .header h1 { font-size: 24px; margin-top: 10px; }
                
                .tracking-info-card { 
                    background: white; padding: 25px; border-radius: 12px; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 40px;
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;
                }
                .info-row { display: flex; flex-direction: column; }
                .info-row .label { font-size: 13px; color: #888; margin-bottom: 5px; }
                .info-row .value { font-size: 16px; font-weight: 600; color: var(--darker); }
                .info-row .value.active { color: var(--gold); letter-spacing: 1px; }

                /* Stepper */
                .stepper-wrapper {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 50px;
                    position: relative;
                }
                .stepper-wrapper::before {
                    content: "";
                    position: absolute;
                    top: 20px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: #e0e0e0;
                    z-index: 0;
                }
                .stepper-item {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                }
                .stepper-item::before {
                    content: "";
                    position: absolute;
                    top: 20px;
                    left: -50%;
                    width: 100%;
                    height: 2px;
                    background: #e0e0e0;
                    z-index: -1;
                }
                .stepper-item:first-child::before { display: none; }
                
                .stepper-item.completed::before, 
                .stepper-item.completed .step-counter { background: var(--darker); color: white; border-color: var(--darker); }
                
                .step-counter {
                    width: 40px; height: 40px; border-radius: 50%; background: white; border: 2px solid #e0e0e0;
                    display: flex; align-items: center; justify-content: center; color: #ccc;
                    margin-bottom: 10px; transition: all 0.3s;
                }
                .step-name { font-size: 14px; font-weight: 500; color: #888; }
                .stepper-item.active .step-name, .stepper-item.completed .step-name { color: var(--darker); font-weight: 700; }
                
                /* History */
                .tracking-history { background: white; padding: 30px; border-radius: 12px; border: 1px solid #eee; }
                .history-list { list-style: none; padding: 0; margin: 0; }
                .history-item { 
                    display: flex; gap: 20px; padding-bottom: 20px; border-left: 2px solid #eee; 
                    margin-left: 10px; padding-left: 20px; position: relative; 
                }
                .history-item::before {
                    content: ""; width: 10px; height: 10px; background: #ccc; border-radius: 50%;
                    position: absolute; left: -6px; top: 0;
                }
                .history-item:first-child::before { background: var(--gold); }
                
                .history-time { font-size: 13px; color: #888; min-width: 120px; }
                .history-detail strong { display: block; margin-bottom: 4px; color: var(--darker); }
                .history-detail p { margin: 0; font-size: 14px; color: #666; }
            `}</style>
    </div>
  );
};

export default OrderTracking;
