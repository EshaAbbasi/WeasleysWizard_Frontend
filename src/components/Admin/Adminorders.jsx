import { useState, useEffect } from "react";
import adminService from "../../services/adminService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminService
      .listAllOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2>All Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id}>
          Order #{order.id} — £{order.total_gbp} — {order.status} —{" "}
          {order.payment_method}
        </div>
      ))}
    </div>
  );
};

export default Orders;
