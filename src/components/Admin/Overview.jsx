import { useState, useEffect } from "react";
import adminService from "../../services/adminService";

const Overview = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    adminService
      .listAllShops()
      .then(setShops)
      .catch(() => {});
    adminService
      .listAllProducts()
      .then(setProducts)
      .catch(() => {});
    adminService
      .listAllOrders()
      .then(setOrders)
      .catch(() => {});
  }, []);

  const pendingShops = shops.filter((s) => s.status === "pending").length;

  return (
    <div>
      <h2>Platform Overview</h2>
      <p>
        Total Shops: {shops.length} ({pendingShops} pending approval)
      </p>
      <p>Total Products: {products.length}</p>
      <p>Total Orders: {orders.length}</p>
    </div>
  );
};

export default Overview;
