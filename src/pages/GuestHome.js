import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { useTranslation } from "react-i18next";
import { getFeaturedProducts } from "../api/products";
import {
  IoShieldCheckmarkOutline,
  IoRefreshOutline,
  IoCarSportOutline,
} from "react-icons/io5";

const GuestHome = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: "Wanita", color: "#F2D0C7" }, // Rose
    { name: "Pria", color: "#8FA3A0" }, // Muted Teal
    { name: "Anak", color: "#EFE6E2" }, // Warm Surface
    { name: "Beauty", color: "#F2D0C7" },
    { name: "Sports", color: "#8FA3A0" },
    { name: "Luxury", color: "#EFE6E2" },
  ];

  return (
    <div className="home-page pb-5">
      {/* Hero Section - Bootstrap Carousel */}
      <section className="mb-5">
        <div
          id="heroCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
          </div>
          <div className="carousel-inner">
            <div
              className="carousel-item active"
              style={{ height: "clamp(320px, 50vh, 600px)" }}
            >
              {/* Fallback pattern or image */}
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000"
                className="d-block w-100 h-100 object-fit-cover"
                alt="Fashion Header"
                style={{ filter: "brightness(0.9)" }}
              />
              <div className="carousel-caption d-flex h-100 align-items-start align-items-md-center justify-content-center top-0 bottom-0">
                <div
                  className="text-center bg-white bg-opacity-90 p-4 p-lg-5 rounded-3 shadow-lg mt-3 mt-md-0"
                  style={{ maxWidth: "600px" }}
                >
                  <h1
                    className="display-4 fw-bold text-dark text-uppercase mb-3"
                    style={{ letterSpacing: "2px" }}
                  >
                    Fashion Starts Here
                  </h1>
                  <p className="lead text-secondary mb-4 d-none d-md-block">
                    Discover your personal style with our latest collection.
                  </p>
                  <Link
                    to="/products"
                    className="btn btn-primary btn-lg rounded-0 px-5 text-uppercase fw-bold ls-1"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Horizontal Scroll Mobile, Grid Desktop */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold text-uppercase mb-0">Shop by Category</h2>
        </div>

        <div
          className="d-flex overflow-x-auto pb-3 gap-3 d-md-grid d-md-gap-4"
          style={{
            // Apply grid style ONLY on md+, otherwise flex default
            display: "grid", // This line is risky with inline style media queries not possible directly without window match or CSS.
            // Better strategy: Bootstrap classes.
          }}
        >
          {/* 
             Correct Strategy for Responsive Switch: 
             Wrapper needs distinct behaviors.
           */}
        </div>

        {/* Re-doing the wrapper with classes */}
        <div className="row g-3 flex-nowrap overflow-x-auto flex-md-wrap justify-content-md-center pb-2">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="col-4 col-md-2"
              style={{ minWidth: "100px" }}
            >
              <Link
                to={`/products?category=${cat.name}`}
                className="text-decoration-none"
              >
                <div className="card border-0 text-center hover-shadow transition-all bg-transparent">
                  <div
                    className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: cat.color,
                    }}
                  >
                    {/* Icon or Initials could go here if no image */}
                    <span className="fw-bold text-dark fs-4 opacity-50">
                      {cat.name[0]}
                    </span>
                  </div>
                  <h6 className="small fw-bold text-uppercase text-dark">
                    {cat.name}
                  </h6>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners (Mockup) */}
      <section className="container mb-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div
              className="card border-0 text-white overflow-hidden rounded-3 shadow-sm h-100"
              style={{ minHeight: "200px" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "var(--accent-muted)",
                }}
              ></div>
              <div className="card-body position-relative d-flex flex-column justify-content-center p-4">
                <span className="badge bg-white text-dark w-auto align-self-start mb-2">
                  New Season
                </span>
                <h3 className="fw-bold mb-3">Summer Collection</h3>
                <Link
                  to="/products?category=Wanita"
                  className="btn btn-light align-self-start"
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="card border-0 text-white overflow-hidden rounded-3 shadow-sm h-100"
              style={{ minHeight: "200px" }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "var(--cta-primary)",
                }}
              ></div>
              <div className="card-body position-relative d-flex flex-column justify-content-center p-4">
                <span className="badge bg-white text-dark w-auto align-self-start mb-2">
                  Limited Offer
                </span>
                <h3 className="fw-bold mb-3">Up to 50% Off</h3>
                <Link to="/products" className="btn btn-light align-self-start">
                  Shop Sale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold text-uppercase mb-0">
            {t("common.featuredProducts") || "Featured Products"}
          </h2>
          <Link
            to="/products"
            className="text-secondary text-decoration-none d-flex align-items-center gap-1 group"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-4 g-3 g-md-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="col" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5 bg-light rounded">
                <p className="text-muted mb-0">No featured products found.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Brand Benefits */}
      <section className="bg-white py-5 border-top">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="mb-3">
                <IoShieldCheckmarkOutline className="fs-1 text-primary-custom" />
              </div>
              <h5 className="fw-bold text-uppercase">100% Original</h5>
              <p className="text-secondary small">
                Experience the real quality with our authentic products
                guarantee.
              </p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <IoRefreshOutline className="fs-1 text-primary-custom" />
              </div>
              <h5 className="fw-bold text-uppercase">30 Days Return</h5>
              <p className="text-secondary small">
                Not satisfied? Return it within 30 days, no questions asked.
              </p>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <IoCarSportOutline className="fs-1 text-primary-custom" />
              </div>
              <h5 className="fw-bold text-uppercase">Free Shipping</h5>
              <p className="text-secondary small">
                Enjoy free shipping on all orders above $100.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestHome;
