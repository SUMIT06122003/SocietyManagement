import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const amenityOptions = [
  { id: "swimming-pool", name: "Swimming Pool", price: 1500, icon: "🏊" },
  { id: "badminton-court", name: "Badminton Court Access", price: 1000, icon: "🏸" },
  { id: "lawn", name: "Lawn", price: 600, icon: "🌿" },
];

export default function Amenities() {
  const navigate = useNavigate();
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const total = useMemo(
    () => selectedAmenities.reduce((sum, item) => sum + item.price, 0),
    [selectedAmenities]
  );

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) => {
      const exists = prev.some((item) => item.id === amenity.id);
      return exists
        ? prev.filter((item) => item.id !== amenity.id)
        : [...prev, amenity];
    });
  };

  const handleProceed = () => {
    navigate("/resident/pay-maintenance", {
      state: { selectedAmenities },
    });
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #edf6ff 100%)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-block", background: "#dfeeff", color: "#0f4c81", padding: "8px 16px", borderRadius: "999px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Resident Services
          </div>
          <h2 style={{ margin: "18px 0 10px", fontSize: "38px", color: "#003366" }}>Book Amenities</h2>
          <p style={{ margin: 0, color: "#4b5563", fontSize: "16px" }}>Choose the services you want to add to your monthly maintenance.</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "22px",
            marginTop: "20px",
          }}
        >
          {amenityOptions.map((item) => {
            const isSelected = selectedAmenities.some((selected) => selected.id === item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleAmenity(item)}
                style={{
                  position: "relative",
                  padding: "28px 22px",
                  borderRadius: "22px",
                  background: isSelected ? "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)" : "rgba(255,255,255,0.8)",
                  border: isSelected ? "2px solid #3b82f6" : "1px solid rgba(148, 163, 184, 0.35)",
                  boxShadow: isSelected ? "0 18px 40px rgba(59, 130, 246, 0.18)" : "0 12px 24px rgba(15, 23, 42, 0.06)",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #4c6ef5, #15aabf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>{item.icon}</div>
                  {isSelected && (
                    <div style={{ background: "#1d4ed8", color: "white", borderRadius: "999px", fontSize: "12px", fontWeight: 700, padding: "6px 12px" }}>Selected</div>
                  )}
                </div>

                <div style={{ fontWeight: 800, fontSize: "22px", color: "#0f172a", marginBottom: "8px" }}>{item.name}</div>
                <div style={{ color: "#334155", fontSize: "16px" }}>₹{item.price} / month</div>
                <div style={{ marginTop: "16px", color: isSelected ? "#1d4ed8" : "#64748b", fontWeight: 600, fontSize: "14px" }}>
                  {isSelected ? "Added to maintenance" : "Tap to add"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "640px", background: "rgba(255,255,255,0.9)", borderRadius: "22px", boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(148,163,184,0.3)", padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "14px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Selected Total</div>
                <div style={{ fontSize: "32px", color: "#003366", fontWeight: 800, marginTop: "6px" }}>₹{total}</div>
              </div>

              <button
                onClick={handleProceed}
                style={{
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 26px",
                  background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor: "pointer",
                  boxShadow: "0 12px 22px rgba(76, 110, 245, 0.28)",
                }}
              >
                Proceed to Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
