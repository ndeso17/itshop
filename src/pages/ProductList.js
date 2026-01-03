import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { getProducts } from "../api/products";
import { useTranslation } from "react-i18next";
import { Filter, X } from "lucide-react";
import {
  IoCheckmark,
  IoChevronBack,
  IoChevronForward,
  IoSearchOutline,
} from "react-icons/io5";

const ProductList = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Multi-Category Logic
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filterCategories = useMemo(() => {
    const cats = searchParams.getAll("category");
    return cats.length > 0 ? cats : ["All"];
  }, [searchParams]);

  // Helper to translate categories
  const getCategoryName = (cat) => {
    if (!cat || typeof cat !== "string") return "";
    if (cat === "All") return t("common.allFashion") || "All Fashion";
    return t(`category.${cat.toLowerCase()}`, { defaultValue: cat });
  };

  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const query = searchParams.get("search");
    setSearchQuery(query || "");
  }, [searchParams]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Better number for grid (divisible by 2, 3, 4)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const validData = Array.isArray(data)
          ? data.filter((item) => item && typeof item === "object")
          : [];
        setProducts(validData);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryChange = (category) => {
    const currentCategories = searchParams.getAll("category");
    let newCategories = [];

    if (category === "All") {
      newCategories = [];
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

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    if (newCategories.length > 0) {
      newCategories.forEach((cat) => newParams.append("category", cat));
    }

    if (searchQuery) {
      newParams.set("search", searchQuery);
    }

    setSearchParams(newParams);
    setCurrentPage(1);
  };

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return ["All"];
    const allCats = products.flatMap((p) => {
      if (!p) return [];
      let cats = p.categories || (p.category ? [p.category] : []);
      return cats.map((c) =>
        typeof c === "object" ? c.name || c.category_name || "" : c
      );
    });
    const uniqueCats = [...new Set(allCats)]
      .filter((c) => c && typeof c === "string" && c.trim() !== "")
      .sort();
    return ["All", ...uniqueCats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let result = products.filter((p) => p && typeof p === "object");

    if (!filterCategories.includes("All")) {
      result = result.filter((p) => {
        let rawCats = p.categories || (p.category ? [p.category] : []);
        const productCatNames = rawCats.map((cat) =>
          (typeof cat === "string"
            ? cat
            : cat?.name || cat?.category_name || ""
          ).toLowerCase()
        );
        return productCatNames.some((pc) =>
          filterCategories.some(
            (filter) => filter && filter.toLowerCase() === pc
          )
        );
      });
    }

    if (searchQuery) {
      result = result.filter((p) => {
        const lang = i18n.language;
        let name = p.name
          ? typeof p.name === "string"
            ? p.name
            : p.name[lang] || p.name["en"] || Object.values(p.name)[0] || ""
          : "";
        return String(name).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [filterCategories, sortBy, searchQuery, i18n.language, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterContent = () => (
    <>
      <div className="mb-4">
        <h6
          className="fw-bold text-uppercase mb-3 small"
          style={{ letterSpacing: "1px" }}
        >
          {t("common.sortBy")}
        </h6>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select border-secondary-subtle"
        >
          <option value="newest">
            {t("common.sortNewest") || "Newest Arrivals"}
          </option>
          <option value="price-asc">
            {t("common.sortPriceLowHigh") || "Price: Low to High"}
          </option>
          <option value="price-desc">
            {t("common.sortPriceHighLow") || "Price: High to Low"}
          </option>
        </select>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6
            className="fw-bold text-uppercase mb-0 small"
            style={{ letterSpacing: "1px" }}
          >
            {t("common.categories")}
          </h6>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="multiSelectSwitch"
              checked={isMultiSelect}
              onChange={(e) => setIsMultiSelect(e.target.checked)}
            />
            <label
              className="form-check-label small"
              htmlFor="multiSelectSwitch"
              style={{ fontSize: "12px" }}
            >
              Multi
            </label>
          </div>
        </div>

        <div className="d-flex flex-column gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`btn text-start btn-sm px-3 py-2 rounded-2 transition-all ${
                filterCategories.includes(cat)
                  ? "btn-primary text-white shadow-sm"
                  : "btn-light text-dark bg-transparent hover-bg-light border-0"
              }`}
            >
              <div className="d-flex justify-content-between align-items-center w-100">
                <span>{getCategoryName(cat)}</span>
                {filterCategories.includes(cat) && <IoCheckmark />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="container py-4">
      {/* Header & Mobile Filter Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">
            {filterCategories.length === 1 && filterCategories[0] === "All"
              ? t("common.allFashion") || "All Products"
              : filterCategories.map((c) => getCategoryName(c)).join(", ")}
          </h2>
          <p className="text-secondary small mb-0">
            {filteredProducts.length} {t("common.itemsFound") || "Items Found"}
          </p>
        </div>

        <button
          className="btn btn-outline-dark d-lg-none d-flex align-items-center gap-2"
          onClick={() => setShowMobileFilter(true)}
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      <div className="row">
        {/* Desktop Sidebar */}
        <aside className="col-lg-3 d-none d-lg-block">
          <div className="sticky-top" style={{ top: "100px", zIndex: 10 }}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Offcanvas Filter */}
        <div
          className={`offcanvas offcanvas-start ${
            showMobileFilter ? "show" : ""
          }`}
          tabIndex="-1"
          style={{ visibility: showMobileFilter ? "visible" : "hidden" }}
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title fw-bold">Filters</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowMobileFilter(false)}
            ></button>
          </div>
          <div className="offcanvas-body">
            <FilterContent />
          </div>
        </div>

        {/* Backdrop for mobile */}
        {showMobileFilter && (
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setShowMobileFilter(false)}
          ></div>
        )}

        {/* Product Grid */}
        <div className="col-lg-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="text-danger mb-3">{error}</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4">
                {currentProducts.map((product) => (
                  <div className="col" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-5 d-flex justify-content-center">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link border-0 rounded-start-2 bg-light text-dark mx-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <IoChevronBack />
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                      <li key={i + 1} className="page-item">
                        <button
                          className={`page-link border-0 mx-1 rounded ${
                            currentPage === i + 1
                              ? "bg-primary text-white"
                              : "bg-light text-dark"
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link border-0 rounded-end-2 bg-light text-dark mx-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <IoChevronForward />
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-5 bg-white rounded shadow-sm border">
              <div className="mb-3">
                <IoSearchOutline className="fs-1 text-secondary opacity-50" />
              </div>
              <h5 className="mb-2">No products found</h5>
              <p className="text-secondary mb-4">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                className="btn btn-primary px-4"
                onClick={() => {
                  setSearchQuery("");
                  const newParams = new URLSearchParams();
                  setSearchParams(newParams);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
