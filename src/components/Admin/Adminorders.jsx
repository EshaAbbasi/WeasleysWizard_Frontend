import { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import "./AdminPages.css";

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
    adminService
      .listAllOrders()
      .then((data) => {
        if (mounted) setOrders(Array.isArray(data) ? data : data?.items || []);
      })
      .catch(() => {
        if (mounted) {
          setError(
            "Could not load orders. Check your admin access and try again.",
          );
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
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
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
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
