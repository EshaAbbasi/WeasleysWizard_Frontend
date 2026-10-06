import { useState, useEffect } from "react";
import shopService from "../../services/shopService";
import orderService from "../../services/orderService";
import "./OwnerWorkspace.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const refresh = () => {
      shopService
        .getMyShopOrders()
        .then((data) => {
          if (mounted) {
            setOrders(Array.isArray(data) ? data : data?.items || []);
            setError("");
          }
        })
        .catch(() => {
          if (mounted) setError("Could not load shop orders.");
        })
        .finally(() => {
          if (mounted) setLoading(false);
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
    setError("");
    try {
      await orderService.updateOrderStatus(orderId, status);
      const data = await shopService.getMyShopOrders();
      setOrders(Array.isArray(data) ? data : data?.items || []);
    } catch {
      setError("Could not update this order status.");
    }
  };

  return (
    <div className="owner-page">
      <header className="owner-page-header">
        <div>
          <span className="owner-eyebrow">Fulfillment</span>
          <h1>Orders</h1>
          <p>Orders containing products from your shop.</p>
        </div>
        <span className="owner-count">{orders.length} orders</span>
      </header>

      {error && (
        <p className="owner-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card owner-empty">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="dash-card owner-empty">
          No orders for your products yet.
        </p>
      ) : (
        <div className="owner-order-list">
          {orders.map((order) => (
            <article className="dash-card owner-order-card" key={order.id}>
              <header className="owner-order-heading">
                <div>
                  <span className="owner-eyebrow">Order #{order.id}</span>
                  <h2>
                    {order.customer?.username ||
                      order.customer_name ||
                      "Customer order"}
                  </h2>
                </div>
                <strong>{currency.format(Number(order.total_gbp) || 0)}</strong>
              </header>
              <div className="owner-product-meta">
                {order.payment_method && (
                  <span>Payment: {order.payment_method}</span>
                )}
                {order.created_at && (
                  <span>
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </span>
                )}
              </div>
              <ul className="owner-order-items">
                {(order.items || []).map((item) => (
                  <li key={item.id || `${order.id}-${item.product_id}`}>
                    <strong>
                      {item.product?.name ||
                        item.product_name ||
                        item.name ||
                        `Product #${item.product_id}`}
                    </strong>
                    <span>
                      {item.quantity} ×{" "}
                      {currency.format(Number(item.price_at_purchase) || 0)}
                    </span>
                  </li>
                ))}
              </ul>
              <label className="owner-field">
                Order status
                <select
                  className="owner-order-status"
                  value={order.status || orderService.ORDER_STATUSES[0]}
                  onChange={(event) =>
                    handleStatusChange(order.id, event.target.value)
                  }
                >
                  {orderService.ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
