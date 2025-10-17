import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/Appcontext";

const ProtectedRoute: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the nested routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;