// src/services/shopService.js

import api from "./api";

const createShop = (data) => api.post("/shops", data).then((r) => r.data);
const getMyShop = () => api.get("/shops/mine").then((r) => r.data);
const updateMyShop = (data) => api.put("/shops/mine", data).then((r) => r.data);
const getMyShopOrders = () => api.get("/shops/mine/orders").then((r) => r.data);

export default { createShop, getMyShop, updateMyShop, getMyShopOrders };
