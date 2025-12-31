import api from "./axios.js";

// Helper to transform API data to UI component expected format
const transformProductData = (apiProduct) => {
  // Determine if product is "new" (e.g., created within last 30 days)
  const isNew =
    new Date(apiProduct.created_at) >
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const image =
    apiProduct.Media && apiProduct.Media.length > 0
      ? apiProduct.Media[0].media_url
      : "";
  const price =
    apiProduct.Variants && apiProduct.Variants.length > 0
      ? parseFloat(apiProduct.Variants[0].price)
      : 0;

  // Handle both CategoriesM2M (previous) and Categories (featured)
  const categoriesList =
    (apiProduct.CategoriesM2M || apiProduct.Categories || []).filter(
      (c) => c && c.category_name
    );
  const categoryNames = categoriesList.map((c) => c.category_name);

  return {
    id: apiProduct.id,
    name: {
      en: apiProduct.product_name || "",
      id: apiProduct.product_name || "",
    },
    slug: apiProduct.slug || "",
    description: apiProduct.description || "",
    category:
      apiProduct.Category?.category_name ||
      categoryNames[0] ||
      "Uncategorized",
    categories: categoryNames,
    brand: apiProduct.Brand?.brand_name || "Generic",
    image: image,
    images: apiProduct.Media?.map((m) => m.media_url) || [],
    price: price,
    isNew: isNew,
    variants: apiProduct.Variants || [],
  };
};

export const getProducts = async () => {
  try {
    const response = await api.get("/api/product");
    if (response.data && response.data.statusCode === 200) {
      return response.data.data.map(transformProductData);
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get("/api/product/featured");
    if (response.data && response.data.statusCode === 200) {
      return response.data.data.map(transformProductData);
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return []; // Return empty array on error to avoid crashing UI
  }
};
