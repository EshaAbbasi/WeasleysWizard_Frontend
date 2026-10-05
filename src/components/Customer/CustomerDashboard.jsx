import { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const CustomerDashboard = () => {
  const { logout } = useContext(UserContext);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <NavLink to="/customer-dashboard/profile">Profile</NavLink>
        <NavLink to="/customer-dashboard/products">Products</NavLink>
        <NavLink to="/customer-dashboard/favorites">Favorites</NavLink>
        <NavLink to="/customer-dashboard/orders">My Orders</NavLink>
        <NavLink to="/customer-dashboard/notifications">Notifications</NavLink>
        <button onClick={logout}>Log Out</button>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerDashboard;
