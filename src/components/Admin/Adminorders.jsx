import { useState, useEffect } from "react";
import adminService from "../../services/adminService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService
      .listAllOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() =>
        setError(
          "Could not load orders. Check your admin access and try again.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Orders ({orders.length})</h1>
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="dash-card">No orders found.</p>
      ) : (
        <div className="dash-card" style={{ overflowX: "auto" }}>
          <table>
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
                      (order.user_id ? `User #${order.user_id}` : "-")}
                  </td>
                  <td>£{order.total_gbp ?? "-"}</td>
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
