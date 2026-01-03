import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  MapPin,
  Edit2,
  Save,
  X,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getProfile } from "../api/profile";

const Profile = () => {
  const { user: contextUser } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = React.useState(contextUser);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        username: user.username || user.userName || "",
        phone_number:
          user.phone_number || user.phone || user.phoneNumber || user.tel || "",
        gender: user.gender || "",
        birth_date:
          user.birth_date ||
          user.birthDate ||
          user.date_of_birth ||
          user.dob ||
          "",
        address: user.address || "",
      });
    }
  }, [user]);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getProfile();
        if (result.success && result.data) {
          setUser(result.data);
        }
      } catch (error) {
        console.error("Failed to refresh profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would call an API here to update the user
    // For now, we'll just update the local user state to reflect changes
    setUser((prev) => ({ ...prev, ...formData }));
    setIsEditing(false);
    // Optional: Show success alert
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      full_name: user.full_name || "",
      username: user.username || user.userName || "",
      phone_number:
        user.phone_number || user.phone || user.phoneNumber || user.tel || "",
      gender: user.gender || "",
      birth_date:
        user.birth_date ||
        user.birthDate ||
        user.date_of_birth ||
        user.dob ||
        "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div
        className="container"
        style={{ padding: "40px", textAlign: "center" }}
      >
        Loading profile...
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>{t("common.back") || "Back"}</span>
          </Link>
          <h1>{t("profile.title") || "My Profile"}</h1>
          <div className="header-actions">
            {!isEditing ? (
              <button
                className="btn-edit-toggle"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} /> <span>{t("common.edit") || "Edit"}</span>
              </button>
            ) : (
              <div className="edit-controls">
                <button className="btn-cancel" onClick={handleCancel}>
                  <X size={16} /> <span>{t("common.cancel") || "Cancel"}</span>
                </button>
                <button className="btn-save" onClick={handleSave}>
                  <Save size={16} /> <span>{t("common.save") || "Save"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-card fade-in">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-initials">
                {user.full_name
                  ? user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "U"}
              </span>
            </div>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="edit-input-name"
                placeholder={t("profile.fullName") || "Full Name"}
              />
            ) : (
              <h2 className="profile-name">{user.full_name || "User"}</h2>
            )}
            <p className="profile-role">{user.role || "Customer"}</p>
          </div>

          <div className="profile-details">
            {/* Row 1: Username & Phone */}
            <div className="detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.username") || "Username"}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{user.username || user.userName || "-"}</p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Phone size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.phone") || "Phone Number"}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>
                    {user.phone_number ||
                      user.phone ||
                      user.phoneNumber ||
                      user.tel ||
                      "-"}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Gender & Birth Date */}
            <div className="detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.gender") || "Gender"}</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="edit-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="L">Male</option>
                    <option value="P">Female</option>
                  </select>
                ) : (
                  <p>
                    {user.gender === "L" ||
                    user.gender === "Male" ||
                    user.gender === "male" ||
                    user.gender === "M"
                      ? t("auth.male") || "Male"
                      : user.gender === "P" ||
                        user.gender === "Female" ||
                        user.gender === "female" ||
                        user.gender === "F"
                      ? t("auth.female") || "Female"
                      : "-"}
                  </p>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.birthDate") || "Birth Date"}</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birth_date"
                    value={
                      formData.birth_date
                        ? new Date(formData.birth_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  <p>
                    {formatDate(
                      user.birth_date ||
                        user.birthDate ||
                        user.date_of_birth ||
                        user.dob
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Email (Full Width) */}
            <div className="detail-item full-width">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.email") || "Email"}</label>
                <p className="read-only">{user.email}</p>
              </div>
            </div>

            {/* Row 4: Address (Full Width) */}
            <div className="detail-item full-width">
              <div className="detail-icon">
                <MapPin size={20} />
              </div>
              <div className="detail-content">
                <label>{t("profile.address") || "Address"}</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="edit-input edit-textarea"
                    placeholder={
                      t("profile.enterAddress") || "Enter your address..."
                    }
                  />
                ) : (
                  <p>{user.address || "-"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="profile-actions-grid fade-in">
          <Link to="/orders" className="action-card">
            <div className="icon-wrapper bg-blue-100 text-blue-600">
              <Package size={24} />
            </div>
            <div className="action-info">
              <h3>{t("profile.myOrders") || "My Orders"}</h3>
              <p>
                {t("profile.viewOrders") || "View history & track packages"}
              </p>
            </div>
            <div className="action-arrow">
              <ArrowLeft size={20} style={{ transform: "rotate(180deg)" }} />
            </div>
          </Link>

          {/* You could add more here like Addresses, Payment Methods etc */}
        </div>

        <style>{`
            .profile-actions-grid {
                max-width: 800px; margin: 30px auto 0;
                display: grid; gap: 20px;
            }
            .action-card {
                background: white; padding: 20px; border-radius: 12px;
                display: flex; align-items: center; gap: 20px;
                text-decoration: none; color: inherit;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                transition: all 0.2s; border: 1px solid transparent;
            }
            .action-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                border-color: var(--gold);
            }
            .icon-wrapper {
                width: 50px; height: 50px; border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
            }
            .action-info { flex: 1; }
            .action-info h3 { margin: 0 0 5px 0; font-size: 16px; color: var(--darker); }
            .action-info p { margin: 0; font-size: 13px; color: #888; }
            
            .bg-blue-100 { background: #e3f2fd; }
            .text-blue-600 { color: #1e88e5; }
        `}</style>
      </div>

      <style>{`
        .profile-page {
          padding: 40px 0;
          min-height: 80vh;
          background-color: var(--gray-50);
        }
        
        .profile-header {
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
          font-weight: 500;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--darker);
        }

        .profile-header h1 {
          font-size: 28px;
          margin: 0;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 300px 1fr;
        }

        .profile-avatar {
          background: var(--dark);
          color: white;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .avatar-initials {
          font-size: 36px;
          font-weight: 700;
          color: white;
        }

        .profile-name {
          font-size: 24px;
          color: white;
          margin-bottom: 8px;
        }

        .profile-role {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .profile-details {
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .detail-item {
          display: flex;
          gap: 15px;
        }

        .detail-icon {
          width: 40px;
          height: 40px;
          background: var(--gray-100);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--dark);
        }

        .detail-content label {
          display: block;
          font-size: 13px;
          color: var(--gray-500);
          margin-bottom: 4px;
        }

        .detail-content p {
          font-size: 16px;
          font-weight: 500;
          color: var(--darker);
          word-break: break-word;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .profile-card {
            grid-template-columns: 1fr;
          }

          .profile-details {
            grid-template-columns: 1fr;
            padding: 30px;
          }
        }

        /* Edit Mode Styles */
        .profile-header {
            justify-content: space-between;
        }

        .header-actions {
            display: flex;
            gap: 10px;
        }

        .btn-edit-toggle, .btn-save, .btn-cancel {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-edit-toggle {
            background: #fff;
            border: 1px solid #ddd;
            color: var(--darker);
        }
        .btn-edit-toggle:hover {
            background: #f5f5f5;
        }

        .edit-controls {
            display: flex;
            gap: 8px;
        }

        .btn-save {
            background: var(--darker);
            color: white;
        }
        .btn-save:hover {
            opacity: 0.9;
        }

        .btn-cancel {
            background: #f5f5f5;
            color: #666;
        }
        .btn-cancel:hover {
            background: #e0e0e0;
        }

        .edit-input {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 15px;
            color: var(--darker);
            outline: none;
            transition: border-color 0.2s;
        }
        .edit-input:focus {
            border-color: var(--darker);
        }

        .edit-input-name {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            text-align: center;
            font-size: 20px;
            width: 80%;
            margin-bottom: 8px;
        }
        .edit-input-name::placeholder {
            color: rgba(255,255,255,0.6);
        }

        .edit-textarea {
            resize: vertical;
            min-height: 80px;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .detail-content {
            flex: 1;
        }
        
        .read-only {
            opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default Profile;
