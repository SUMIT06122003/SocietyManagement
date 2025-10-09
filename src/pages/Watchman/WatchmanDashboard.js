import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function WatchmanDashboard() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    if (!name || !mobile || !purpose) return alert("All fields are required");

    await addDoc(collection(db, "visitors"), {
      name,
      mobile,
      purpose,
      timestamp: serverTimestamp(),
    });

    alert("Visitor added successfully!");
    setName("");
    setMobile("");
    setPurpose("");
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: "500px",
          margin: "50px auto",
          padding: "30px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#003366" }}>
          Watchman Dashboard
        </h2>

        <form onSubmit={handleAddVisitor}>
          <input
            type="text"
            placeholder="Visitor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#33691e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Visitor
          </button>
        </form>
      </div>
    </div>
  );
}
