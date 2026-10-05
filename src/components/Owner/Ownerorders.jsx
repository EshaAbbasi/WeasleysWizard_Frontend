import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import orderService from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    shopService
      .getMyShopOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  const handleStatusChange = async (orderId, status) => {
    await orderService.updateOrderStatus(orderId, status);
    loadOrders();
  };

  return (
    <div>
      <h2>Orders Containing My Products ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>
            Order #{order.id} — £{order.total_gbp} — {order.payment_method}
          </p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                Product #{item.product_id} × {item.quantity} (£
                {item.price_at_purchase} each)
              </li>
            ))}
          </ul>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
          >
            {orderService.ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default Orders;
