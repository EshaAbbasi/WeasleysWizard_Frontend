import api from "./api";
import productService from "./productService";

const listProducts = (category) => productService.listProducts(category);

const getProductReviews = (productId) =>
  api.get(`/reviews/${productId}`, { cache: "no-store" }).then((r) => r.data);

const createReview = (data) => api.post("/reviews", data).then((r) => r.data);

const updateReview = (reviewId, data) =>
  api.put(`/reviews/${reviewId}`, data).then((r) => r.data);

const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);

const toggleFavorite = (productId, isFavorite) =>
  api
    .post("/reviews", { product_id: productId, is_favorite: isFavorite })
    .then((r) => r.data);

const getMyFavorites = async () => {
  const favorites = await api
    .get("/favorites", { cache: "no-store" })
    .then((r) => r.data);
  const rows = Array.isArray(favorites)
    ? favorites
    : favorites?.items || favorites?.favorites || [];
  const products = await Promise.all(
    rows.map(async (fav) => {
      if (fav.product) return fav;
      const productId = fav.product_id ?? fav.product?.id;
      if (productId == null) return { ...fav, product: null };
      try {
        const product = await productService.getProduct(productId);
        return { ...fav, product };
      } catch {
        return { ...fav, product: null };
      }
    }),
  );
  return products;
};

const getMyOrders = () => api.get("/orders").then((r) => r.data);

const checkout = (payload) => api.post("/orders", payload).then((r) => r.data);

const validateCoupon = (coupon_code) =>
  api.post("/coupons/validate", { coupon_code }).then((r) => r.data);

export default {
  listProducts,
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleFavorite,
  getMyFavorites,
  getMyOrders,
  checkout,
  validateCoupon,
};
