import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ResidentDashboard() {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    padding: "30px",
    borderRadius: "10px",
    width: "220px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Navbar />

      <h2
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#003366",
        }}
      >
        Resident Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          marginTop: "50px",
        }}
      >
        {/* Pay Maintenance */}
        <div
          style={cardStyle}
          onClick={() => handleNavigate("/resident/pay-maintenance")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          💰 Pay Maintenance
        </div>

        {/* Book Amenities */}
        <div
          style={cardStyle}
          onClick={() => handleNavigate("/resident/amenities")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🏊 Book Amenities
        </div>

        {/* Book Clubhouse */}
        <div
          style={cardStyle}
          onClick={() => handleNavigate("/resident/book-clubhouse")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🏠 Book Clubhouse
        </div>

        {/* Complaint */}
        <div
          style={cardStyle}
          onClick={() => handleNavigate("/resident/complaints")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          📝 Complaint
        </div>
      </div>
    </div>
  );
}
