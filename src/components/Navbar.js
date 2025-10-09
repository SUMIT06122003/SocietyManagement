import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // import auth directly

export default function Navbar({ currentUser, role }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // directly sign out
      navigate("/login");   // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#003366",
    color: "white",
  };

  const btnStyle = {
    padding: "8px 15px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: "bold" }}>
        Universal Society - {role ? role.charAt(0).toUpperCase() + role.slice(1) : ""}
      </div>
      <div>
        <span style={{ marginRight: "20px" }}>
          Welcome, {currentUser?.displayName || currentUser?.email}
        </span>
        <button style={btnStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
