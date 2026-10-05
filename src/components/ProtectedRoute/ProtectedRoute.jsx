// src/components/ProtectedRoute/ProtectedRoute.jsx

import { Navigate } from "react-router";
import { useUser } from "../../contexts/UserContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
