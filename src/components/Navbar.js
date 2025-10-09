import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase"; // import auth directly

export default function Navbar({ currentUser, role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // directly sign out
      navigate("/login");   // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Show back button only if not on login/home page
  const showBackButton = !["/", "/login", "/register"].includes(location.pathname);

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

  const backBtnStyle = {
    padding: "8px 15px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "15px",
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
        {showBackButton && (
          <button style={backBtnStyle} onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
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
