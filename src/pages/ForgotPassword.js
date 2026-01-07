import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { User, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const { forgotPassword } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // We use the email for the API as per current implementation
        await forgotPassword(email);
        setLoading(false);
    };

    return (
        <div className="auth-page position-relative">
            <div className="position-absolute top-0 end-0 m-3">
                <LanguageSwitcher />
            </div>
            
            <div className="auth-card fade-in">
                <div className="auth-header-new">
                    <h2 className="forgot-title">
                        {t("auth.forgotPasswordTitle")}
                    </h2>
                    <p className="forgot-subtitle">
                        {t("auth.forgotPasswordSubtitle")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form-new">
                    <div className="form-group-new">
                        <label className="field-label">{t("auth.username")}</label>
                        <div className="input-with-icon">
                            <User size={18} className="field-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={t("auth.placeholderUsername")}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group-new">
                        <label className="field-label">{t("auth.email")}</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="field-icon" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("auth.placeholderEmail")}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="auth-actions-row">
                        <button 
                            type="button" 
                            className="btn-back-new"
                            onClick={() => navigate("/login")}
                            disabled={loading}
                        >
                            <ChevronLeft size={18} />
                            {t("common.back")}
                        </button>
                        
                        <button 
                            type="submit" 
                            className="btn-submit-new"
                            disabled={loading}
                        >
                            {loading ? t("common.sending") || "Mengirim..." : (
                                <>
                                    {t("common.submit") || "Kirim Kode"}
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #ffffff;
                    padding: 20px;
                }
                .auth-card {
                    background: #fff;
                    width: 100%;
                    max-width: 450px;
                    padding: 50px 40px;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    position: relative;
                    z-index: 1;
                }
                /* Gradient Frame Effect */
                .auth-card::before {
                    content: "";
                    position: absolute;
                    inset: -2px; /* Slight offset for the gradient border */
                    z-index: -1;
                    padding: 2px;
                    border-radius: 14px; /* Slightly larger than card */
                    background: linear-gradient(135deg, var(--cta-primary) 0%, #e8baab 50%, #ffffff 100%);
                    -webkit-mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0.6;
                }
                .auth-header-new {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .forgot-title {
                    font-size: 26px;
                    color: var(--cta-primary);
                    font-weight: 700;
                    margin-bottom: 12px;
                }
                .forgot-subtitle {
                    color: #777;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .auth-form-new {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                .field-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #555;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .field-icon {
                    position: absolute;
                    left: 0;
                    color: var(--cta-primary);
                    opacity: 0.6;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 12px 0 12px 30px;
                    border: none;
                    border-bottom: 2px solid #eee;
                    font-size: 15px;
                    color: #333;
                    outline: none;
                    transition: all 0.3s;
                    background: transparent;
                }
                .input-with-icon input:focus {
                    border-bottom-color: var(--cta-primary);
                }
                .input-with-icon input::placeholder {
                    color: #ccc;
                }
                .auth-actions-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                }
                .btn-back-new {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background-color: transparent;
                    color: #888;
                    border: 1px solid #ddd;
                    padding: 10px 22px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-back-new:hover {
                    background-color: #f9f9f9;
                    border-color: #ccc;
                    color: #555;
                }
                .btn-submit-new {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background-color: var(--cta-primary);
                    color: white;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(196, 143, 122, 0.25);
                }
                .btn-submit-new:hover {
                    background-color: #b07e6b;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 15px rgba(196, 143, 122, 0.35);
                }
                .btn-back-new:disabled, .btn-submit-new:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
