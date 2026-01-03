import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Share2,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { addToWishlist } from "../../utils/cart";
import { addToCart as apiAddToCart } from "../../api/cart";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const ProductCard = ({ product }) => {
  // console.log("Ini Product : ", product);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showShare, setShowShare] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product || typeof product !== "object") {
    return null;
  }

  // --- Helpers ---
  const getProductName = () => {
    if (!product.name) return "Product";
    if (typeof product.name === "string") return product.name;
    const lang = i18n.language;
    return (
      product.name[lang] ||
      (lang === "ko" ? product.name["kr"] : null) ||
      (lang === "kr" ? product.name["ko"] : null) ||
      product.name["en"] ||
      Object.values(product.name)[0] ||
      "Product"
    );
  };

  const getProductCategory = () => {
    let cat = product.category;
    if (!cat && product.categories && product.categories.length > 0) {
      cat = product.categories[0];
    }
    if (!cat) return "General";
    if (typeof cat === "object") {
      cat = cat.name || cat.category_name || "General";
    }
    return String(cat);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "";
    try {
      switch (i18n.language) {
        case "id":
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(price * 15000);
        case "kr":
        case "ko":
        case "ko-KR":
          return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
            minimumFractionDigits: 0,
          }).format(price * 1300);
        default:
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price);
      }
    } catch {
      return price; // Fallback
    }
  };

  const productName = getProductName();
  const categoryName = getProductCategory();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: t("auth.loginRequired") || "Login Required",
        text: t("auth.pleaseLogin") || "Please login to add items to cart",
        showCancelButton: true,
        confirmButtonText: t("auth.login") || "Login",
        cancelButtonText: t("common.cancel") || "Cancel",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-secondary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    const result = await apiAddToCart({ variant_id: product.id, qty: 1 });

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: t("cart.added"),
        text: result.message,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        customClass: { popup: "colored-toast" }, // Uses our custom CSS
      });
    } else {
      Swal.fire({
        icon: "error",
        title: t("cart.error"),
        text: result.message,
      });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    const productData = {
      id: product.id,
      name: productName,
      price: product.price,
      image: product.image,
      category: categoryName,
    };
    addToWishlist(productData, t);
  };

  const handleShare = (platform, e) => {
    e.preventDefault();
    e.stopPropagation();

    const url =
      window.location.href.split("?")[0].replace(/\/$/, "") +
      "/products/" +
      (product.id || "");
    const text = `Check out ${productName}!`;
    let shareLink = "";

    if (platform === "facebook") {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`;
    } else if (platform === "whatsapp") {
      shareLink = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    } else if (platform === "instagram") {
      navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: t("product.linkCopied"),
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowShare(false);
      return;
    }

    if (shareLink) window.open(shareLink, "_blank");
    setShowShare(false);
  };

  // --- Image Helper ---
  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return null;
  };

  const imageUrl = getImageUrl();
  const placeholderImg =
    "https://www.dummyimg.in/placeholder?width=300&height=350";

  return (
    <div className="card h-100 border-0 shadow-sm product-card">
      <div className="position-relative overflow-hidden rounded-top">
        <Link to={`/products/${product.slug || product.id}`}>
          <div className="ratio ratio-4x5 bg-secondary-subtle">
            <img
              src={!imgError && imageUrl ? imageUrl : placeholderImg}
              className="card-img-top object-fit-cover w-100 h-100"
              alt={productName}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        </Link>

        {product.isNew && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
            {t("product.new")}
          </span>
        )}

        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
          <button
            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "32px", height: "32px" }}
            onClick={(e) => {
              e.preventDefault();
              setShowShare(!showShare);
            }}
          >
            <Share2 size={16} />
          </button>
          <button
            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "32px", height: "32px" }}
            onClick={handleAddToWishlist}
          >
            <Heart size={16} />
          </button>
        </div>

        {/* Share Dropdown */}
        {showShare && (
          <div
            className="position-absolute top-0 end-0 m-2 mt-5 bg-white rounded shadow-sm p-2 z-3"
            style={{ minWidth: "120px" }}
          >
            <button
              onClick={(e) => handleShare("facebook", e)}
              className="btn btn-sm w-100 text-start d-flex align-items-center gap-2 mb-1 pl-1"
            >
              <Facebook size={14} className="text-primary" />{" "}
              <small>Facebook</small>
            </button>
            <button
              onClick={(e) => handleShare("instagram", e)}
              className="btn btn-sm w-100 text-start d-flex align-items-center gap-2 mb-1 pl-1"
            >
              <Instagram size={14} className="text-danger" />{" "}
              <small>Instagram</small>
            </button>
            <button
              onClick={(e) => handleShare("whatsapp", e)}
              className="btn btn-sm w-100 text-start d-flex align-items-center gap-2 pl-1"
            >
              <MessageCircle size={14} className="text-success" />{" "}
              <small>WhatsApp</small>
            </button>
          </div>
        )}
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <small
          className="text-muted text-uppercase fw-semibold mb-1"
          style={{ fontSize: "11px", letterSpacing: "0.5px" }}
        >
          {t(`category.${categoryName.toLowerCase()}`, {
            defaultValue: categoryName,
          })}
        </small>

        <h6 className="card-title text-truncate mb-2">
          <Link
            to={`/products/${product.id}`}
            className="text-dark text-decoration-none hover-primary"
          >
            {productName}
          </Link>
        </h6>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <span className="fw-bold text-dark">
            {formatPrice(product.price)}
          </span>
          <button
            className="btn btn-primary btn-sm rounded-2 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={handleAddToCart}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
