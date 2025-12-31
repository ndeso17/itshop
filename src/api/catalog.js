import api from "./axios";

export const getProductBySlug = async (slug, language = "en") => {
  const response = await api.get(`/api/catalog/${slug}?language=${language}`);
  return response.data;
};
