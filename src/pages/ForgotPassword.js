import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock, Key, ArrowLeft } from "lucide-react";
import { useToast } from "../context/ToastContext";
import * as authAPI from "../api/auth";

const ForgotPassword = () => {
    // Stage: 'email' or 'reset'
    const [stage, setStage] = useState("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await authAPI.forgotPassword(email);

        if (result.success) {
            addToast(t("auth.resetCodeSent") || "Reset code has been sent to your email", "success");
            setStage("reset");
        } else {
            addToast(result.message || "Failed to send reset code", "error");
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            addToast(t("auth.passwordsDoNotMatch") || "Passwords do not match", "error");
            return;
        }

        setLoading(true);
        const result = await authAPI.resetPassword(email, otp, newPassword);

        if (result.success) {
            addToast(t("auth.passwordResetSuccess") || "Password has been reset successfully", "success");
            navigate("/login");
        } else {
            addToast(result.message || "Failed to reset password", "error");
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">ITShop</Link>
                    <h2>{stage === "email" ? (t("auth.forgotPasswordTitle") || "Forgot Password") : (t("auth.resetPasswordTitle") || "Reset Password")}</h2>
                    <p>
                        {stage === "email" 
                            ? (t("auth.forgotPasswordSubtitle") || "Enter your email to receive a reset code")
                            : (t("auth.resetPasswordSubtitle") || "Enter the code sent to your email and your new password")
                        }
                    </p>
                </div>

                {stage === "email" ? (
                    <form onSubmit={handleRequestReset} className="auth-form">
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

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? (t("auth.sending") || "Sending...") : (t("auth.sendCode") || "Send Reset Code")}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="auth-form">
                         <div className="form-group">
                            <label>{t("auth.otpCode") || "OTP Code"}</label>
                            <div className="input-icon-wrapper">
                                <Key size={18} className="input-icon" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    required
                                    disabled={loading}
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t("auth.newPassword") || "New Password"}</label>
                            <div className="input-icon-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t("auth.confirmPassword") || "Confirm New Password"}</label>
                            <div className="input-icon-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? (t("auth.resetting") || "Resetting...") : (t("auth.resetPasswordButton") || "Reset Password")}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-link btn-block" 
                            onClick={() => setStage("email")}
                            style={{ 
                                marginTop: '10px', 
                                fontSize: '14px', 
                                color: '#666',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            disabled={loading}
                        >
                            {t("auth.backToEmail") || "Back to Email"}
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    <p>
                        <Link to="/login" className="back-link" style={{ textDecoration: 'none', color: '#666', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowLeft size={16} style={{ marginRight: '5px' }} />
                            {t("auth.backToLogin") || "Back to Login"}
                        </Link>
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
                .btn-block {
                    width: 100%;
                    margin-top: 10px;
                }
                .auth-footer {
                    text-align: center;
                    margin-top: 25px;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
