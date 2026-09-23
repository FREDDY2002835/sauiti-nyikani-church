import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "./auth";
import AdminPwaSetup from "./AdminPwaSetup";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <>
      <AdminPwaSetup />
      {children}
    </>
  );
};

export default ProtectedRoute;
