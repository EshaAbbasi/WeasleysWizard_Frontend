import { useState, useEffect } from "react";
import customerService from "../../services/customerService";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      customerService
        .getMyOrders()
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
    window.addEventListener("orders:updated", refresh);
    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("orders:updated", refresh);
    };
  }, []);

  return (
    <div>
      <h2>My Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>
            Order #{order.id} — {currency.format(Number(order.total_gbp) || 0)}{" "}
            — {order.status}
          </p>
          <ul>
            {(order.items || []).map((item) => (
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
