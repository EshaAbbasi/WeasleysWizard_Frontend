import { useContext } from "react";
import { Route, Routes } from "react-router";

// Components
import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Dashboard from "./components/Dashboard/Dashboard";
import Landing from "./components/Landing/Landing";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import OwnerDashboard from "./components/Owner/OwnerDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";

// Context
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const { user } = useContext(UserContext);
  const role = user?.role?.toLowerCase();
  const home = !user ? (
    <Landing />
  ) : role === "admin" ? (
    <AdminDashboard />
  ) : role === "owner" ? (
    <OwnerDashboard />
  ) : role === "user" || role === "customer" ? (
    <CustomerDashboard />
  ) : (
    <Dashboard />
  );

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={home} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
