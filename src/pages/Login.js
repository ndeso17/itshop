import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import OTPModal from "../components/auth/OTPModal";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpData, setOtpData] = useState({ email: "", device_id: "" });

  const { login, verifyOTP } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/products";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success && result.data) {
      // Show OTP modal
      setOtpData({
        email: result.data.email,
        device_id: result.data.device_id,
      });
      setShowOTPModal(true);
    } else if (result.success) {
      // Account pending or other state where login is technically success but no data (cannot proceed)
      Swal.fire({
        icon: "warning",
        title: "Information",
        text: result.message,
        confirmButtonText: "OK",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
      });
    }

    setLoading(false);
  };

  const handleOTPVerify = async (email, device_id, otp) => {
    const result = await verifyOTP(email, device_id, otp);

    if (result.success) {
      setShowOTPModal(false);
      navigate(from, { replace: true });
    }
  };

  const handleOTPCancel = () => {
    setShowOTPModal(false);
    setOtpData({ email: "", device_id: "" });
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card fade-in">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              ITShop
            </Link>
            <h2>{t("auth.loginTitle") || "Welcome Back"}</h2>
            <p>{t("auth.loginSubtitle") || "Login to your account"}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t("auth.email") || "Email"}</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t("auth.password") || "Password"}</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <Link to="#" className="forgot-password">
                {t("auth.forgotPassword") || "Forgot password?"}
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading
                ? t("auth.loggingIn") || "Logging in..."
                : t("auth.loginButton") || "Login"}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t("auth.orContinueWith") || "Or continue with"}</span>
          </div>

          <div className="social-login">
            <button className="btn-social">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="btn-social">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#1877F2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              {t("auth.noAccount") || "Don't have an account?"}{" "}
              <Link to="/register">{t("auth.registerLink") || "Sign up"}</Link>
            </p>
          </div>
        </div>

        <style>{`
          .auth-page {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--sage);
              padding: 20px;
          }
          .auth-card {
              background: #fff;
              width: 100%;
              max-width: 450px;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .auth-header {
              text-align: center;
              margin-bottom: 30px;
          }
          .auth-logo {
              font-size: 28px;
              font-weight: 700;
              color: var(--darker);
              text-transform: uppercase;
              letter-spacing: 2px;
              display: inline-block;
              margin-bottom: 20px;
              text-decoration: none;
          }
          .auth-header h2 {
              font-size: 24px;
              margin-bottom: 10px;
          }
          .auth-header p {
              color: #888;
          }
          .form-group {
              margin-bottom: 20px;
          }
          .form-group label {
              display: block;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
          }
          .input-icon-wrapper {
              position: relative;
          }
          .input-icon {
              position: absolute;
              left: 12px;
              top: 50%;
              transform: translateY(-50%);
              color: #999;
          }
          .form-group input {
              width: 100%;
              padding: 12px 12px 12px 40px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 15px;
              transition: var(--transition);
          }
          .form-group input:focus {
              border-color: var(--dark);
              outline: none;
          }
          .form-group input:disabled {
              background: #f5f5f5;
              cursor: not-allowed;
          }
          .forgot-password {
              font-size: 13px;
              color: var(--gold);
              float: right;
              margin-top: 5px;
          }
          .btn-block {
              width: 100%;
              margin-top: 10px;
          }
          .auth-divider {
              position: relative;
              text-align: center;
              margin: 30px 0;
          }
          .auth-divider::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              width: 100%;
              height: 1px;
              background: #eee;
          }
          .auth-divider span {
              background: #fff;
              padding: 0 15px;
              position: relative;
              color: #999;
              font-size: 13px;
          }
          .social-login {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
          }
          .btn-social {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 10px;
              border: 1px solid #ddd;
              background: #fff;
              border-radius: 4px;
              font-size: 14px;
              color: var(--text-dark);
              cursor: pointer;
              transition: all 0.2s;
          }
          .btn-social:hover {
              background: #f9f9f9;
          }
          .auth-footer {
              text-align: center;
              margin-top: 25px;
              font-size: 14px;
          }
          .auth-footer a {
              color: var(--gold);
              font-weight: 600;
          }
          .password-toggle {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              border: none;
              color: #999;
              cursor: pointer;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
          }
          .password-toggle:hover {
              color: var(--darker);
          }
        `}</style>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        email={otpData.email}
        device_id={otpData.device_id}
        onVerify={handleOTPVerify}
        onCancel={handleOTPCancel}
      />
    </>
  );
};

export default Login;
