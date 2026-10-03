import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookClubhouse() {
  const { currentUser } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const minDate = formatLocalDate(new Date());

  const validateBookingDate = (selectedDate) => {
    if (!selectedDate) {
      alert("Select a date");
      return false;
    }

    if (selectedDate < minDate) {
      alert("Please select today or a future date. Past dates are not allowed.");
      return false;
    }

    return true;
  };

  const checkAvailability = async () => {
    if (!validateBookingDate(bookingDate)) return;

    const docRef = doc(db, "clubhouse", bookingDate);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setStatus("Already booked");
    else setStatus("Available");
  };

  const handleBooking = async () => {
    if (!validateBookingDate(bookingDate)) return;
    if (status !== "Available") return alert("Select an available date");

    await setDoc(doc(db, "clubhouse", bookingDate), {
      bookedBy: currentUser.email,
      date: bookingDate,
    });
    setStatus("Booked Successfully!");
    alert("Clubhouse booked successfully!");
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f4f8ff 0%, #edf5ff 100%)", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "42px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#dbeafe",
              color: "#1d4ed8",
              padding: "8px 16px",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Community Facility
          </div>
          <h2 style={{ margin: "18px 0 10px", fontSize: "38px", color: "#003366" }}>Book Clubhouse</h2>
          <p style={{ margin: 0, color: "#475569", fontSize: "16px" }}>
            Choose a valid future date and reserve the clubhouse for your event.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: "24px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
              padding: "32px 28px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#003366", marginBottom: "18px" }}>
              Select Booking Date
            </div>

            <label style={{ display: "block", fontWeight: 700, color: "#334155", marginBottom: "10px" }}>
              Date
            </label>
            <input
              type="date"
              min={minDate}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setStatus("");
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid #cbd5e1",
                fontSize: "16px",
                background: "#f8fafc",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "22px", flexWrap: "wrap" }}>
              <button
                onClick={checkAvailability}
                style={{
                  flex: "1 1 200px",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 800,
                  boxShadow: "0 12px 22px rgba(37, 99, 235, 0.22)",
                }}
              >
                Check Availability
              </button>
              <button
                onClick={handleBooking}
                style={{
                  flex: "1 1 200px",
                  padding: "14px 20px",
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 800,
                  boxShadow: "0 12px 22px rgba(34, 197, 94, 0.2)",
                }}
              >
                Book Now
              </button>
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)",
              border: "1px solid rgba(147, 197, 253, 0.4)",
              borderRadius: "24px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "18px" }}>
              Booking Status
            </div>

            <div
              style={{
                borderRadius: "18px",
                padding: "22px 18px",
                background: status === "Available" ? "#ecfdf5" : status === "Already booked" ? "#fff1f2" : "#f8fafc",
                border: "1px solid",
                borderColor: status === "Available" ? "#a7f3d0" : status === "Already booked" ? "#fecdd3" : "#e2e8f0",
                minHeight: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontSize: "22px",
                fontWeight: 800,
                color: status === "Available" ? "#166534" : status === "Already booked" ? "#be123c" : "#334155",
              }}
            >
              {status || "Select a date to check availability"}
            </div>

            <div style={{ marginTop: "18px", color: "#475569", lineHeight: 1.7 }}>
              <strong style={{ color: "#0f172a" }}>Note:</strong> Only future dates are allowed for booking. Past dates and duplicate reservations are blocked.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
