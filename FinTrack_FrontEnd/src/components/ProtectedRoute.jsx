import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  let location = useLocation();

  if (!token) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
