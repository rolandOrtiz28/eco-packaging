import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function ProtectedRoute({ requireAdmin = false, children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: isAuthenticated =", isAuthenticated, "isAdmin =", isAdmin, "requireAdmin =", requireAdmin);

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log("ProtectedRoute: Not an admin, redirecting to /");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: Rendering children");
  return children; // Render the children prop directly
}

export default ProtectedRoute;