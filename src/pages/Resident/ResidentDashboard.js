import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function ResidentDashboard() {
  const navigate = useNavigate();

  const cardStyle = {
    background: "linear-gradient(135deg, #15aabf, #4c6ef5)",
    color: "white",
    padding: "35px",
    borderRadius: "15px",
    width: "220px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.2s, box-shadow 0.2s",
    fontSize: "18px",
    fontWeight: "600",
  };

  const cardHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
  };

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    marginTop: "50px",
  };

  const headerStyle = {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#003366",
  };

  const cards = [
    { label: "Pay Maintenance", icon: "💰", path: "/resident/pay-maintenance" },
    { label: "Book Amenities", icon: "🏊", path: "/resident/amenities" },
    { label: "Book Clubhouse", icon: "🏠", path: "/resident/book-clubhouse" },
    { label: "Complaint", icon: "📝", path: "/resident/complaints" },
  ];

  return (
    <div>
      <Navbar />
      <h2 style={headerStyle}>Resident Dashboard</h2>
      <div style={containerStyle}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={cardStyle}
            onClick={() => navigate(card.path)}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, {
                transform: "translateY(0)",
                boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
              })
            }
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{card.icon}</div>
            {card.label}
          </div>
        ))}
      </div>
    </div>
  );
}
