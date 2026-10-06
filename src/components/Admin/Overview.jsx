import { useState, useEffect } from "react";
import { Link } from "react-router";
import adminService from "../../services/adminService";

const Overview = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminService.listAllShops(),
      adminService.listAllProducts(),
      adminService.listAllOrders(),
    ])
      .then(([shopList, productList, orderList]) => {
        setShops(Array.isArray(shopList) ? shopList : []);
        setProducts(Array.isArray(productList) ? productList : []);
        setOrders(Array.isArray(orderList) ? orderList : []);
      })
      .catch(() => setError("Could not load the admin overview."));
  }, []);

  const pendingShops = shops.filter(
    (shop) => shop.is_authorized === false || shop.status === "pending",
  ).length;

  return (
    <div>
      <h1>Admin Overview</h1>
      {error && <p role="alert">{error}</p>}
      <div className="ov-stats">
        <Link className="dash-card ov-stat" to="/admin-dashboard/shops">
          <span className="ov-stat-label">Shops</span>
          <strong>{shops.length}</strong>
          <span className="ov-stat-note">{pendingShops} awaiting approval</span>
        </Link>
        <Link className="dash-card ov-stat" to="/admin-dashboard/products">
          <span className="ov-stat-label">Products</span>
          <strong>{products.length}</strong>
          <span className="ov-stat-note">Across all shops</span>
        </Link>
        <Link className="dash-card ov-stat" to="/admin-dashboard/orders">
          <span className="ov-stat-label">Orders</span>
          <strong>{orders.length}</strong>
          <span className="ov-stat-note">Platform-wide</span>
        </Link>
      </div>
      <section className="dash-card" style={{ marginTop: 20 }}>
        <h2>Platform management</h2>
        <p>
          Review shop owners, manage products, and monitor customer orders and
          reviews.
        </p>
        <p>
          <Link to="/admin-dashboard/shops">Manage shops</Link>
          {" | "}
          <Link to="/admin-dashboard/products">Manage products</Link>
          {" | "}
          <Link to="/admin-dashboard/reviews">View reviews</Link>
        </p>
      </section>
    </div>
  );
};

export default Overview;
