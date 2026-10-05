// src/services/customerService.js

import api from "./api";

const listProducts = (category) =>
  api
    .get("/products", { params: category ? { category } : {} })
    .then((r) => r.data);

const toggleFavorite = (productId, isFavorite) =>
  api
    .post("/reviews", { product_id: productId, is_favorite: isFavorite })
    .then((r) => r.data);

const getMyFavorites = () => api.get("/favorites").then((r) => r.data);

const getMyOrders = () => api.get("/orders").then((r) => r.data);

export default { listProducts, toggleFavorite, getMyFavorites, getMyOrders };
