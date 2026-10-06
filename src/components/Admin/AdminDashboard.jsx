import DashboardLayout from "../DashboardLayout/DashboardLayout";

const links = [
  { to: "/admin-dashboard", label: "Overview", end: true },
  { to: "/admin-dashboard/shops", label: "Shops" },
  { to: "/admin-dashboard/products", label: "Products" },
  { to: "/admin-dashboard/orders", label: "Orders" },
  { to: "/admin-dashboard/reviews", label: "Reviews" },
];

const AdminDashboard = () => <DashboardLayout links={links} />;

export default AdminDashboard;
