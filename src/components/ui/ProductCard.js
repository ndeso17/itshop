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
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";
import { formatCurrency } from "../../utils/currency";

const ProductCard = ({ product, showNew = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [showShare, setShowShare] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product || typeof product !== "object") return null;

  /* ================= HELPERS ================= */

  const productLink = `/products/${product.slug || product.id}`;

  const getProductName = () => {
    // Try to find translation by slug first
    if (product.slug) {
      const translatedName = t(`product_names.${product.slug}`);
      // If translation exists (doesn't return key), use it
      if (translatedName !== `product_names.${product.slug}`) {
        return translatedName;
      }
    }

    if (!product.name) return "Product";

    // Existing logic as fallback
    if (typeof product.name === "string") return product.name;
    return (
      product.name[i18n.language] ||
      product.name.en ||
      Object.values(product.name)[0] ||
      "Product"
    );
  };

  const getCategoryName = () => {
    const cat = product.category || product.categories?.[0];
    if (!cat) return "General";

    // Get the base string
    const catStr =
      typeof cat === "object"
        ? cat.name || cat.category_name || "General"
        : String(cat);

    // Try to translate
    return t(`category.${catStr.toLowerCase()}`) || catStr;
  };

  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "https://www.dummyimg.in/placeholder?width=400&height=500";

  /* ================= ACTIONS ================= */

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart",
        showCancelButton: true,
        confirmButtonText: "Login",
      }).then((r) => r.isConfirmed && navigate("/login"));
      return;
    }

    // Determine variant_id (use first variant if available)
    let variantId = product.id;
    if (product.variants && product.variants.length > 0) {
      variantId = product.variants[0].id;
    }

    const result = await apiAddToCart({
      variant_id: variantId,
      qty: 1,
    });

    Swal.fire({
      icon: result.success ? "success" : "error",
      title: result.success ? "Added to Cart" : "Error",
      text: result.message,
      toast: result.success,
      position: "top-end",
      timer: result.success ? 1500 : undefined,
      showConfirmButton: !result.success,
    });

    if (result.success) {
      refreshCart();
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(
      {
        id: product.id,
        name: getProductName(),
        price: product.price,
        image: imageUrl,
        category: getCategoryName(),
      },
      t
    );
  };

  const handleShare = (platform, e) => {
    e.preventDefault();
    const url = window.location.origin + productLink;
    const text = `Check out ${getProductName()}!`;

    if (platform === "instagram") {
      navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: "Link copied",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowShare(false);
      return;
    }

    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };

    window.open(links[platform], "_blank");
    setShowShare(false);
  };

  /* ================= RENDER ================= */

  return (
    <div className="card h-100 border-0 shadow-sm product-card">
      <div className="position-relative overflow-hidden rounded-top">
        <Link to={productLink}>
          <div style={{ aspectRatio: "4 / 5" }} className="bg-light">
            <img
              src={
                !imgError
                  ? imageUrl
                  : "https://www.dummyimg.in/placeholder?width=300&height=350"
              }
              alt={getProductName()}
              loading="lazy"
              className="w-100 h-100 object-fit-cover"
              onError={() => setImgError(true)}
            />
          </div>
        </Link>

        {/* NEW BADGE */}
        {showNew && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
            New
          </span>
        )}

        {/* ACTION BUTTONS */}
        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
          <button
            className="btn btn-light btn-sm rounded-circle"
            onClick={(e) => {
              e.preventDefault();
              setShowShare(!showShare);
            }}
          >
            <Share2 size={16} />
          </button>

          <button
            className="btn btn-light btn-sm rounded-circle"
            onClick={handleAddToWishlist}
          >
            <Heart size={16} />
          </button>
        </div>

        {/* SHARE DROPDOWN */}
        {showShare && (
          <div className="position-absolute top-0 end-0 mt-5 me-2 bg-white rounded shadow p-2">
            <button
              className="btn btn-sm w-100 text-start"
              onClick={(e) => handleShare("facebook", e)}
            >
              <Facebook size={14} /> Facebook
            </button>
            <button
              className="btn btn-sm w-100 text-start"
              onClick={(e) => handleShare("instagram", e)}
            >
              <Instagram size={14} /> Instagram
            </button>
            <button
              className="btn btn-sm w-100 text-start"
              onClick={(e) => handleShare("whatsapp", e)}
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>
        )}
      </div>

      <div className="card-body p-3 d-flex flex-column">
        <small className="text-muted text-uppercase mb-1">
          {getCategoryName()}
        </small>

        <h6 className="card-title text-truncate mb-2">
          <Link to={productLink} className="text-dark text-decoration-none">
            {getProductName()}
          </Link>
        </h6>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-dark">
            {formatCurrency(product.price, i18n.language)}
          </span>
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
