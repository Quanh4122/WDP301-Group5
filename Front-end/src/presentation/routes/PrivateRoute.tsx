import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../components/redux/Store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/app/not-authetication" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
