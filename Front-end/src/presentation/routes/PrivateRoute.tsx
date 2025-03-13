import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../components/redux/Store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "Admin" | "User" | "Driver"; // Cập nhật để khớp với role trong Redux slice
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth) as {
    isLoggedIn: boolean;
    user: {
      role: string;
    } | null;
  };

  if (!isLoggedIn) {
    return <Navigate to="/app/not-authetication" replace />;
  }

  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;