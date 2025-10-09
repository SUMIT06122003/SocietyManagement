import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Amenities() {
  const navigate = useNavigate();
  const amenities = ["Swimming Pool", "Badminton Court", "Lawn"];

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    padding: "30px",
    width: "200px",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const handleClick = (item) => {
    if (item === "Lawn") {
      alert("Lawn booking not available yet");
    } else if (item === "Swimming Pool") {
      navigate("/resident/book-swimming-pool");
    } else if (item === "Badminton Court") {
      navigate("/resident/book-badminton-court");
    }
  };

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "30px", color: "#003366" }}>
        Book Amenities
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        {amenities.map((item, idx) => (
          <div
            key={idx}
            style={cardStyle}
            onClick={() => handleClick(item)}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
