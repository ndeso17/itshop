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
import { addToCart, addToWishlist } from "../../utils/cart";

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showShare, setShowShare] = useState(false);

  // Safety check: if product is invalid, don't render or render placeholder
  if (!product || typeof product !== "object") {
    return null;
  }

  // --- Helpers ---
  const getProductName = () => {
    if (!product.name) return "Product";
    if (typeof product.name === "string") return product.name;
    // Handle object: try current lang -> kr/ko -> en -> first value
    const lang = i18n.language;
    return (
      product.name[lang] ||
      (lang === "ko" ? product.name["kr"] : null) ||
      (lang === "kr" ? product.name["ko"] : null) || // Handle both codes
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

  // --- Handlers ---
  const productName = getProductName();
  const categoryName = getProductCategory();

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      name: productName,
      price: product.price,
      image: product.image,
      category: categoryName,
    };
    addToCart(productData, t);
  };

  const handleAddToWishlist = () => {
    const productData = {
      id: product.id,
      name: productName,
      price: product.price,
      image: product.image,
      category: categoryName,
    };
    addToWishlist(productData, t);
  };

  const handleBuyNow = () => {
    const productData = {
      id: product.id,
      slug: product.slug,
      name: productName,
      price: product.price,
      image: product.image,
      category: categoryName,
    };
    navigate("/buy-now", { state: { product: productData } });
  };

  const handleShare = (platform) => {
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
      alert(t("product.linkCopied") || "Link Copied!");
      setShowShare(false);
      return;
    }

    if (shareLink) window.open(shareLink, "_blank");
    setShowShare(false);
  };

  return (
    <div className="product-card fade-in">
      <div className="product-image-wrapper">
        <Link to={`/products/${product.slug || product.id}`}>
          <img
            src={product.image}
            alt={productName}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect fill='%23eee' width='300' height='400'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='30' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
            }} // Fallback image
          />
        </Link>
        {product.isNew && <span className="badge-new">{t("product.new")}</span>}

        <div className="action-buttons">
          <button
            className="btn-icon btn-share"
            title={t("product.share")}
            onClick={() => setShowShare(!showShare)}
          >
            <Share2 size={18} />
          </button>
          <button
            className="btn-icon btn-wishlist"
            title={t("product.addToWishlist")}
            onClick={handleAddToWishlist}
          >
            <Heart size={18} />
          </button>
        </div>

        {/* Share Menu */}
        {showShare && (
          <div className="share-menu fade-in">
            <button
              onClick={() => handleShare("facebook")}
              className="share-item facebook"
            >
              <Facebook size={16} /> Facebook
            </button>
            <button
              onClick={() => handleShare("instagram")}
              className="share-item instagram"
            >
              <Instagram size={16} /> Instagram
            </button>
            <button
              onClick={() => handleShare("whatsapp")}
              className="share-item whatsapp"
            >
              <MessageCircle size={16} /> Whatsapp
            </button>
          </div>
        )}
      </div>

      <div className="product-details">
        <div className="product-category">
          {t(`category.${categoryName.toLowerCase()}`, {
            defaultValue: categoryName,
          })}
        </div>
        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{productName}</Link>
        </h3>
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <div className="product-actions">
            <button
              className="btn-buy-now"
              title={t("product.buyNow")}
              onClick={handleBuyNow}
            >
              {t("product.buyNow")}
            </button>
            <button
              className="btn-add-cart"
              title="Add to Cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
            background-color: var(--white);
            transition: var(--transition);
            cursor: pointer;
        }
        
        .product-card:hover {
            transform: translateY(-4px);
        }
        
        .product-card:hover .product-image-wrapper img {
            transform: scale(1.08);
        }
        
        .product-image-wrapper {
            position: relative;
            overflow: hidden;
            padding-bottom: 140%; /* 5:7 aspect ratio for fashion products */
            background-color: var(--gray-100);
            border-radius: 0;
        }
        
        .product-image-wrapper img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .badge-new {
            position: absolute;
            top: 12px;
            left: 12px;
            background-color: var(--darker);
            color: var(--white);
            font-size: 10px;
            font-weight: 700;
            padding: 5px 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            z-index: 2;
            border-radius: 2px;
        }
        
        .action-buttons {
            position: absolute;
            top: 12px;
            right: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            z-index: 3;
        }

        .btn-icon {
            background: var(--white);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--darker);
            opacity: 0;
            transform: translateX(10px);
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: none;
            cursor: pointer;
        }
        
        .product-card:hover .btn-icon {
            opacity: 1;
            transform: translateX(0);
        }
        
        .product-card:hover .btn-wishlist { transition-delay: 0s; }
        .product-card:hover .btn-share { transition-delay: 0.05s; }

        .btn-icon:hover {
            background: var(--darker);
            color: var(--white);
            transform: scale(1.1);
        }
        
        .btn-wishlist:hover { 
            background: #e91e63;
            color: var(--white);
        }
        
        .btn-share:hover { 
            background: #2196f3;
            color: var(--white);
        }
        
        .share-menu {
            position: absolute;
            top: 50px;
            right: 12px;
            background: var(--white);
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            padding: 8px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            width: 150px;
            border: 1px solid var(--gray-200);
        }
        
        .share-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            font-size: 13px;
            color: var(--text-dark);
            background: none;
            border: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
            transition: var(--transition);
            border-radius: 4px;
            font-weight: 500;
        }
        
        .share-item:hover {
            background-color: var(--gray-100);
        }
        
        .share-item.facebook:hover { color: #1877f2; }
        .share-item.instagram:hover { color: #c32aa3; }
        .share-item.whatsapp:hover { color: #25d366; }

        .product-details {
            padding: 16px 0;
        }
        
        .product-category {
            display: block;
            font-size: 11px;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
            font-weight: 500;
        }
        
        .product-title {
            font-size: 14px;
            font-weight: 400;
            margin: 0 0 10px;
            line-height: 1.4;
            /* Modern line clamp */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: auto; 
            min-height: 40px;
            color: var(--darker);
        }
        
        .product-title a {
            color: var(--darker);
            transition: var(--transition);
        }
        
        .product-title a:hover {
            color: var(--gold);
            opacity: 1;
        }
        
        .product-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 12px;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .product-price {
            font-weight: 700;
            color: var(--darker);
            font-size: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 140px; /* Prevent it from pushing the button */
        }
        
        .btn-add-cart {
            background: var(--darker);
            color: var(--white);
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 4px;
            transition: var(--transition);
            cursor: pointer;
        }
        
        .btn-add-cart:hover {
            background: var(--gold);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .product-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn-buy-now {
            background: var(--darker);
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .btn-buy-now:hover {
            background: #000;
            transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
