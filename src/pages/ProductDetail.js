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
  MessageCircle,
  Share2,
  Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/currency";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

import { addToCart as apiAddToCart } from "../api/cart";
import { addToWishlist } from "../utils/cart";
import Swal from "sweetalert2";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);

  // Reviews State
  const [reviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        let fetchSlug = slug;

        // ID Resolution Logic
        if (!isNaN(slug)) {
          try {
            const listResponse = await api.get("/api/product/");
            if (listResponse.data?.data) {
              const found = listResponse.data.data.find(
                (p) => String(p.id) === String(slug)
              );
              if (found?.slug) fetchSlug = found.slug;
            }
          } catch (e) {
            console.warn("ID resolve failed", e);
          }
        }

        const response = await api.get(`/api/product/${fetchSlug}`);
        const productData = response.data?.data;

        if (!productData) {
          throw new Error("Product data not found");
        }

        // Transform
        const images =
          productData.Media?.length > 0
            ? productData.Media.sort((a, b) => a.position - b.position).map(
                (m) =>
                  m.media_url.startsWith("http")
                    ? m.media_url
                    : `http://localhost:3000${
                        m.media_url.startsWith("/") ? "" : "/"
                      }${m.media_url}`
              )
            : ["https://via.placeholder.com/500"];

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

        const transformed = {
          ...productData,
          name: productData.product_name,
          category: productData.CategoriesM2M?.[0]?.category_name || "General",
          price: productData.Variants?.[0]?.price || 0,
          images,
          sizes: sizeVariants,
          colors: colorVariants,
          description:
            productData.description || productData.product_description,
        };

        setProduct(transformed);
        setSelectedImage(images[0]);
        if (sizeVariants.length) setSelectedSize(sizeVariants[0]);
        if (colorVariants.length) setSelectedColor(colorVariants[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: t("auth.loginRequired"),
        text: t("auth.pleaseLogin"),
        showCancelButton: true,
        confirmButtonText: t("auth.login"),
        cancelButtonText: t("common.cancel"),
      }).then((r) => r.isConfirmed && navigate("/login"));
      return;
    }

    // Variant logic
    let variantId = product.id;
    if (product.Variants?.length) {
      const match = product.Variants.find(
        (v) =>
          v.variant_value === selectedSize || v.variant_value === selectedColor
      );
      variantId = match ? match.id : product.Variants[0].id;
    }

    const result = await apiAddToCart({ variant_id: variantId, qty: 1 });
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: t("cart.added"),
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
      });
      refreshCart();
    } else {
      Swal.fire({ icon: "error", title: "Failed", text: result.message });
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (error || !product)
    return (
      <div className="container py-5 text-center">
        <h3>Product not found</h3>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/products")}
        >
          Back
        </button>
      </div>
    );

  return (
    <div className="product-detail-page pb-5">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button
                className="btn btn-link p-0 text-decoration-none text-secondary"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item">
              <button
                className="btn btn-link p-0 text-decoration-none text-secondary"
                onClick={() => navigate("/products")}
              >
                Shop
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.slug &&
              t(`product_names.${product.slug}`) !==
                `product_names.${product.slug}`
                ? t(`product_names.${product.slug}`)
                : product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-4 g-lg-5">
          {/* Left Column: Images */}
          <div className="col-lg-7">
            <div className="row g-2">
              {/* Thumbnails (Desktop: Vertical Left, Mobile: Hidden/Bottom) */}
              <div className="col-2 d-none d-lg-block">
                <div
                  className="d-flex flex-column gap-2 sticky-top"
                  style={{ top: "100px" }}
                >
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className={`border rounded cursor-pointer overflow-hidden ${
                        selectedImage === img
                          ? "border-primary border-2"
                          : "border-light"
                      }`}
                      onClick={() => setSelectedImage(img)}
                      style={{ width: "100%", aspectRatio: "1/1" }}
                    >
                      <img
                        src={img}
                        className="w-100 h-100 object-fit-cover"
                        alt="thumb"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Image */}
              <div className="col-12 col-lg-10">
                <div
                  className="position-relative bg-light rounded overflow-hidden cursor-zoom-in"
                  style={{ aspectRatio: "3/4" }}
                  onClick={() => setShowLightbox(true)}
                >
                  <img
                    src={selectedImage}
                    className="w-100 h-100 object-fit-cover"
                    alt={product.name}
                  />
                  <span className="position-absolute bottom-0 end-0 m-3 badge bg-dark bg-opacity-50">
                    <i className="bi bi-arrows-fullscreen me-1"></i> Zoom
                  </span>
                </div>
                {/* Mobile Thumbnails */}
                <div className="d-flex gap-2 mt-2 overflow-x-auto d-lg-none pb-2">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className={`flex-shrink-0 border rounded cursor-pointer ${
                        selectedImage === img
                          ? "border-primary border-2"
                          : "border-light"
                      }`}
                      style={{ width: "60px", height: "60px" }}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        className="w-100 h-100 object-fit-cover rounded"
                        alt="thumb"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: "100px" }}>
              <div className="mb-2">
                <span className="text-uppercase text-secondary fw-bold small tracking-wider">
                  {t(`category.${product.category.toLowerCase()}`) ||
                    product.category}
                </span>
              </div>
              <h1 className="h2 fw-bold mb-3">
                {product.slug &&
                t(`product_names.${product.slug}`) !==
                  `product_names.${product.slug}`
                  ? t(`product_names.${product.slug}`)
                  : product.name}
              </h1>
              <div className="d-flex align-items-center mb-4">
                <span className="h3 fw-bold text-primary-custom mb-0">
                  {formatCurrency(product.price, i18n.language)}
                </span>
              </div>

              {/* Description Short */}
              <p className="text-secondary mb-4">{product.description}</p>

              {/* Variants */}
              <div className="mb-4">
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-3">
                    <label className="fw-semibold mb-2 d-block">
                      {t("product.color")}:{" "}
                      <span className="text-primary">{selectedColor}</span>
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          className={`btn btn-sm ${
                            selectedColor === c
                              ? "btn-dark"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() => setSelectedColor(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-3">
                    <label className="fw-semibold mb-2 d-block">
                      {t("product.size")}:{" "}
                      <span className="text-primary">{selectedSize}</span>
                    </label>
                    <div className="d-flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          className={`btn btn-sm ${
                            selectedSize === s
                              ? "btn-dark"
                              : "btn-outline-secondary"
                          }`}
                          style={{ minWidth: "40px" }}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Actions */}
              <div className="d-none d-md-flex gap-2 mb-4">
                <button
                  className="btn btn-primary btn-lg flex-grow-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} className="me-2" />{" "}
                  {t("product.addToCart")}
                </button>
                <button
                  className="btn btn-outline-dark btn-lg"
                  onClick={() =>
                    addToWishlist(
                      {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                      },
                      t
                    )
                  }
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Share & Info */}
              <div className="border-top pt-4">
                <div className="d-flex gap-4 mb-3">
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <Truck size={18} /> Free Delivery
                  </div>
                  <div className="d-flex align-items-center gap-2 text-secondary small">
                    <ShieldCheck size={18} /> Authentic
                  </div>
                </div>
              </div>

              {/* Review Accordion Placeholder */}
              <div className="accordion mt-4" id="productAccordion">
                <div className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed px-0 bg-transparent fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseDescription"
                    >
                      Full Description
                    </button>
                  </h2>
                  <div
                    id="collapseDescription"
                    className="accordion-collapse collapse"
                    data-bs-parent="#productAccordion"
                  >
                    <div className="accordion-body px-0 text-secondary">
                      {product.description}
                    </div>
                  </div>
                </div>
                <div className="accordion-item border-0 border-bottom">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed px-0 bg-transparent fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseReviews"
                    >
                      Reviews ({reviews.length})
                    </button>
                  </h2>
                  <div
                    id="collapseReviews"
                    className="accordion-collapse collapse"
                    data-bs-parent="#productAccordion"
                  >
                    <div className="accordion-body px-0">
                      <p className="text-muted">Reviews coming soon...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed-bottom bg-white border-top p-3 d-md-none shadow-lg d-flex gap-2 z-3">
        <button
          className="btn btn-outline-dark flex-shrink-0"
          onClick={() =>
            addToWishlist(
              {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
              },
              t
            )
          }
        >
          <Heart size={20} />
        </button>
        <button
          className="btn btn-primary flex-grow-1 fw-bold"
          onClick={handleAddToCart}
        >
          Add to Cart - {formatCurrency(product.price, i18n.language)}
        </button>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-90 z-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
          onClick={() => setShowLightbox(false)}
        >
          <button className="btn btn-close btn-close-white position-absolute top-0 end-0 m-4"></button>
          <img
            src={selectedImage}
            alt="Full"
            className="img-fluid"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
