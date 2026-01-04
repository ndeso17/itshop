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
import { getProfile, updateProfile } from "../api/profile";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:3000";

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
        email: user.email || "",
        avatar: user.avatar || "",
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

  const handleSave = async () => {
    try {
      // Filter out empty strings if needed, or send as is
      const result = await updateProfile(formData);
      if (result.success) {
        setUser(result.data);
        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || "Profile updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred",
      });
    }
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
      email: user.email || "",
      avatar: user.avatar || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString, includeTime = false) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (includeTime) {
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `${API_BASE_URL}${
      avatarPath.startsWith("/") ? "" : "/"
    }${avatarPath}`;
  };

  return (
    <div className="profile-page bg-light py-5">
      <div className="container pb-5">
        {/* Header with Back Button */}
        <div className="d-flex align-items-center mb-4">
          <Link
            to="/"
            className="text-decoration-none text-secondary d-flex align-items-center gap-2 me-3"
          >
            <ArrowLeft size={20} />
            <span>{t("common.back") || "Back"}</span>
          </Link>
          <h2 className="h4 mb-0 fw-bold">
            {t("profile.title") || "My Profile"}
          </h2>
        </div>

        <div className="row g-4">
          {/* Left Column: Avatar & Quick Stats */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center p-4">
                <div
                  className="position-relative mx-auto mb-3"
                  style={{ width: "120px", height: "120px" }}
                >
                  <div
                    className="rounded-circle overflow-hidden w-100 h-100 border border-3 border-light shadow-sm d-flex align-items-center justify-content-center bg-dark text-white text-uppercase"
                    style={{ fontSize: "2.5rem" }}
                  >
                    {user.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.full_name}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = user.full_name
                            ? user.full_name[0]
                            : "U";
                        }}
                      />
                    ) : user.full_name ? (
                      user.full_name[0]
                    ) : (
                      "U"
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="form-control form-control-sm mb-3"
                      placeholder="Avatar URL path"
                    />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="form-control mb-1 fw-bold text-center"
                      placeholder={t("profile.fullName") || "Full Name"}
                    />
                  </>
                ) : (
                  <h3 className="h5 fw-bold mb-1">
                    {user.full_name || "User"}
                  </h3>
                )}

                <p className="text-secondary small text-uppercase mb-3">
                  {user.role || "Customer"}
                </p>

                <div className="d-flex justify-content-center gap-2 mb-4">
                  <div className="badge bg-light text-dark border">
                    Joined {formatDate(user.registered_at)}
                  </div>
                </div>

                {/* Quick Link to Orders */}
                <Link
                  to="/orders"
                  className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Package size={18} />
                  {t("profile.myOrders") || "My Orders"}
                </Link>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="card-title fw-bold mb-3">Account Info</h6>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex justify-content-between mb-2">
                    <span className="text-secondary small">Status</span>
                    <span className="badge bg-success-subtle text-success">
                      {user.status_akun || "Active"}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-secondary small">Last Login</span>
                    <span className="text-dark small">
                      {formatDate(user.last_login, true)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Details Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Personal Information</h5>
                {!isEditing ? (
                  <button
                    className="btn btn-sm btn-light border d-flex align-items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} />
                    <span className="d-none d-sm-inline">
                      {t("common.edit") || "Edit"}
                    </span>
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-light border text-danger"
                      onClick={handleCancel}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Username */}
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      {t("profile.username") || "Username"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          className="form-control border-start-0 ps-0"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control bg-white border-start-0 ps-0"
                          value={user.username || user.userName || "-"}
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      {t("profile.phone") || "Phone Number"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Phone size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone_number"
                          className="form-control border-start-0 ps-0"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control bg-white border-start-0 ps-0"
                          value={
                            user.phone_number ||
                            user.phone ||
                            user.phoneNumber ||
                            "-"
                          }
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      {t("profile.gender") || "Gender"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <select
                          name="gender"
                          className="form-select border-start-0 ps-0"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="L">Male</option>
                          <option value="P">Female</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control bg-white border-start-0 ps-0"
                          value={
                            user.gender === "L" ||
                            user.gender === "Male" ||
                            user.gender === "M"
                              ? "Male"
                              : user.gender === "P" ||
                                user.gender === "Female" ||
                                user.gender === "F"
                              ? "Female"
                              : "-"
                          }
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">
                      {t("profile.birthDate") || "Birth Date"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Calendar size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <input
                          type="date"
                          name="birth_date"
                          className="form-control border-start-0 ps-0"
                          value={
                            formData.birth_date
                              ? new Date(formData.birth_date)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control bg-white border-start-0 ps-0"
                          value={formatDate(user.birth_date || user.birthDate)}
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <label className="form-label small text-secondary">
                      {t("profile.email") || "Email"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          className="form-control border-start-0 ps-0"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          type="text"
                          className="form-control bg-white border-start-0 ps-0"
                          value={user.email}
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label className="form-label small text-secondary">
                      {t("profile.address") || "Address"}
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 align-items-start pt-2">
                        <MapPin size={18} className="text-secondary" />
                      </span>
                      {isEditing ? (
                        <textarea
                          name="address"
                          rows="3"
                          className="form-control border-start-0 ps-0"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder={
                            t("profile.enterAddress") || "Enter your address..."
                          }
                        />
                      ) : (
                        <textarea
                          className="form-control bg-white border-start-0 ps-0"
                          rows="3"
                          value={user.address || "-"}
                          disabled
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="card-footer bg-white border-0 p-4 pt-0 text-end">
                  <button className="btn btn-light me-2" onClick={handleCancel}>
                    {t("common.cancel") || "Cancel"}
                  </button>
                  <button className="btn btn-primary px-4" onClick={handleSave}>
                    <Save size={16} className="me-2" />
                    {t("common.saveChanges") || "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
