import { Outlet, Navigate } from "react-router-dom";
import { getSession } from "../services/authService";

function PrivateRoute() {
  const { token, user } = getSession();
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
};

export default PrivateRoute
