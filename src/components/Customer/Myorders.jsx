import { useState, useEffect } from "react";
import customerService from "../../services/customerService";
import "./Myorders.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});
const getOrderDate = (order) =>
  order.created_at ||
  order.createdAt ||
  order.created_on ||
  order.order_date ||
  order.ordered_at ||
  order.date;
const getStatusClass = (status = "") => {
  const value = String(status).toLowerCase();
  if (value.includes("deliver")) return "delivered";
  if (value.includes("transit") || value.includes("ship")) return "transit";
  return "processing";
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      customerService
        .getMyOrders()
        .then((data) => {
          if (mounted) {
            setOrders(Array.isArray(data) ? data : data?.items || []);
            setError("");
          }
        })
        .catch(() => {
          if (mounted) setError("Could not load your orders.");
        })
        .finally(() => {
          if (mounted) setLoading(false);
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
    <div className="my-orders">
      <header className="dash-card orders-header">
        <span className="orders-eyebrow">Customer account</span>
        <h1>My Orders</h1>
        <p>
          {orders.length} {orders.length === 1 ? "order" : "orders"} in your
          history
        </p>
      </header>

      {error && (
        <p className="cp-error" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="dash-card orders-state">Loading your orders...</p>
      )}
      {!loading && !error && orders.length === 0 && (
        <p className="dash-card orders-state">No orders yet.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const dateValue = getOrderDate(order);
          const date = dateValue ? new Date(dateValue) : null;
          const validDate = date && !Number.isNaN(date.getTime());
          return (
            <article className="dash-card orders-card" key={order.id}>
              <header className="orders-card-head">
                <div>
                  <span className="orders-eyebrow">Order reference</span>
                  <h2>#{order.id}</h2>
                </div>
                <span
                  className={`orders-status ${getStatusClass(order.status)}`}
                >
                  {order.status || "Processing"}
                </span>
              </header>

              <div className="orders-summary">
                <span>
                  {validDate
                    ? date.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date not provided"}
                </span>
                {order.payment_method && (
                  <span>Payment: {order.payment_method}</span>
                )}
                <strong>{currency.format(Number(order.total_gbp) || 0)}</strong>
              </div>

              <ul className="orders-items">
                {(order.items || []).map((item) => (
                  <li key={item.id || `${order.id}-${item.product_id}`}>
                    <span>
                      {item.product?.name ||
                        item.product_name ||
                        item.name ||
                        `Product #${item.product_id}`}
                    </span>
                    <span>Qty {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
