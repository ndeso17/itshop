import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { getProducts } from "../api/products";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import {
  IoCheckmark,
  IoChevronBack,
  IoChevronForward,
  IoSearchOutline,
} from "react-icons/io5";

const ITEMS_PER_PAGE = 24;

const ProductList = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState("newest");
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get("search") || "";
  const filterCategories = searchParams.getAll("category").length
    ? searchParams.getAll("category")
    : ["All"];

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const allCats = products.flatMap((p) => {
      if (!p) return [];
      const raw = p.categories || (p.category ? [p.category] : []);
      return raw.map((c) =>
        typeof c === "object" ? c.name || c.category_name : c
      );
    });

    return ["All", ...new Set(allCats.filter(Boolean))];
  }, [products]);

  const getCategoryName = (cat) => {
    if (cat === "All") return t("common.allFashion") || "All Products";
    return t(`category.${cat.toLowerCase()}`, { defaultValue: cat });
  };

  /* ================= FILTER & SORT ================= */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (!filterCategories.includes("All")) {
      result = result.filter((p) => {
        const cats = p.categories || (p.category ? [p.category] : []);
        const names = cats.map((c) =>
          (typeof c === "string"
            ? c
            : c?.name || c?.category_name || ""
          ).toLowerCase()
        );
        return filterCategories.some((f) =>
          names.includes(f.toLowerCase())
        );
      });
    }

    // Search
    if (searchQuery) {
      result = result.filter((p) => {
        const name =
          typeof p.name === "string"
            ? p.name
            : p.name?.[i18n.language] ||
              p.name?.en ||
              Object.values(p.name || {})[0] ||
              "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [products, filterCategories, searchQuery, sortBy, i18n.language]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= CATEGORY HANDLER ================= */
  const handleCategoryChange = (category) => {
    let newCats = [];

    if (category === "All") {
      newCats = [];
    } else if (isMultiSelect) {
      newCats = filterCategories.includes(category)
        ? filterCategories.filter((c) => c !== category)
        : [...filterCategories.filter((c) => c !== "All"), category];
    } else {
      newCats = [category];
    }

    const params = new URLSearchParams();
    newCats.forEach((c) => params.append("category", c));
    if (searchQuery) params.set("search", searchQuery);

    setSearchParams(params);
    setCurrentPage(1);
  };

  /* ================= FILTER UI ================= */
  const FilterContent = () => (
    <>
      <div className="mb-4">
        <h6 className="fw-bold small mb-2">{t("common.sortBy")}</h6>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold small">{t("common.categories")}</h6>
          <input
            type="checkbox"
            className="form-check-input"
            checked={isMultiSelect}
            onChange={(e) => setIsMultiSelect(e.target.checked)}
          />
        </div>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`btn btn-sm w-100 text-start mb-2 ${
              filterCategories.includes(cat)
                ? "btn-primary"
                : "btn-light"
            }`}
          >
            <div className="d-flex justify-content-between">
              {getCategoryName(cat)}
              {filterCategories.includes(cat) && <IoCheckmark />}
            </div>
          </button>
        ))}
      </div>
    </>
  );

  /* ================= RENDER ================= */
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            {filterCategories.includes("All")
              ? t("common.allFashion")
              : filterCategories.map(getCategoryName).join(", ")}
          </h4>
          <small className="text-muted">
            {filteredProducts.length} items
          </small>
        </div>

        <button
          className="btn btn-outline-dark d-lg-none"
          onClick={() => setShowMobileFilter(true)}
        >
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="row">
        {/* Sidebar */}
        <aside className="col-lg-3 d-none d-lg-block">
          <div className="card p-3 shadow-sm sticky-top" style={{ top: 90 }}>
            <FilterContent />
          </div>
        </aside>

        {/* Mobile Filter */}
        {showMobileFilter && (
          <>
            <div className="offcanvas-backdrop show" />
            <div className="offcanvas offcanvas-start show">
              <div className="offcanvas-header">
                <h5>Filters</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowMobileFilter(false)}
                />
              </div>
              <div className="offcanvas-body">
                <FilterContent />
              </div>
            </div>
          </>
        )}

        {/* Products */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : currentProducts.length ? (
            <>
              <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                {currentProducts.map((p) => (
                  <div className="col" key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                      <button
                        className="page-link"
                        onClick={() => changePage(currentPage - 1)}
                      >
                        <IoChevronBack />
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i} className="page-item">
                        <button
                          className={`page-link ${
                            currentPage === i + 1 && "active"
                          }`}
                          onClick={() => changePage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages && "disabled"
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(currentPage + 1)}
                      >
                        <IoChevronForward />
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <IoSearchOutline size={48} className="text-muted mb-3" />
              <h5>No products found</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
