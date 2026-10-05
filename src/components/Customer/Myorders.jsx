import { useState, useEffect } from "react";
import customerService from "../../services/customerService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    customerService
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2>My Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>
            Order #{order.id} — £{order.total_gbp} — {order.status}
          </p>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                Product #{item.product_id} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
