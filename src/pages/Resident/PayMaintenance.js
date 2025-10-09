import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import QRImage from "../../assets/QR.jpg"; // import QR image

export default function PayMaintenance() {
  const [residentName, setResidentName] = useState("");
  const [message, setMessage] = useState("");
  const amount = 4000; // fixed amount

  useEffect(() => {
    if (auth.currentUser) {
      setResidentName(auth.currentUser.displayName || auth.currentUser.email);
    }
  }, []);

  const handlePayment = async () => {
    try {
      await addDoc(collection(db, "maintenancePayments"), {
        userEmail: auth.currentUser.email,
        name: residentName,
        amount: amount,
        paidAt: serverTimestamp(),
        status: "Paid",
      });

      setMessage(`Payment of ₹${amount} successful!`);
    } catch (err) {
      console.error("Payment failed:", err);
      setMessage("Payment failed. Try again.");
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
  };

  const headerStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#003366",
    marginBottom: "30px",
  };

  const qrStyle = {
    width: "250px",
    height: "250px",
    marginBottom: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  };

  const btnStyle = {
    padding: "10px 25px",
    background: "linear-gradient(135deg, #4c6ef5, #15aabf)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",
  };

  const msgStyle = {
    marginTop: "20px",
    fontSize: "16px",
    fontWeight: "600",
    color: message.includes("successful") ? "green" : "red",
  };

  return (
    <div>
      <Navbar currentUser={auth.currentUser} role="resident" />

      <div style={containerStyle}>
        <h2 style={headerStyle}>Pay Maintenance</h2>

        {/* QR Code */}
        <img src={QRImage} alt="Payment QR" style={qrStyle} />

        {/* Fixed Amount */}
        <div style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>
          Amount: ₹{amount}
        </div>

        <button style={btnStyle} onClick={handlePayment}>
          Pay Now
        </button>

        {message && <div style={msgStyle}>{message}</div>}
      </div>
    </div>
  );
}
