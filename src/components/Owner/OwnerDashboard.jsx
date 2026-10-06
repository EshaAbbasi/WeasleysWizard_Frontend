import DashboardLayout from "../DashboardLayout/DashboardLayout";

const links = [
  { to: "/owner-dashboard", label: "Dashboard", end: true },
  { to: "/owner-dashboard/products", label: "Products" },
  { to: "/owner-dashboard/orders", label: "Orders" },
  { to: "/owner-dashboard/sales", label: "Sales Overview" },
  { to: "/owner-dashboard/profile", label: "Profile" },
];

const OwnerDashboard = () => <DashboardLayout links={links} />;

export default OwnerDashboard;
