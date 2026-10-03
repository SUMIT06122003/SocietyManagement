import React, { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import QRImage from "../../assets/QR.jpg";

const monthlyBaseMaintenance = 4000;
const amenityOptions = [
  { id: "swimming-pool", name: "Swimming Pool", price: 1500, icon: "🏊" },
  { id: "badminton-court", name: "Badminton Court Access", price: 1000, icon: "🏸" },
  { id: "lawn", name: "Lawn", price: 600, icon: "🌿" },
];

export default function PayMaintenance() {
  const [residentName, setResidentName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const totalAmount = useMemo(() => {
    const amenitiesTotal = selectedAmenities.reduce((sum, item) => sum + Number(item.price || 0), 0);
    return monthlyBaseMaintenance + amenitiesTotal;
  }, [selectedAmenities]);

  useEffect(() => {
    if (auth.currentUser) {
      setResidentName(auth.currentUser.displayName || auth.currentUser.email);
    }
  }, []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) => {
      const exists = prev.some((item) => item.id === amenity.id);
      return exists
        ? prev.filter((item) => item.id !== amenity.id)
        : [...prev, amenity];
    });
  };

  const handlePayment = async () => {
    try {
      if (!auth.currentUser) {
        setMessage("Please log in to complete payment.");
        return;
      }

      await addDoc(collection(db, "maintenancePayments"), {
        userEmail: auth.currentUser.email,
        name: residentName,
        baseAmount: monthlyBaseMaintenance,
        amenities: selectedAmenities.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price || 0),
        })),
        amount: totalAmount,
        paidAt: serverTimestamp(),
        status: "Paid",
      });

      setMessage(`Payment of ₹${totalAmount} successful!`);
    } catch (err) {
      console.error("Payment failed:", err);
      setMessage("Payment failed. Try again.");
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f5f9ff 0%, #edf5ff 100%)", minHeight: "100vh" }}>
      <Navbar currentUser={auth.currentUser} role="resident" />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "42px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-block", background: "#dfeeff", color: "#0f4c81", padding: "8px 16px", borderRadius: "999px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Monthly Billing
          </div>
          <h2 style={{ margin: "18px 0 10px", fontSize: "38px", color: "#003366" }}>Pay Maintenance</h2>
          <p style={{ margin: 0, color: "#475569" }}>Add amenities, review your total, and complete monthly payment.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "26px", alignItems: "start" }}>
          <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: "24px", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(148,163,184,0.25)", padding: "28px" }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#003366", marginBottom: "18px" }}>Add Amenities</div>

            <div style={{ display: "grid", gap: "12px" }}>
              {amenityOptions.map((amenity) => {
                const isSelected = selectedAmenities.some((item) => item.id === amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "16px 18px",
                      borderRadius: "16px",
                      border: isSelected ? "2px solid #1d4ed8" : "1px solid #dfe7f5",
                      background: isSelected ? "#eff6ff" : "#ffffff",
                      color: "#0f172a",
                      cursor: "pointer",
                      fontWeight: 700,
                      boxShadow: isSelected ? "0 10px 20px rgba(59, 130, 246, 0.12)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #4c6ef5, #15aabf)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{amenity.icon}</div>
                      <span>{amenity.name}</span>
                    </div>
                    <span style={{ color: "#334155" }}>₹{amenity.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: "24px", boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)", border: "1px solid rgba(148,163,184,0.25)", padding: "28px" }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#003366", marginBottom: "18px" }}>Payment Summary</div>

            <div style={{ borderRadius: "18px", background: "#f8fafc", padding: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#475569" }}>Base Maintenance</span>
                <strong>₹{monthlyBaseMaintenance}</strong>
              </div>

              {selectedAmenities.length > 0 ? (
                selectedAmenities.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#475569" }}>{item.name}</span>
                    <strong>₹{item.price}</strong>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b", marginTop: "8px" }}>No extra amenities selected.</div>
              )}

              <div style={{ borderTop: "1px solid #dbeafe", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div style={{ marginTop: "26px", display: "flex", justifyContent: "center" }}>
              <img src={QRImage} alt="Payment QR" style={{ width: "240px", height: "240px", borderRadius: "20px", boxShadow: "0 14px 25px rgba(15, 23, 42, 0.12)", border: "1px solid #dfe7f5" }} />
            </div>

            <button
              type="button"
              onClick={handlePayment}
              style={{
                width: "100%",
                marginTop: "26px",
                padding: "16px 20px",
                background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
                color: "white",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                fontWeight: 800,
                fontSize: "17px",
                boxShadow: "0 12px 22px rgba(76, 110, 245, 0.25)",
              }}
            >
              Pay Now
            </button>

            {message && (
              <div
                style={{
                  marginTop: "18px",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: message.includes("successful") ? "green" : "red",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
