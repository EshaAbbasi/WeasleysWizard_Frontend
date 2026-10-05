// src/services/productService.js

import api from "./api";

const getCategories = () => api.get("/products/categories").then((r) => r.data);
const getMyProducts = () => api.get("/products/mine").then((r) => r.data);
const createProduct = (data) => api.post("/products", data).then((r) => r.data);
const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((r) => r.data);
const deleteProduct = (id) => api.delete(`/products/${id}`);

export default {
  getCategories,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
