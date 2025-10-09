import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import RegisterResident from "./pages/RegisterResident";

import { residentRoutes, watchmanRoutes, adminRoutes } from "./roleRoutes";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterResident />} />

        {/* Resident */}
        {residentRoutes.map((r, i) => (
          <Route
            key={i}
            path={r.path}
            element={<ProtectedRoute roleRequired="resident">{r.element}</ProtectedRoute>}
          />
        ))}

        {/* Watchman */}
        {watchmanRoutes.map((r, i) => (
          <Route
            key={i}
            path={r.path}
            element={<ProtectedRoute roleRequired="watchman">{r.element}</ProtectedRoute>}
          />
        ))}

        {/* Admin */}
        {adminRoutes.map((r, i) => (
          <Route
            key={i}
            path={r.path}
            element={<ProtectedRoute roleRequired="admin">{r.element}</ProtectedRoute>}
          />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
