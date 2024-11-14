import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication state
  const token = sessionStorage.getItem("user_token");

  useEffect(() => {
    // Check for token presence in sessionStorage
    if (!token) {
      setIsAuthenticated(false); // No token, set as unauthenticated
    } else {
      setIsAuthenticated(true); // Token present, set as authenticated
    }
  }, [token]);

  if (isAuthenticated === false) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated === true) {
    if (token === "candidate" && pathname !== "/candidate") {
      return <Navigate to="/candidate" replace />;
    }
    if (token === "recruiter" && pathname !== "/recruiter") {
      return <Navigate to="/recruiter" replace />;
    }
  }

  // If user should go through onboarding (assuming no token is set)
  if (!token) {
    return <Navigate to="/onboarding" replace />;
  }

  return children; // Render protected children if authenticated
};

export default ProtectedRoute;
