import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import { getProducts } from "../api/products";
import { useTranslation } from "react-i18next";

const ProductList = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-Category Logic
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const filterCategories = useMemo(() => {
    const cats = searchParams.getAll("category");
    return cats.length > 0 ? cats : ["All"];
  }, [searchParams]);

  // Helper to translate categories
  const getCategoryName = (cat) => {
    if (cat === "All") return t("common.allFashion");

    // Check common manual maps first
    const lower = cat.toLowerCase();
    if (lower === "pria" || lower === "men" || lower === "man")
      return t("common.men");
    if (lower === "wanita" || lower === "women" || lower === "women")
      return t("common.women");
    if (lower === "anak" || lower === "kids" || lower === "child")
      return t("common.kids");
    if (lower === "bayi" || lower === "baby") return t("common.baby");
    if (lower === "unisex" || cat.includes("&")) return t("common.unisex");

    // Try generic category key
    return t(`category.${lower}`, { defaultValue: cat });
  };

  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // 10 columns * 5 rows

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        console.log("Fetch products finished");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    const currentCategories = searchParams.getAll("category");
    let newCategories = [];

    if (category === "All") {
      newCategories = []; // Clears all
    } else if (isMultiSelect) {
      if (currentCategories.includes(category)) {
        newCategories = currentCategories.filter((c) => c !== category);
      } else {
        newCategories = [
          ...currentCategories.filter((c) => c !== "All"),
          category,
        ];
      }
    } else {
      newCategories = [category];
    }

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    if (newCategories.length > 0) {
      newCategories.forEach((cat) => newParams.append("category", cat));
    }

    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // Extract all unique categories from products' `categories` array
  const categories = useMemo(() => {
    const allCats = products.flatMap((p) => p.categories || []);
    // Remove "Uncategorized", duplicates, and empty strings
    const uniqueCats = [...new Set(allCats)]
      .filter((c) => c && c !== "Uncategorized" && c !== "Pria & Wanita") // Filtering common redundant M2M if desired
      .sort();
    return ["All", ...uniqueCats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (!filterCategories.includes("All")) {
      result = result.filter((p) => {
        // Check if product belongs to ANY of the selected categories
        const productCats = p.categories || [p.category]; // Handle both M2M and single
        return productCats.some((pc) => filterCategories.includes(pc));
      });
    }

    // Filter by Search (Mock)
    if (searchQuery) {
      result = result.filter((p) => {
        const name = p.name[i18n.language] || p.name["en"];
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      // Mock newness logic (assuming IDs or isNew flag)
      result.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
    }

    return result;
  }, [filterCategories, sortBy, searchQuery, i18n.language, products]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="product-list-page container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            {filterCategories.length === 1 && filterCategories[0] === "All"
              ? t("common.allFashion")
              : filterCategories.map((c) => getCategoryName(c)).join(", ")}
          </h1>
          <span className="product-count">
            {filteredProducts.length} {t("common.itemsFound")}
          </span>
        </div>

        {/* Mobile Filter Toggle (hidden on desktop generally, but useful) */}
        {/* <button className="mobile-filter-btn"><Filter size={18} /> {t("common.filter")}</button> */}
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar sticky-sidebar">
          <div className="sidebar-section">
            <h3 className="sort-label">{t("common.sortBy")}</h3>
            <div className="custom-select-wrapper">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="modern-select"
              >
                <option value="newest">{t("common.sortNewest")}</option>
                <option value="price-asc">
                  {t("common.sortPriceLowHigh")}
                </option>
                <option value="price-desc">
                  {t("common.sortPriceHighLow")}
                </option>
              </select>
            </div>
          </div>

          <div className="sidebar-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 className="sidebar-title" style={{ marginBottom: 0 }}>
                {t("common.categories")}
              </h3>
              <label
                className="multi-select-toggle"
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={isMultiSelect}
                  onChange={(e) => setIsMultiSelect(e.target.checked)}
                />
                {t("common.multiSelect")}
              </label>
            </div>

            <div className="category-tags">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-tag ${filterCategories.includes(cat) ? "active" : ""
                    }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="shop-main">
          {loading ? (
            <div className="loading-state">
              <p>{t("common.loading")}</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
              >
                {t("common.retry")}
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="product-grid">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="page-btn nav-btn"
                  >
                    &lt; {t("common.prev")}
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? "active" : ""
                        }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="page-btn nav-btn"
                  >
                    {t("common.next")} &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>{t("common.noProductsFound")}</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery("");
                  searchParams.delete("category");
                  setSearchParams(searchParams);
                }}
              >
                {t("common.resetFilters")}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .loading-state, .error-state {
            text-align: center;
            padding: 60px;
            background: #fafafa;
            border-radius: 8px;
        }
        .product-list-page {
            padding-top: 40px;
            padding-bottom: 80px;
            width: 100%;
            max-width: 100%; /* Ensure full width */
            padding-left: 20px;
            padding-right: 20px;
        }
        .page-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px; /* Reduced margin */
        }
        .page-title {
            font-size: 24px; /* Slightly smaller for density */
            text-transform: capitalize;
            color: var(--darker);
            margin-bottom: 5px;
        }
        .product-count {
            color: #888;
            font-size: 14px;
        }
        
        .shop-layout {
            display: grid;
            grid-template-columns: 240px 1fr; /* Sidebar + Main */
            gap: 30px;
            align-items: start;
        }

        .sticky-sidebar {
            position: sticky;
            top: 20px;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            padding-right: 10px;
        }
        
        .sidebar-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            color: var(--darker);
        }
        .sort-label {
             font-size: 12px;
             text-transform: uppercase;
             color: #888;
             margin-bottom: 8px;
             font-weight: 600;
        }

        .category-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .category-tag {
            background: #fff;
            border: 1px solid #eee;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            color: #555;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .category-tag:hover {
            border-color: #ccc;
            color: var(--dark);
        }
        .category-tag.active {
            background: var(--darker);
            color: #fff;
            border-color: var(--darker);
        }
        
        /* Modern Select */
        .modern-select {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #e1e1e1;
            border-radius: 8px;
            background-color: #fff;
            font-size: 14px;
            color: var(--darker);
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 12px top 50%;
            background-size: 10px auto;
            transition: border-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }
        .modern-select:focus {
            outline: none;
            border-color: var(--dark);
        }
        
        .sidebar-section {
            margin-bottom: 40px;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr); /* 5 Columns back as requested */
            gap: 20px;
        }
        
        /* Revert font sizes to standard */
        .product-card .product-title {
            font-size: 14px;
            height: 40px;
        }
        .product-card .product-price {
            font-size: 15px;
        }

        .pagination {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        .page-btn {
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: #fff;
            cursor: pointer;
            border-radius: 4px;
            transition: var(--transition);
        }
        .page-btn:hover:not(:disabled) {
            background: #f5f5f5;
            border-color: #ccc;
        }
        .page-btn.active {
            background: var(--darker);
            color: #fff;
            border-color: var(--darker);
        }
        .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px;
            background: #fafafa;
            border-radius: 8px;
        }
        
        /* Responsive adaptations */
        @media (max-width: 1600px) {
            .product-grid {
                grid-template-columns: repeat(8, 1fr);
            }
        }
        @media (max-width: 1400px) {
            .product-grid {
                grid-template-columns: repeat(6, 1fr);
            }
        }
        @media (max-width: 1200px) {
            .product-grid {
                grid-template-columns: repeat(5, 1fr);
            }
        }
        @media (max-width: 992px) {
            .product-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        @media (max-width: 768px) {
            .shop-layout {
                display: block;
            }
            .shop-sidebar {
                margin-bottom: 20px;
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 10px;
            }
            .product-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }
        }
        @media (max-width: 480px) {
             .product-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
      `}</style>
    </div>
  );
};

export default ProductList;
