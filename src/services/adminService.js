import api from "./api";

const listAllShops = () => api.get("/admin/shops").then((r) => r.data);
const updateShopAuthorization = (shopId, isAuthorized) =>
  api
    .put(`/admin/shops/${shopId}/authorize`, { is_authorized: isAuthorized })
    .then((r) => r.data);
const listAllProducts = () => api.get("/admin/products").then((r) => r.data);
const listAllOrders = () => api.get("/admin/orders").then((r) => r.data);
const listAllReviews = () => api.get("/admin/reviews").then((r) => r.data);
const listProductReviews = (productId) =>
  api.get(`/reviews/${productId}`).then((r) => r.data);
const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`);
const deleteProduct = (id) => api.delete(`/products/${id}`);

export default {
  listAllShops,
  updateShopAuthorization,
  listAllProducts,
  listAllOrders,
  listAllReviews,
  listProductReviews,
  deleteReview,
  deleteProduct,
};
