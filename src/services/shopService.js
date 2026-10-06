import api from "./api";

const createShop = (data) =>
  api
    .post("/shops", { name: data.name, description: data.description })
    .then((r) => r.data);
const getMyShop = () => api.get("/shops/mine").then((r) => r.data);
const updateMyShop = (data) =>
  api
    .put("/shops/mine", { name: data.name, description: data.description })
    .then((r) => r.data);
const getMyShopOrders = () => api.get("/shops/mine/orders").then((r) => r.data);
const getMyShopStats = () => api.get("/shops/mine/stats").then((r) => r.data);

export default {
  createShop,
  getMyShop,
  updateMyShop,
  getMyShopOrders,
  getMyShopStats,
};
