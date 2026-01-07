import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import * as authAPI from "../api/auth";
import Swal from "sweetalert2";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Tautan Tidak Valid",
        text: "Tautan pengaturan ulang kata sandi tidak valid atau telah kedaluwarsa.",
        confirmButtonText: "Kembali ke Login",
        customClass: {
          popup: "swal-custom-popup",
          confirmButton: "swal-confirm-btn",
        },
      }).then(() => {
        navigate("/login");
      });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Kata sandi tidak cocok.",
        customClass: {
          popup: "swal-custom-popup",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.resetPassword(token, password);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Kata sandi Anda telah berhasil diatur ulang. Silakan masuk kembali.",
          confirmButtonText: "Masuk Sekarang",
          customClass: {
            popup: "swal-custom-popup",
            confirmButton: "swal-confirm-btn",
          },
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message || "Gagal mengatur ulang kata sandi.",
          customClass: {
            popup: "swal-custom-popup",
          },
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page position-relative">
      <div className="position-absolute top-0 end-0 m-3">
        <LanguageSwitcher />
      </div>
      <div className="auth-card fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            ITShop
          </Link>
          <h2>{t("auth.resetPasswordTitle") || "Atur Ulang Kata Sandi"}</h2>
          <p>{t("auth.resetPasswordSubtitle") || "Masukkan kata sandi baru Anda"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t("auth.newPassword") || "Kata Sandi Baru"}</label>
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
            
            <div className="password-requirements mt-2">
              <ul className="list-unstyled mb-0 small">
                <li className={`d-flex align-items-center ${password.length >= 8 ? "text-success" : "text-muted"}`}>
                  {password.length >= 8 ? <Check size={14} className="me-2" /> : <div style={{ width: 14, marginRight: 8 }}>•</div>}
                  Minimal 8 karakter
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label>{t("auth.confirmNewPassword") || "Konfirmasi Kata Sandi"}</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {confirmPassword && (
              <div className={`d-flex align-items-center mt-2 small ${password === confirmPassword ? "text-success" : "text-danger"}`}>
                {password === confirmPassword ? (
                  <>
                    <Check size={14} className="me-2" />
                    Kata sandi cocok
                  </>
                ) : (
                  <>
                    <X size={14} className="me-2" />
                    Kata sandi tidak cocok
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || !password || password !== confirmPassword}
          >
            {loading
              ? t("auth.reseting") || "Sedang memproses..."
              : t("auth.resetButton") || "Simpan Kata Sandi"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login">{t("auth.backToLogin") || "Kembali ke Login"}</Link>
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
        .btn-block {
            width: 100%;
            margin-top: 10px;
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
        .text-success { color: #28a745 !important; }
        .text-danger { color: #dc3545 !important; }
        .text-muted { color: #6c757d !important; }
        .me-2 { margin-right: 0.5rem; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
