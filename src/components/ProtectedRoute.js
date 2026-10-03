import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, roleRequired }) {
  const { currentUser, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#003366",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/" replace />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" replace />;

  return children;
}
