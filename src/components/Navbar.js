import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, role, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const showBackButton = !["/", "/register"].includes(location.pathname);

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 28px",
    background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #0ea5e9 100%)",
    color: "white",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
    position: "sticky",
    top: 0,
    zIndex: 20,
    width: "100%",
    boxSizing: "border-box",
  };

  const btnStyle = {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 10px 18px rgba(239,68,68,0.22)",
  };

  const backBtnStyle = {
    padding: "9px 14px",
    background: "rgba(255,255,255,0.14)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "10px",
    cursor: "pointer",
    marginRight: "15px",
    fontWeight: 700,
  };

  const brandStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontWeight: "800",
    letterSpacing: "0.02em",
    minWidth: 0,
    flex: "1 1 240px",
  };

  const rightStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: "1 1 220px",
  };

  return (
    <nav className="top-navbar" style={navStyle}>
      <div style={brandStyle}>
        {showBackButton && (
          <button className="navbar-back" style={backBtnStyle} onClick={() => navigate(-1)} aria-label="Go back" title="Go back">
            <span className="navbar-back-label">← Back</span>
            <span className="navbar-back-icon" aria-hidden="true">←</span>
          </button>
        )}
        <div
          className="navbar-mark"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: "18px",
            flexShrink: 0,
          }}
        >
          🏙️
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="navbar-name" style={{ fontSize: "14px", opacity: 0.8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Universal Society
          </div>
          <div className="navbar-role" style={{ fontSize: "15px" }}>
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Guest"}
          </div>
        </div>
      </div>

      <div style={rightStyle}>
        <span
          className="navbar-welcome"
          style={{
            opacity: 0.95,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          Welcome, {currentUser?.displayName || currentUser?.email || "Resident"}
        </span>
        <button className="navbar-logout" style={btnStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <style>
        {`
          .top-navbar {
            box-sizing: border-box;
          }

          @media (max-width: 640px) {
            .top-navbar {
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              align-items: center !important;
              gap: 8px !important;
              padding: 8px 10px !important;
            }

            .top-navbar > div {
              width: auto !important;
              flex: 0 1 auto !important;
              flex-wrap: nowrap !important;
              gap: 7px !important;
              min-width: 0;
            }

            .top-navbar > div:last-child {
              flex: 1 1 auto !important;
              justify-content: flex-end !important;
            }

            .navbar-mark {
              width: 25px !important;
              height: 25px !important;
              border-radius: 8px !important;
              font-size: 13px !important;
            }

            .navbar-name,
            .navbar-back-label {
              display: none;
            }

            .navbar-role {
              font-size: 12px !important;
              white-space: nowrap;
            }

            .navbar-back-icon {
              display: inline;
            }

            .navbar-back,
            .navbar-logout {
              flex-shrink: 0;
              padding: 6px 8px !important;
              margin: 0 !important;
              border-radius: 8px !important;
              font-size: 12px !important;
              line-height: 1;
            }

            .navbar-welcome {
              min-width: 0;
              flex: 1 1 auto;
              font-size: 11px !important;
              text-align: right;
            }
          }

          @media (min-width: 641px) {
            .navbar-back-icon {
              display: none;
            }
          }
        `}
      </style>
    </nav>
  );
}
