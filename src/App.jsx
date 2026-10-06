import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import OwnerDashboard from "./components/Owner/OwnerDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CustomerOverview from "./components/Customer/CustomerOverview"; // NEW
import CustomerProfile from "./components/Customer/Customerprofile";
import CustomerProducts from "./components/Customer/Customerproducts";
import CustomerProductDetail from "./components/Customer/CustomerProductDetail";
import Favorites from "./components/Customer/Favorites";
import MyOrders from "./components/Customer/Myorders";
import OwnerProfile from "./components/Owner/Ownerprofile";
import OwnerProducts from "./components/Owner/Ownerproducts";
import OwnerOrders from "./components/Owner/Ownerorders";
import SalesOverview from "./components/Owner/Salesoverview";
import Overview from "./components/Admin/Overview";
import AdminShops from "./components/Admin/Adminshops";
import AdminProducts from "./components/Admin/Adminproducts";
import AdminOrders from "./components/Admin/Adminorders";
import AdminReviews from "./components/Admin/Adminreviews";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  const role = user?.role?.toLowerCase();
  const home = !user ? (
    <Landing />
  ) : role === "admin" ? (
    <Navigate to="/admin-dashboard" replace />
  ) : role === "owner" ? (
    <Navigate to="/owner-dashboard" replace />
  ) : role === "user" || role === "customer" ? (
    <Navigate to="/customer-dashboard" replace />
  ) : (
    <Dashboard />
  );

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={home} />
        <Route path="/home" element={<Landing />} />{" "}
        {/* NEW: landing for everyone */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
        <Route path="/customer-dashboard" element={<CustomerDashboard />}>
          <Route index element={<CustomerOverview />} /> {/* CHANGED */}
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="products" element={<CustomerProducts />} />
          <Route
            path="products/:productId"
            element={<CustomerProductDetail />}
          />
          <Route path="favorites" element={<Favorites />} />
          <Route path="orders" element={<MyOrders />} />
        </Route>
        <Route path="/owner-dashboard" element={<OwnerDashboard />}>
          <Route index element={<OwnerProfile />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="products" element={<OwnerProducts />} />
          <Route path="orders" element={<OwnerOrders />} />
          <Route path="sales" element={<SalesOverview />} />
        </Route>
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
