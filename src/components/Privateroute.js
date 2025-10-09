import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { currentUser, role: userRole, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!currentUser) return <Navigate to="/" replace />;
  if (role && role !== userRole) return <Navigate to="/" replace />;

  return children;
}
