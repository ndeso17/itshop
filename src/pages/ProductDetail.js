import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Facebook,
  Instagram,
  MessageCircle, // Using for Whatsapp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getProductBySlug } from "../api/catalog";
import api from "../api/axios";
import { addToCart, addToWishlist } from "../utils/cart";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const DUMMY_REVIEWS = [
  {
    id: 1,
    user: "Alice Johnson",
    rating: 5,
    date: "2024-10-15",
    color: "Red",
    size: "M",
    text: "Absolutely love this! The color is vibrant and it fits perfectly. fast shipping too!",
    avatar: "https://i.pravatar.cc/150?u=alice",
  },
  {
    id: 2,
    user: "Budi Santoso",
    rating: 4,
    date: "2024-11-02",
    text: "Bagus, bahannya adem. Cuma pengirimannya agak lama sedikit.",
    avatar: "https://i.pravatar.cc/150?u=budi",
  },
  {
    id: 3,
    user: "Clara Wing",
    rating: 5,
    date: "2024-11-20",
    color: "Blue",
    text: "Great quality for the price. Will buy again.",
    avatar: "https://i.pravatar.cc/150?u=clara",
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? "#FFD700" : "#E0E0E0",
            fontSize: "16px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const formatPrice = (price) => {
    switch (i18n.language) {
      case "id":
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(price * 15000);
      case "kr":
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
  };

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Review System State
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [reviewVariant, setReviewVariant] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewFile, setReviewFile] = useState(null);

  // Load reviews from local storage on mount/slug change
  useEffect(() => {
    if (!product) return;

    // Load local reviews
    const storageKey = `reviews_${product.id}`;
    const localReviews = JSON.parse(localStorage.getItem(storageKey) || "[]");

    // Combine with dummy reviews (optional: only show dummy if no local? or always mix?)
    // For this demo, let's mix them so the list isn't empty initially
    setReviews([...DUMMY_REVIEWS, ...localReviews]);
  }, [product]);

  const handleReviewSubmit = async () => {
    if (userRating === 0) {
      Swal.fire({
        icon: 'warning',
        title: t("reviews.ratingRequired") || "Rating Required",
        text: t("reviews.pleaseRate") || "Please select a star rating",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (!reviewText.trim()) {
      Swal.fire({
        icon: 'warning',
        title: t("reviews.commentRequired") || "Comment Required",
        text: t("reviews.pleaseComment") || "Please write a review comment",
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    let imageBase64 = null;
    if (reviewFile) {
      try {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(reviewFile);
        });
      } catch (error) {
        console.error("Error reading file:", error);
        Swal.fire({
          icon: 'error',
          title: "Error",
          text: "Failed to upload image",
        });
        return;
      }
    }

    const newReview = {
      id: Date.now(),
      user: user ? (user.full_name || user.username || "User") : "Guest User",
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      text: reviewText,
      avatar: "https://ui-avatars.com/api/?name=" + (user ? (user.full_name || "User") : "Guest") + "&background=random",
      color: reviewVariant.includes("Color:") ? reviewVariant.replace("Color:", "").trim() : null,
      size: reviewVariant.includes("Size:") ? reviewVariant.replace("Size:", "").trim() : null,
      image: imageBase64 // Save the base64 string
    };

    // Update state
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);

    // Save to local storage
    const storageKey = `reviews_${product.id}`;
    const existingLocal = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([...existingLocal, newReview]));

    // Reset Form
    setUserRating(0);
    setReviewText("");
    setReviewVariant("");
    setReviewFile(null);

    Swal.fire({
      icon: 'success',
      title: t("reviews.submitted") || "Review Submitted",
      text: t("reviews.thankYou") || "Thank you for your feedback!",
      timer: 2000,
      showConfirmButton: false
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let productData;
        let fetchSlug = slug;

        // Mechanism 1: If slug looks like an ID, resolve it to a real slug first
        // This handles navigation from Cart/Wishlist using IDs
        if (!isNaN(slug)) {
          try {
            const listResponse = await api.get("/api/product/");
            if (listResponse.data && listResponse.data.data) {
              const found = listResponse.data.data.find(p => String(p.id) === String(slug));
              if (found && found.slug) {
                fetchSlug = found.slug;
              }
            }
          } catch (resolutionError) {
            console.warn("ID resolution failed, trying direct slug usage", resolutionError);
          }
        }

        try {
          const data = await getProductBySlug(fetchSlug);
          productData = data.data;
        } catch (slugError) {
          console.error("Primary fetch failed", slugError);
          // Fallback: If fetchSlug was different from slug, maybe try original?
          // Or if simpler ID lookup works? 
          // At this point if getProductBySlug failed with the resolved slug, the data is likely missing.
          throw slugError;
        }

        // Transform API data to component format
        const images =
          productData.Media && productData.Media.length > 0
            ? productData.Media.sort((a, b) => a.position - b.position).map(
              (m) => {
                if (m.media_url.startsWith("http")) return m.media_url;
                return `http://localhost:3000${m.media_url.startsWith("/") ? "" : "/"
                  }${m.media_url}`;
              }
            )
            : ["https://via.placeholder.com/500"]; // Fallback image

        const sizeVariants = productData.Variants
          ? [
            ...new Set(
              productData.Variants.filter(
                (v) => v.variant_type === "SIZE"
              ).map((v) => v.variant_value)
            ),
          ]
          : [];

        const colorVariants = productData.Variants
          ? [
            ...new Set(
              productData.Variants.filter(
                (v) => v.variant_type === "COLOR"
              ).map((v) => v.variant_value)
            ),
          ]
          : [];

        const transformedProduct = {
          ...productData,
          name: productData.product_name,
          categoryKey:
            productData.CategoriesM2M && productData.CategoriesM2M.length > 0
              ? `category.${productData.CategoriesM2M[0].category_name
                .toLowerCase()
                .replace(/ & /g, "_")}` // Handle "Pria & Wanita" -> "pria_wanita" if needed, or just single word.
              : // Actually API returns "Pria", "Wanita". If "Pria & Wanita" is a category, I need to check how it's formatted.
              // Assuming "Pria", "Wanita", "Anak", "Bayi".
              // Let's stick to simple toLowerCase().
              "category.general",
          // Refined logic below
          category:
            productData.CategoriesM2M && productData.CategoriesM2M.length > 0
              ? productData.CategoriesM2M[0].category_name
              : "General",
          descriptionKey: `product_content.${slug}`,
          price:
            productData.Variants && productData.Variants.length > 0
              ? parseFloat(productData.Variants[0].price)
              : 0,
          images: images,
          image: images[0],
          sizes: sizeVariants,
          colors: colorVariants,
        };

        setProduct(transformedProduct);
        setSelectedImage(images[0]);
        if (sizeVariants.length > 0) setSelectedSize(sizeVariants[0]);
        if (colorVariants.length > 0) setSelectedColor(colorVariants[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0],
      category: product.category,
    };
    addToCart(productData, t);
  };

  const handleAddToWishlist = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0],
      category: product.category,
    };
    addToWishlist(productData, t);
  };

  const handleBuyNow = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images[0],
      category: product.category,
      size: selectedSize,
      color: selectedColor
    };

    navigate('/buy-now', { state: { product: productData } });
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "40px", textAlign: "center" }}
      >
        Loading...
      </div>
    );

  if (error || !product)
    return (
      <div
        className="container"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <h2>Product not found</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/products")}
        >
          {t("product.back")}
        </button>
      </div>
    );

  return (
    <div className="product-detail-page container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> {t("product.back")}
      </button>

      <div className="product-layout">
        {/* Images */}
        <div className="product-gallery">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} ${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="product-info-panel">
          <div className="info-header">
            <span className="product-cat">
              {t(
                product.categoryKey
                  ? product.categoryKey.toLowerCase()
                  : "category.general",
                { defaultValue: product.category }
              )}
            </span>
            <h1 className="product-name">{product.name}</h1>
            <p className="product-price">{formatPrice(product.price)}</p>
          </div>

          <div className="product-description">
            <h3>{t("product.description")}</h3>
            <p>
              {t(product.descriptionKey, {
                defaultValue:
                  product.description || product.product_description,
              })}
            </p>
          </div>

          {/* Variants */}
          <div className="variants-section">
            {product.sizes && product.sizes.length > 0 && (
              <div className="variant-group">
                <label>{t("product.size")}:</label>
                <div className="variant-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`variant-btn ${selectedSize === size ? "active" : ""
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="variant-group">
                <label>{t("product.color")}:</label>
                <div className="variant-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`variant-btn ${selectedColor === color ? "active" : ""
                        }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="btn btn-darker btn-lg btn-buy-now"
              onClick={handleBuyNow}
            >
              {t("product.buyNow")}
            </button>
            <button
              className="btn btn-primary btn-lg btn-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={20} /> {t("product.addToCart")}
            </button>
            <button
              className="btn btn-secondary btn-lg btn-wishlist-large"
              onClick={handleAddToWishlist}
            >
              <Heart size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <Truck size={20} /> <span>{t("product.freeShipping")}</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} /> <span>{t("product.authenticity")}</span>
            </div>
          </div>

          {/* Share Section */}
          <div className="share-section">
            <span className="share-label">{t("product.share")}:</span>
            <div className="share-icons">
              <button
                className="share-btn facebook"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <Facebook size={18} />
              </button>
              <button
                className="share-btn instagram"
                onClick={() =>
                  window.open("https://www.instagram.com/", "_blank")
                }
              >
                <Instagram size={18} />
              </button>
              <button
                className="share-btn whatsapp"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="product-reviews-section">
        <h2 className="section-title">{t("reviews.title")}</h2>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="reviewer-avatar"
                  />
                  <div>
                    <h4 className="reviewer-name">{review.user}</h4>
                    <div className="review-meta">
                      <StarRating rating={review.rating} />
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="review-body">
                {/* Optional fields: Color & Size */}
                {(review.color || review.size) && (
                  <div className="review-variants">
                    {review.color && (
                      <span className="review-badge">
                        {t("reviews.color")}: {review.color}
                      </span>
                    )}
                    {review.size && (
                      <span className="review-badge">
                        {t("reviews.size")}: {review.size}
                      </span>
                    )}
                  </div>
                )}
                <p className="review-text">{review.text}</p>
                {review.image && (
                  <div className="review-image-container" style={{ marginTop: "10px" }}>
                    <img
                      src={review.image}
                      alt="Review attachment"
                      style={{ maxWidth: "150px", borderRadius: "8px", border: "1px solid #eee", cursor: "pointer" }}
                      onClick={() => window.open(review.image, "_blank")}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="review-form-modern fade-in">
          <div className="review-form-header">
            <h3>{t("reviews.writeReview")}</h3>
            <p className="review-subtitle">{t("reviews.subtitle")}</p>
          </div>

          <div className="form-group rating-group">
            <label className="input-label">{t("reviews.rating")}</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= userRating ? "active" : ""}`}
                  onClick={() => setUserRating(star)}
                  style={{ color: star <= userRating ? "#FFD700" : "#ddd" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {((product.sizes && product.sizes.length > 0) ||
            (product.colors && product.colors.length > 0)) && (
              <div className="form-group">
                <label className="input-label">{t("product.variant")}</label>
                <div className="select-wrapper-modern">
                  <select
                    value={reviewVariant}
                    onChange={(e) => setReviewVariant(e.target.value)}
                    className="modern-input"
                  >
                    <option value="">{t("reviews.selectVariant")}</option>
                    {product.sizes &&
                      product.sizes.map((s) => (
                        <option key={s} value={`Size: ${s}`}>
                          {t("product.size")}: {s}
                        </option>
                      ))}
                    {product.colors &&
                      product.colors.map((c) => (
                        <option key={c} value={`Color: ${c}`}>
                          {t("product.color")}: {c}
                        </option>
                      ))}
                  </select>
                  <div className="select-arrow">
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </div>
            )}

          <div className="form-group">
            <label className="input-label">{t("reviews.comment")}</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="modern-input"
              placeholder={t("reviews.placeholder")}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="input-label">{t("reviews.upload")}</label>
            <div className="file-upload-modern">
              <input
                type="file"
                id="review-file"
                accept="image/*,video/*"
                onChange={(e) => setReviewFile(e.target.files[0])}
                className="hidden-file-input"
              />
              <label htmlFor="review-file" className="file-upload-label">
                <span className="upload-icon">+</span>
                <span>
                  {reviewFile ? reviewFile.name : t("reviews.upload")}
                </span>
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary btn-submit-review"
            onClick={handleReviewSubmit}
          >
            {t("reviews.submit")}
          </button>
        </div>
      </div>

      {/* Related Products Section - HIDDEN FOR NOW as logic needs update */}
      {/* 
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="section-title">{t("product.relatedProducts")}</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )} 
      */}

      <style>{`
                .product-detail-page {
                    padding-top: 20px;
                    padding-bottom: 80px;
                }
                .back-btn {
                    background: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #666;
                }
                .back-btn:hover {
                    color: var(--dark);
                }
                
                .product-layout {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 50px;
                }
                
                .product-gallery {
                    /* Sticky gallery if desirable */
                }
                .main-image {
                    background: #f5f5f5;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .main-image img {
                    width: 100%;
                    height: auto;
                    display: block;
                }
                .image-thumbnails {
                    display: flex;
                    gap: 15px;
                }
                .thumbnail {
                    width: 80px;
                    height: 100px;
                    background: #f5f5f5;
                    cursor: pointer;
                    border: 2px solid transparent;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .thumbnail.active {
                    border-color: var(--gold);
                }
                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .info-header {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .product-cat {
                    text-transform: uppercase;
                    color: #999;
                    font-size: 12px;
                    letter-spacing: 1px;
                }
                .product-name {
                    font-size: 32px;
                    margin: 5px 0 10px;
                }
                .product-price {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--darker);
                }
                
                .product-description {
                    line-height: 1.7;
                    color: #555;
                    margin-bottom: 30px;
                }
                
                .variants-section {
                    margin-bottom: 30px;
                }
                .variant-group {
                    margin-bottom: 20px;
                }
                .variant-group label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .variant-options {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .variant-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: #fff;
                    min-width: 40px;
                    text-align: center;
                    border-radius: 4px;
                }
                .variant-btn:hover {
                    border-color: var(--dark);
                }
                .variant-btn.active {
                    background: var(--dark);
                    color: #fff;
                    border-color: var(--dark);
                }
                
                .action-buttons {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 30px;
                }
                .btn-add-cart {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-wishlist-large {
                    width: 50px;
                    height: 50px; /* Updated to ensure square */
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .btn-buy-now {
                    flex: 1;
                    background: var(--darker);
                    color: #fff;
                    border: none;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-buy-now:hover {
                    background: #000;
                    transform: translateY(-2px);
                }
                
                .share-section {
                    margin-top: 25px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                }
                .share-label {
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--dark);
                }
                .share-icons {
                    display: flex;
                    gap: 10px;
                }
                .share-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 1px solid #eee;
                    background: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #555;
                    transition: all 0.2s;
                }
                .share-btn:hover {
                    color: #fff;
                    border-color: transparent;
                }
                .share-btn.facebook:hover {
                    background: #1877f2;
                }
                .share-btn.instagram:hover {
                    background: #e4405f;
                }
                .share-btn.whatsapp:hover {
                    background: #25d366;
                }
                
                .product-features {
                    background: #fafafa;
                    padding: 20px;
                    border-radius: 4px;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #555;
                }
                .feature-item:last-child {
                    margin-bottom: 0;
                }
                
                .product-reviews-section, .related-products-section {
                    margin-top: 60px;
                    border-top: 1px solid #eee;
                    padding-top: 40px;
                }
                .section-title {
                    font-size: 24px;
                    margin-bottom: 30px;
                    color: var(--darker);
                }
                
                /* Reviews List Styles */
                .reviews-list {
                    margin-bottom: 50px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .review-card {
                    background: #f9f9f9;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #eee;
                }
                .review-header {
                    margin-bottom: 15px;
                }
                .reviewer-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .reviewer-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #fff;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .reviewer-name {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 5px 0;
                    color: var(--darker);
                }
                .review-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .review-date {
                    font-size: 12px;
                    color: #999;
                }
                .review-body {
                    color: #555;
                    line-height: 1.6;
                }
                .review-variants {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .review-badge {
                    font-size: 12px;
                    background: #fff;
                    border: 1px solid #ddd;
                    padding: 4px 10px;
                    border-radius: 20px;
                    color: #666;
                }
                .review-text {
                    margin: 0;
                }

                .review-form-modern {
                    background: #fff;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    max-width: 700px;
                    margin: 0 auto;
                }
                .review-form-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .review-form-header h3 {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                .review-subtitle {
                    color: #666;
                    font-size: 14px;
                }
                
                .input-label {
                   font-weight: 600;
                   font-size: 13px;
                   text-transform: uppercase;
                   letter-spacing: 0.5px;
                   margin-bottom: 8px;
                   display: block;
                   color: #444;
                }

                .modern-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-family: inherit;
                    transition: all 0.2s;
                    background: #f9f9f9;
                }
                .modern-input:focus {
                    background: #fff;
                    border-color: var(--dark);
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
                    outline: none;
                }
                
                .star-rating {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 10px;
                }
                .star-btn {
                    font-size: 24px;
                    color: #ddd;
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .star-btn:hover {
                    color: var(--gold);
                }

                .file-upload-modern {
                    margin-top: 10px;
                }
                .hidden-file-input {
                    display: none;
                }
                .file-upload-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    border: 2px dashed #ddd;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #666;
                    font-weight: 500;
                }
                .file-upload-label:hover {
                    border-color: var(--dark);
                    color: var(--dark);
                    background: #f9f9f9;
                }
                .upload-icon {
                    font-size: 20px;
                    background: #eee;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-submit-review {
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-top: 10px;
                }

                .select-wrapper-modern {
                    position: relative;
                }
                .select-arrow {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    pointer-events: none;
                    color: #888;
                }
                .modern-input[component="select"] {
                    appearance: none;
                }

                @media (max-width: 768px) {
                    .product-layout {
                        grid-template-columns: 1fr;
                    }
                    .review-form-modern {
                        padding: 20px;
                    }
                }
            `}</style>
    </div>
  );
};

export default ProductDetail;
