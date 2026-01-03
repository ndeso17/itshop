import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    gender: "L",
    birth_date: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number =
        "Invalid phone number (use 08xxx or +62xxx format)";
    }

    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Birth date validation (must be 13+ years old)
    if (formData.birth_date) {
      const birthDate = new Date(formData.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.birth_date = "You must be at least 13 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const userData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone_number: formData.phone_number,
      role: "user",
      full_name: formData.full_name,
      gender: formData.gender,
      birth_date: formData.birth_date,
    };

    const result = await register(userData);

    if (result.success) {
      // Navigate to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page position-relative">
      <div className="position-absolute top-0 end-0 m-3">
        <LanguageSwitcher />
      </div>
      <div className="auth-card auth-card-register fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            ITShop
          </Link>
          <h2>{t("auth.createAccount") || "Create Account"}</h2>
          <p>{t("auth.joinUs") || "Join us today"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="form-group">
            <label>{t("auth.username") || "Username"}</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t("auth.placeholderUsername") || "johndoe"}
                required
                disabled={loading}
              />
            </div>
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label>{t("auth.fullName") || "Full Name"}</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={t("auth.placeholderFullName") || "John Doe"}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>{t("auth.email") || "Email"}</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("auth.placeholderEmail") || "name@example.com"}
                required
                disabled={loading}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>{t("auth.phoneNumber") || "Phone Number"}</label>
            <div className="input-icon-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder={t("auth.placeholderPhone") || "081234567890"}
                required
                disabled={loading}
              />
            </div>
            {errors.phone_number && (
              <span className="error-text">{errors.phone_number}</span>
            )}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>{t("auth.gender") || "Gender"}</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                className="form-control gender-select"
                style={{
                  width: "100%",
                  padding: "12px 12px 12px 40px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: "white",
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="L">{t("auth.male") || "Male"}</option>
                <option value="P">{t("auth.female") || "Female"}</option>
              </select>
            </div>
          </div>

          {/* Birth Date */}
          <div className="form-group">
            <label>{t("auth.birthDate") || "Birth Date"}</label>
            <div className="input-icon-wrapper">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                required
                disabled={loading}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 13)
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            {errors.birth_date && (
              <span className="error-text">{errors.birth_date}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>{t("auth.password") || "Password"}</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("auth.placeholderPassword") || "Password"}
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
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
            <div className="password-requirements mt-2">
              <small className="d-block mb-1 font-weight-bold text-muted">
                {t("auth.passwordRequirements") || "Password Requirements:"}
              </small>
              <ul className="list-unstyled mb-0 small">
                <li
                  className={`d-flex align-items-center ${
                    formData.password.length >= 8
                      ? "text-success"
                      : "text-muted"
                  }`}
                >
                  {formData.password.length >= 8 ? (
                    <Check size={14} className="mr-2" />
                  ) : (
                    <div style={{ width: 14, marginRight: 8 }}>•</div>
                  )}
                  {t("auth.reqLength") || "At least 8 characters"}
                </li>
                <li
                  className={`d-flex align-items-center ${
                    /[A-Z]/.test(formData.password)
                      ? "text-success"
                      : "text-muted"
                  }`}
                >
                  {/[A-Z]/.test(formData.password) ? (
                    <Check size={14} className="mr-2" />
                  ) : (
                    <div style={{ width: 14, marginRight: 8 }}>•</div>
                  )}
                  {t("auth.reqUppercase") || "At least one uppercase letter"}
                </li>
                <li
                  className={`d-flex align-items-center ${
                    /[a-z]/.test(formData.password)
                      ? "text-success"
                      : "text-muted"
                  }`}
                >
                  {/[a-z]/.test(formData.password) ? (
                    <Check size={14} className="mr-2" />
                  ) : (
                    <div style={{ width: 14, marginRight: 8 }}>•</div>
                  )}
                  {t("auth.reqLowercase") || "At least one lowercase letter"}
                </li>
                <li
                  className={`d-flex align-items-center ${
                    /\d/.test(formData.password) ? "text-success" : "text-muted"
                  }`}
                >
                  {/\d/.test(formData.password) ? (
                    <Check size={14} className="mr-2" />
                  ) : (
                    <div style={{ width: 14, marginRight: 8 }}>•</div>
                  )}
                  {t("auth.reqNumber") || "At least one number"}
                </li>
                <li
                  className={`d-flex align-items-center ${
                    /[@$!%*?&]/.test(formData.password)
                      ? "text-success"
                      : "text-muted"
                  }`}
                >
                  {/[@$!%*?&]/.test(formData.password) ? (
                    <Check size={14} className="mr-2" />
                  ) : (
                    <div style={{ width: 14, marginRight: 8 }}>•</div>
                  )}
                  {t("auth.reqSpecial") || "At least one special character"}
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>{t("auth.confirmPassword") || "Confirm Password"}</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={
                  t("auth.placeholderConfirmPassword") || "Confirm Password"
                }
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
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
            {formData.confirmPassword && (
              <div
                className={`d-flex align-items-center mt-2 small ${
                  formData.password === formData.confirmPassword
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {formData.password === formData.confirmPassword ? (
                  <>
                    <Check size={14} className="mr-2" />
                    {t("auth.passwordMatch") || "Passwords match"}
                  </>
                ) : (
                  <>
                    <X size={14} className="mr-2" />
                    {t("auth.passwordMismatch") || "Passwords do not match"}
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? t("auth.registering") || "Creating account..."
              : t("auth.register") || "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
            <Link to="/login">{t("auth.login") || "Login"}</Link>
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
            padding: 40px 20px;
        }
        .auth-card {
            background: #fff;
            width: 100%;
            max-width: 450px;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .auth-card-register {
            max-width: 550px;
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
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="tel"],
        .form-group input[type="password"],
        .form-group input[type="date"] {
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

        .error-text {
            display: block;
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
        }
        .password-requirements {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e9ecef;
        }
        .password-requirements ul li {
            margin-bottom: 2px;
            display: flex;
            align-items: center;
        }
        .text-success {
            color: #28a745 !important;
        }
        .text-danger {
            color: #dc3545 !important;
        }
        .text-muted {
            color: #6c757d !important;
        }
        .mr-2 {
            margin-right: 0.5rem;
        }
        .mb-1 {
            margin-bottom: 0.25rem;
        }
        .mt-2 {
            margin-top: 0.5rem;
        }
        .d-block {
            display: block;
        }
        .font-weight-bold {
            font-weight: 600;
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

        @media (max-width: 640px) {
          .auth-card-register {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
