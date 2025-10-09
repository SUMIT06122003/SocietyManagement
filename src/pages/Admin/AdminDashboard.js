import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    padding: "30px",
    borderRadius: "10px",
    width: "220px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Admin Dashboard</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          marginTop: "50px",
        }}
      >
        <div style={cardStyle} onClick={() => navigate("/admin/create-watchman")}>
          👤 Create Watchman
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/maintenance-status")}>
          💰 Maintenance Status
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/complaints-view")}>
          📝 Complaints
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/amenities-requests")}>
          🏊 Amenities Requests
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/clubhouse-bookings")}>
          🏠 Clubhouse Bookings
        </div>
        <div style={cardStyle} onClick={() => navigate("/admin/visitors")}>
          🧑‍💼 Visitor Log
        </div>
      </div>
    </div>
  );
}
