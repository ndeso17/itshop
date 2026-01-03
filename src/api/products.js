import api from "./axios.js";

const transformProductData = (apiProduct) => {
  const API_BASE = "http://localhost:3000";

  const formatUrl = (url) => {
    if (!url) return "";
    const cleanUrl = url.trim();
    if (/^https?:\/\//i.test(cleanUrl)) {
      return cleanUrl;
    }
    // Only prepend API_BASE if it's a relative path
    return `${API_BASE}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
  };

  // Determine if product is "new" (created within last 30 days)
  const isNew =
    new Date(apiProduct.created_at) >
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Process Media: Sort by position and format URLs
  let sortedMedia = [];
  if (apiProduct.Media && Array.isArray(apiProduct.Media)) {
    sortedMedia = [...apiProduct.Media].sort(
      (a, b) => (a.position || 0) - (b.position || 0)
    );
  }

  // Generate safe image arrays and provide fallback to apiProduct.image
  const mediaUrls = sortedMedia
    .map((m) => formatUrl(m.media_url))
    .filter((url) => url !== "");

  const fallbackImage = apiProduct.image ? formatUrl(apiProduct.image) : "";
  const imagesArray =
    mediaUrls.length > 0 ? mediaUrls : fallbackImage ? [fallbackImage] : [];
  const mainImage = imagesArray.length > 0 ? imagesArray[0] : "";

  // Price extraction
  const price =
    apiProduct.Variants && apiProduct.Variants.length > 0
      ? parseFloat(apiProduct.Variants[0].price)
      : 0;

  const categoriesList =
    apiProduct.CategoriesM2M || apiProduct.Categories || [];

  const categoryNames = categoriesList.map((c) => {
    if (typeof c === "string") return c;
    return c.category_name || c.name || "General";
  });

  const primaryCategory =
    apiProduct.Category?.category_name ||
    (categoryNames.length > 0 ? categoryNames[0] : "Uncategorized");

  return {
    id: apiProduct.id,
    name: { en: apiProduct.product_name, id: apiProduct.product_name },
    slug: apiProduct.slug,
    description: apiProduct.description,
    category: primaryCategory,
    categories: categoryNames,
    brand: apiProduct.Brand?.brand_name,
    image: mainImage,
    images: mediaUrls,
    Media: sortedMedia,
    price: price,
    isNew: isNew,
    variants: apiProduct.Variants || [],
  };
};

export const getProducts = async () => {
  try {
    const response = await api.get("/api/product/");
    if (
      response.data &&
      response.data.statusCode === 200 &&
      response.data.data
    ) {
      const payload = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      return payload.map(transformProductData);
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
    if (
      response.data &&
      response.data.statusCode === 200 &&
      response.data.data
    ) {
      const payload = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];
      return payload.map(transformProductData);
    }
    return [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/product/${slug}`);
    if (response.data && response.data.statusCode === 200) {
      // API returns a single object in data for detail view
      return transformProductData(response.data.data);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }
};
