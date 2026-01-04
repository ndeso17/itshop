import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const OTPModal = ({ isOpen, email, device_id, onVerify, onCancel }) => {
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const inputRef = useRef(null);

  // Reset state and start timer when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Intentionally resetting state when modal opens - this is the recommended pattern
    // for resetting form state when a modal opens rather than when it closes
    // eslint-disable-next-line
    setOtp("");
    setRememberMe(false);
    setTimeLeft(300);
    setLoading(false);

    // Auto-focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return;
    }

    setLoading(true);
    await onVerify(email, device_id, otp, rememberMe);
    setLoading(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="otp-modal-overlay" onClick={onCancel}>
        <div className="otp-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="otp-modal-close" onClick={onCancel}>
            <X size={20} />
          </button>

          <div className="otp-modal-header">
            <h2>{t("auth.verifyOTP") || "Verify OTP"}</h2>
            <p>
              {t("auth.otpSentTo") || "We've sent a 6-digit code to"}{" "}
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength={6}
                className="otp-input"
                disabled={loading || timeLeft === 0}
              />
            </div>

            <div className="otp-timer">
              {timeLeft > 0 ? (
                <>
                  {t("auth.otpExpiresIn") || "Code expires in"}{" "}
                  <strong>{formatTime(timeLeft)}</strong>
                </>
              ) : (
                <span className="otp-expired">
                  {t("auth.otpExpired") ||
                    "Code expired. Please request a new one."}
                </span>
              )}
            </div>

            <div className="otp-remember-me mb-3">
              <label className="d-flex align-items-center justify-content-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="me-2"
                />
                <span className="text-secondary small">
                  {t("auth.rememberMe") || "Remember Me on this device"}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={otp.length !== 6 || loading || timeLeft === 0}
            >
              {loading
                ? t("auth.verifying") || "Verifying..."
                : t("auth.verify") || "Verify"}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={onCancel}
              disabled={loading}
            >
              {t("common.cancel") || "Cancel"}
            </button>
          </form>

          <div className="otp-device-info">
            <small>
              {t("auth.deviceId") || "Device ID"}: {device_id}
            </small>
          </div>
        </div>
      </div>

      <style>{`
        .otp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .otp-modal-content {
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 450px;
          width: 100%;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .otp-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .otp-modal-close:hover {
          background: #f5f5f5;
          color: #333;
        }

        .otp-modal-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .otp-modal-header h2 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #2c2c2c;
        }

        .otp-modal-header p {
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .otp-modal-header strong {
          color: #2c2c2c;
        }

        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .otp-input-wrapper {
          display: flex;
          justify-content: center;
        }

        .otp-input {
          width: 100%;
          max-width: 250px;
          padding: 20px;
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          letter-spacing: 8px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.2s;
          font-family: 'Courier New', monospace;
        }

        .otp-input:focus {
          outline: none;
          border-color: #2c2c2c;
          box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
        }

        .otp-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .otp-input::placeholder {
          color: #ddd;
          letter-spacing: 8px;
        }

        .otp-timer {
          text-align: center;
          font-size: 14px;
          color: #666;
        }

        .otp-timer strong {
          color: #2c2c2c;
          font-weight: 600;
        }

        .otp-expired {
          color: #dc3545;
          font-weight: 600;
        }

        .btn-block {
          width: 100%;
        }

        .btn-secondary {
          background: white;
          color: #666;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .otp-device-info {
          text-align: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }

        .otp-device-info small {
          color: #999;
          font-size: 12px;
          word-break: break-all;
        }

        @media (max-width: 480px) {
          .otp-modal-content {
            padding: 30px 20px;
          }

          .otp-input {
            font-size: 28px;
            letter-spacing: 6px;
            padding: 15px;
          }

          .otp-input::placeholder {
            letter-spacing: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default OTPModal;
