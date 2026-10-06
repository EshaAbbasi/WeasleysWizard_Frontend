import { useState, useEffect, useRef } from "react";
import customerService from "../../services/customerService";
import productService from "../../services/productService";
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
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productCache = useRef(new Map());

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

  useEffect(() => {
    let mounted = true;
    const productIds = [
      ...new Set(
        orders.flatMap((order) =>
          (order.items || [])
            .filter(
              (item) => !item.product?.name && !item.product_name && !item.name,
            )
            .map((item) => item.product_id)
            .filter(
              (id) => id != null && !productCache.current.has(String(id)),
            ),
        ),
      ),
    ];
    if (!productIds.length) return undefined;

    Promise.allSettled(
      productIds.map((id) => productService.getProduct(id)),
    ).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          productCache.current.set(String(productIds[index]), result.value);
        }
      });
      if (mounted) setProducts(Object.fromEntries(productCache.current));
    });

    return () => {
      mounted = false;
    };
  }, [orders]);

  const numberedOrders = [...orders].sort((left, right) => {
    const leftDate = new Date(getOrderDate(left) || "").getTime();
    const rightDate = new Date(getOrderDate(right) || "").getTime();
    if (!Number.isNaN(leftDate) && !Number.isNaN(rightDate)) {
      return leftDate - rightDate || Number(left.id) - Number(right.id);
    }
    return Number(left.id) - Number(right.id);
  });

  return (
    <div className="my-orders">
      <header className="dash-card orders-header">
        <span className="orders-eyebrow">Customer account</span>
        <h1>My Orders</h1>
        <p>
          {numberedOrders.length}{" "}
          {numberedOrders.length === 1 ? "order" : "orders"} in your history
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
        {numberedOrders.map((order, index) => {
          const dateValue = getOrderDate(order);
          const date = dateValue ? new Date(dateValue) : null;
          const validDate = date && !Number.isNaN(date.getTime());
          return (
            <article className="dash-card orders-card" key={order.id}>
              <header className="orders-card-head">
                <div>
                  <span className="orders-eyebrow">Your order</span>
                  <h2>Order {index + 1}</h2>
                </div>
                <span
                  className={`orders-status ${getStatusClass(order.status)}`}
                >
                  {order.status || "Processing"}
                </span>
              </header>

              <div className="orders-summary">
                {validDate && (
                  <time dateTime={date.toISOString()}>
                    {date.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                )}
                {order.payment_method && (
                  <span>Payment: {order.payment_method}</span>
                )}
                <strong>{currency.format(Number(order.total_gbp) || 0)}</strong>
              </div>

              <ul className="orders-items">
                {(order.items || []).map((item) => {
                  const product =
                    item.product || products[String(item.product_id)] || {};
                  const productName =
                    product.name ||
                    item.product_name ||
                    item.name ||
                    "Ordered product";
                  return (
                    <li key={item.id || `${order.id}-${item.product_id}`}>
                      <strong>{productName}</strong>
                      <span>Qty {item.quantity}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
