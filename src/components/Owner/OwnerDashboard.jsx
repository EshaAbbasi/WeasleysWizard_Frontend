import { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const OwnerDashboard = () => {
  const { logout } = useContext(UserContext);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <NavLink to="/owner-dashboard/profile">Profile</NavLink>
        <NavLink to="/owner-dashboard/products">Products</NavLink>
        <NavLink to="/owner-dashboard/orders">Orders</NavLink>
        <NavLink to="/owner-dashboard/sales">Sales Overview</NavLink>
        <button onClick={logout}>Log Out</button>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default OwnerDashboard;
