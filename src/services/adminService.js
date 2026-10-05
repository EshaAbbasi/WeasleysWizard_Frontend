// src/services/adminService.js

import api from "./api";

const listAllShops = () => api.get("/admin/shops").then((r) => r.data);
const updateShopStatus = (shopId, status) =>
  api.put(`/admin/shops/${shopId}/status`, { status }).then((r) => r.data);
const listAllProducts = () => api.get("/admin/products").then((r) => r.data);
const listAllOrders = () => api.get("/admin/orders").then((r) => r.data);

export default {
  listAllShops,
  updateShopStatus,
  listAllProducts,
  listAllOrders,
};
