import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import orderService from "../../services/orderService";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      shopService
        .getMyShopOrders()
        .then((data) => {
          if (mounted)
            setOrders(Array.isArray(data) ? data : data?.items || []);
        })
        .catch(() => {
          if (mounted) setOrders([]);
        });
    };
    refresh();
    const interval = window.setInterval(refresh, 30000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleStatusChange = async (orderId, status) => {
    await orderService.updateOrderStatus(orderId, status);
    shopService
      .getMyShopOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setOrders([]));
  };

  return (
    <div>
      <h2>Orders Containing My Products ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>
            Order #{order.id} — {currency.format(Number(order.total_gbp) || 0)}{" "}
            — {order.payment_method}
          </p>
          <ul>
            {(order.items || []).map((item) => (
              <li key={item.id}>
                Product #{item.product_id} × {item.quantity} (
                {currency.format(Number(item.price_at_purchase) || 0)} each)
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
