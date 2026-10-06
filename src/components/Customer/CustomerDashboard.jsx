import DashboardLayout from "../DashboardLayout/DashboardLayout";

const links = [
  { to: "/customer-dashboard", label: "Dashboard", end: true },
  { to: "/customer-dashboard/products", label: "Products" },
  { to: "/customer-dashboard/favorites", label: "Favorites" },
  { to: "/customer-dashboard/orders", label: "My Orders" },
  { to: "/customer-dashboard/profile", label: "Profile" },
];

const CustomerDashboard = () => <DashboardLayout links={links} showCart />;

export default CustomerDashboard;
