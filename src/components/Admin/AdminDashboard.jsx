import { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const AdminDashboard = () => {
  const { logout } = useContext(UserContext);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <NavLink to="/admin-dashboard/overview">Overview</NavLink>
        <NavLink to="/admin-dashboard/shops">Shops</NavLink>
        <NavLink to="/admin-dashboard/products">Products</NavLink>
        <NavLink to="/admin-dashboard/orders">Orders</NavLink>
        <button onClick={logout}>Log Out</button>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
