import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import "./AdminPages.css";

const currency = new Intl.NumberFormat("en-BH", {
  style: "currency",
  currency: "BHD",
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      adminService.listAllOrders(),
      adminService.listAllReviews(),
    ]).then(([ordersResult, reviewsResult]) => {
      if (!mounted) return;
      if (ordersResult.status === "fulfilled") {
        const data = ordersResult.value;
        setOrders(Array.isArray(data) ? data : data?.items || []);
      } else {
        setError(
          "Could not load orders. Check your admin access and try again.",
        );
      }
      if (reviewsResult.status === "fulfilled") {
        const data = reviewsResult.value;
        const reviews = Array.isArray(data) ? data : data?.items || [];
        const names = {};
        reviews.forEach((review) => {
          const userId = review.user_id ?? review.customer_id;
          const username =
            review.username ||
            review.user_name ||
            review.user?.username ||
            review.user?.name ||
            review.author?.username ||
            review.customer?.username;
          if (userId != null && username) names[String(userId)] = username;
        });
        setCustomerNames(names);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">Platform management</span>
          <h1>Orders</h1>
        </div>
        <span className="admin-count">{orders.length} orders</span>
      </header>
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="dash-card admin-state">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="dash-card admin-state">No orders found.</p>
      ) : (
        <div className="dash-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    {order.username ||
                      order.customer_name ||
                      order.customer?.username ||
                      order.customer?.name ||
                      order.user?.username ||
                      order.user?.name ||
                      customerNames[String(order.user_id)] ||
                      "Customer name unavailable"}
                  </td>
                  <td>{currency.format(Number(order.total_gbp) || 0)}</td>
                  <td>{order.status || "-"}</td>
                  <td>{order.payment_method || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
