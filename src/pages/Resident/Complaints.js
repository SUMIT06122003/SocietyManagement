import React, { useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export default function Complaints() {
  const { currentUser } = useContext(AuthContext);
  const [complaint, setComplaint] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return alert("Enter complaint");

    await addDoc(collection(db, "complaints"), {
      user: currentUser.email,
      complaint: complaint,
      timestamp: serverTimestamp(),
      status: "Pending",
    });

    setComplaint("");
    alert("Complaint submitted successfully!");
  };

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Register Complaint</h2>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Enter your complaint here..."
          style={{
            width: "60%",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            height: "120px",
            marginBottom: "20px",
          }}
        />
        <br />
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 30px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );
}
