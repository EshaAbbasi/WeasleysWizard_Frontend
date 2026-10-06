import api from "./api";

const ORDER_STATUSES = [
  "Owl Post Received",
  "In Transit via Floo Network",
  "Delivered",
];

const updateOrderStatus = (orderId, status) =>
  api.put(`/orders/${orderId}/status`, { status }).then((r) => r.data);

const checkout = (payload) => api.post("/orders", payload).then((r) => r.data);

export default { updateOrderStatus, ORDER_STATUSES, checkout };
