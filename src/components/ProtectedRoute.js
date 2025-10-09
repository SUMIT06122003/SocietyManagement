import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roleRequired }) {
  const { currentUser, role } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;

  return children;
}
