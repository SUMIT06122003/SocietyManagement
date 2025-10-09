import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function BookClubhouse() {
  const { currentUser } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  const checkAvailability = async () => {
    if (!bookingDate) return alert("Select a date");
    const docRef = doc(db, "clubhouse", bookingDate);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setStatus("Already booked");
    else setStatus("Available");
  };

  const handleBooking = async () => {
    if (status !== "Available") return alert("Select an available date");
    await setDoc(doc(db, "clubhouse", bookingDate), {
      bookedBy: currentUser.email,
      date: bookingDate,
    });
    setStatus("Booked Successfully!");
    alert("Clubhouse booked successfully!");
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Book Clubhouse</h2>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          style={{
            padding: "10px",
            margin: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <div>
          <button
            onClick={checkAvailability}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Check Availability
          </button>
          <button
            onClick={handleBooking}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Book
          </button>
        </div>
        {status && <p style={{ marginTop: "20px" }}>{status}</p>}
      </div>
    </div>
  );
}
