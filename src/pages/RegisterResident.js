import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Firebase imports
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterResident() {
  const navigate = useNavigate();

  // State for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return alert("All fields are required");

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName
      await updateProfile(userCredential.user, { displayName: name });

      // Save user info in Firestore
      await setDoc(doc(db, "users", email), {
        email,
        name,
        role: "resident",
        createdAt: new Date(),
      });

      alert("Registration successful! Please login.");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/"); // redirect to login
    } catch (err) {
      console.error("Error registering resident:", err);
      if (err.code === "auth/email-already-in-use") {
        alert("Email already exists!");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid email format!");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters!");
      } else {
        alert("Failed to register. Try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "500px", margin: "50px auto", padding: "30px", backgroundColor: "#f9f9f9", borderRadius: "10px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Resident Registration</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: "12px", backgroundColor: "#003366", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
