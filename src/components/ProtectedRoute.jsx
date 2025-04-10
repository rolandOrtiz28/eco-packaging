// ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ requireAdmin = false, children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  console.log(
    "ProtectedRoute: loading =",
    loading,
    "isAuthenticated =",
    isAuthenticated,
    "isAdmin =",
    isAdmin,
    "requireAdmin =",
    requireAdmin
  );

  // Wait for loading to resolve before making a decision
  if (loading) {
    
    return <div>Loading...</div>;
  }

  // Once loading is false, check authentication and admin status
  if (!isAuthenticated) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
   
    return <Navigate to="/" state={{ from: location }} replace />;
  }

 
  return children;
}

export default ProtectedRoute;