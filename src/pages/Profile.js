import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { User, Mail, Phone, Calendar, Shield, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>{t("auth.loginRequired") || "Please login to view your profile"}</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/login")}>
          {t("common.login")}
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="profile-page fade-in">
      <div className="container">
        <div className="profile-grid">
          {/* Sidebar / Profile Summary */}
          <aside className="profile-sidebar">
            <div className="profile-card-summary">
              <div className="avatar-wrapper">
                <div className="avatar">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>
              </div>
              <h2 className="user-name">{user.full_name || user.username}</h2>
              <p className="user-email">{user.email}</p>
              <span className="user-role-badge">{user.role || "Customer"}</span>
            </div>

            <nav className="profile-nav">
              <button className="nav-item active">
                <User size={18} /> <span>{t("profile.personalInfo") || "Personal Info"}</span>
                <ChevronRight size={16} className="chevron" />
              </button>
              <button className="nav-item" onClick={() => navigate("/wishlist")}>
                <Shield size={18} /> <span>{t("wishlist.title") || "My Wishlist"}</span>
                <ChevronRight size={16} className="chevron" />
              </button>
              <button className="nav-item logout" onClick={handleLogout}>
                <LogOut size={18} /> <span>{t("common.logout")}</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-main">
            <div className="profile-section">
              <h3 className="section-title">{t("profile.personalInfo") || "Personal Information"}</h3>
              <p className="section-desc">{t("profile.personalInfoDesc") || "Manage your name, email, and contact details."}</p>

              <div className="info-grid">
                <div className="info-item">
                  <label>
                    <User size={16} /> {t("auth.fullName") || "Full Name"}
                  </label>
                  <p>{user.full_name || "-"}</p>
                </div>

                <div className="info-item">
                  <label>
                    <User size={16} /> {t("auth.username") || "Username"}
                  </label>
                  <p>@{user.username || "-"}</p>
                </div>

                <div className="info-item">
                  <label>
                    <Mail size={16} /> {t("auth.email") || "Email Address"}
                  </label>
                  <p>{user.email || "-"}</p>
                </div>

                <div className="info-item">
                  <label>
                    <Phone size={16} /> {t("auth.phoneNumber") || "Phone Number"}
                  </label>
                  <p>{user.phone_number || "-"}</p>
                </div>

                <div className="info-item">
                  <label>
                    <Calendar size={16} /> {t("auth.birthDate") || "Birth Date"}
                  </label>
                  <p>{user.birth_date || "-"}</p>
                </div>

                <div className="info-item">
                  <label>
                    <Shield size={16} /> {t("auth.gender") || "Gender"}
                  </label>
                  <p>{user.gender === "L" ? t("auth.male") || "Male" : user.gender === "P" ? t("auth.female") || "Female" : "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="profile-section mt-5">
                <h3 className="section-title">{t("profile.security") || "Account Security"}</h3>
                <div className="security-status info-item mb-0">
                    <label>{t("profile.status") || "Status"}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="status-dot online"></div>
                        <p>{t("profile.active") || "Active & Secure"}</p>
                    </div>
                </div>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .profile-page {
            padding: 60px 0;
            background-color: var(--gray-50);
            min-height: calc(100vh - 72px);
        }

        .profile-grid {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 40px;
            align-items: start;
        }

        /* Sidebar Style */
        .profile-sidebar {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .profile-card-summary {
            background: var(--white);
            padding: 40px 24px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .avatar-wrapper {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        }

        .avatar {
            width: 80px;
            height: 80px;
            background: var(--darker);
            color: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 700;
            border: 4px solid var(--sage);
        }

        .user-name {
            font-size: 20px;
            font-weight: 700;
            color: var(--darker);
            margin-bottom: 4px;
        }

        .user-email {
            font-size: 14px;
            color: var(--gray-600);
            margin-bottom: 16px;
        }

        .user-role-badge {
            padding: 4px 12px;
            background: var(--sage);
            color: var(--darker);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 20px;
        }

        .profile-nav {
            background: var(--white);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            font-size: 15px;
            font-weight: 500;
            color: var(--gray-700);
            cursor: pointer;
            transition: var(--transition);
            border-bottom: 1px solid var(--gray-100);
        }

        .nav-item:last-child {
            border-bottom: none;
        }

        .nav-item:hover {
            background: var(--gray-50);
            color: var(--darker);
        }

        .nav-item.active {
            background: var(--gray-50);
            color: var(--darker);
            font-weight: 600;
        }

        .nav-item .chevron {
            margin-left: auto;
            opacity: 0.5;
        }

        .nav-item.logout {
            color: #ef4444;
        }

        .nav-item.logout:hover {
            background: #fef2f2;
        }

        /* Main Content Style */
        .profile-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .profile-section {
            background: var(--white);
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .section-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            color: var(--darker);
        }

        .section-desc {
            font-size: 15px;
            color: var(--gray-500);
            margin-bottom: 32px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
        }

        .info-item label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .info-item p {
            font-size: 16px;
            font-weight: 500;
            color: var(--darker);
            background: var(--gray-50);
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--gray-200);
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .status-dot.online {
            background-color: #10b981;
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }

        @media (max-width: 992px) {
            .profile-grid {
                grid-template-columns: 1fr;
            }
            .profile-sidebar {
                flex-direction: row;
                align-items: center;
            }
            .profile-card-summary {
                flex: 1;
                padding: 24px;
                display: flex;
                align-items: center;
                gap: 24px;
                text-align: left;
            }
            .avatar-wrapper {
                margin-bottom: 0;
            }
            .profile-nav {
                flex: 1;
            }
        }

        @media (max-width: 768px) {
            .profile-sidebar {
                flex-direction: column;
                align-items: stretch;
            }
            .info-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .profile-section {
                padding: 24px;
            }
        }
      `}</style>
    </div>
  );
};

export default Profile;
