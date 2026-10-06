import api from "./api";

export const PRODUCT_CATEGORIES = [
  "Trunk Station",
  "Wands",
  "Robes & Clothing",
  "Gifts",
  "Home and Accessories",
];

const getCategories = async () => {
  try {
    const data = await api.get("/products/categories").then((r) => r.data);
    return Array.isArray(data) && data.length ? data : PRODUCT_CATEGORIES;
  } catch {
    return PRODUCT_CATEGORIES;
  }
};

const listProducts = (category) =>
  api
    .get("/products", { params: category ? { category } : {} })
    .then((r) => r.data);

const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
const getMyProducts = () => api.get("/products/mine").then((r) => r.data);
const createProduct = (data) => api.post("/products", data).then((r) => r.data);
const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((r) => r.data);
const deleteProduct = (id) => api.delete(`/products/${id}`);

export default {
  getCategories,
  listProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
