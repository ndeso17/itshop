import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import Skeleton from "../components/ui/Skeleton";
import { useTranslation } from "react-i18next";
import { getFeaturedProducts } from "../api/products";

const GuestHome = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        setFeaturedProducts(data.slice(0, 4)); // Limit to 4 items
      } catch (error) {
        console.error("Failed to load featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content fade-in">
            <span className="hero-subtitle">{t("common.newCollection")}</span>
            <h1 className="hero-title">{t("common.elevateStyle")}</h1>
            <p className="hero-text">{t("common.heroText")}</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                {t("common.shopNow")}
              </Link>
              <Link to="/register" className="btn btn-secondary">
                {t("common.joinItshop")}
              </Link>
            </div>
          </div>
          <div className="hero-image-wrapper fade-in">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000"
              alt="Fashion Model"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("common.featuredProducts")}</h2>
            <Link to="/products" className="view-all-link">
              {t("common.viewAll")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {loading ? (
              // Skeleton Grid
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="skeleton-card">
                    <Skeleton type="image" height="350px" className="mb-2" />
                    <Skeleton type="text" width="60%" height="20px" className="mb-1" />
                    <Skeleton type="text" width="40%" height="16px" />
                  </div>
                ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center col-12">No featured products found.</p>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
            background: var(--white);
        }

        .hero-section {
            position: relative;
            height: 550px;
            background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                        url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000') center/cover;
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        
        .hero-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 40px;
            width: 100%;
            position: relative;
            z-index: 2;
        }
        
        .hero-content {
            max-width: 600px;
            color: var(--white);
        }
        
        .hero-image-wrapper {
            display: none;
        }
        
        .hero-subtitle {
            color: var(--white);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-size: 12px;
            display: block;
            margin-bottom: 16px;
            opacity: 0.95;
        }
        
        .hero-title {
            font-size: 52px;
            line-height: 1.15;
            color: var(--white);
            margin-bottom: 20px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .hero-text {
            color: var(--white);
            margin-bottom: 32px;
            font-size: 16px;
            line-height: 1.7;
            opacity: 0.95;
            max-width: 480px;
        }
        
        .hero-buttons {
            display: flex;
            gap: 16px;
        }
        
        .hero-buttons .btn {
            padding: 14px 32px;
            font-weight: 600;
            font-size: 15px;
            border-radius: 2px;
            transition: var(--transition);
        }
        
        .hero-buttons .btn-primary {
            background: var(--white);
            color: var(--darker);
            border: none;
        }
        
        .hero-buttons .btn-primary:hover {
            background: var(--gray-100);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .hero-buttons .btn-secondary {
            background: transparent;
            color: var(--white);
            border: 2px solid var(--white);
        }
        
        .hero-buttons .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .featured-section {
            padding: 100px 0;
            background: var(--white);
        }
        
        .featured-section .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 40px;
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 48px;
        }
        
        .section-header h2 {
            font-size: 28px;
            color: var(--darker);
            font-weight: 700;
            margin: 0;
        }
        
        .view-all-link {
            display: flex;
            align-items: center;
            gap: 6px;
            color: var(--darker);
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: var(--transition);
        }
        
        .view-all-link:hover {
            color: var(--gold);
            gap: 10px;
            opacity: 1;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
        }
        
        @media (max-width: 1024px) {
            .hero-section {
                height: 480px;
            }
            
            .hero-title {
                font-size: 44px;
            }
            
            .hero-container {
                padding: 0 30px;
            }
            
            .featured-section {
                padding: 80px 0;
            }
            
            .featured-section .container {
                padding: 0 30px;
            }
            
            .product-grid {
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                gap: 20px;
            }
        }
        
        @media (max-width: 768px) {
            .hero-section {
                height: 420px;
            }
            
            .hero-container {
                padding: 0 20px;
            }
            
            .hero-content {
                text-align: center;
                max-width: 100%;
            }
            
            .hero-subtitle {
                font-size: 11px;
                letter-spacing: 2px;
            }
            
            .hero-title {
                font-size: 36px;
                margin-bottom: 16px;
            }
            
            .hero-text {
                font-size: 15px;
                margin-bottom: 28px;
                max-width: 100%;
            }
            
            .hero-buttons {
                flex-direction: column;
                gap: 12px;
            }
            
            .hero-buttons .btn {
                width: 100%;
                padding: 12px 24px;
            }
            
            .featured-section {
                padding: 60px 0;
            }
            
            .featured-section .container {
                padding: 0 20px;
            }
            
            .section-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 32px;
            }
            
            .section-header h2 {
                font-size: 24px;
            }
            
            .product-grid {
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 16px;
            }
        }
      `}</style>
    </div>
  );
};

export default GuestHome;
