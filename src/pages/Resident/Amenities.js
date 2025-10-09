import React, { useContext } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Amenities() {
  const navigate = useNavigate();
  const amenities = ["Swimming Pool", "Badminton Court", "Lawn"];

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Book Amenities</h2>
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
            style={{
              backgroundColor: "#eee",
              padding: "30px",
              width: "200px",
              borderRadius: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (item === "Lawn") alert("Lawn booking not available yet");
              else navigate("/resident/book-clubhouse");
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
