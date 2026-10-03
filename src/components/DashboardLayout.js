import React from "react";

export default function DashboardLayout({ title, subtitle, stats = [], actions = [], children }) {
  const cardStyle = {
    background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
    color: "white",
    padding: "22px 18px",
    borderRadius: "18px",
    minWidth: "180px",
    flex: "1 1 180px",
    boxShadow: "0 18px 35px rgba(29, 78, 216, 0.18)",
    border: "1px solid rgba(255,255,255,0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const actionStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(239,246,255,0.92))",
    padding: "18px 20px",
    borderRadius: "16px",
    border: "1px solid rgba(147, 197, 253, 0.5)",
    textAlign: "center",
    color: "#0f172a",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(15, 23, 42, 0.04)",
    transition: "all 0.25s ease",
  };

  return (
    <div style={{ padding: "30px 24px 60px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="dashboard-header"
          style={{
            marginBottom: "28px",
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(147, 197, 253, 0.3)",
            borderRadius: "22px",
            padding: "24px 28px",
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.04)",
          }}
        >
          <div
            className="dashboard-eyebrow"
            style={{
              display: "inline-block",
              background: "#dbeafe",
              color: "#1d4ed8",
              padding: "7px 14px",
              borderRadius: "999px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "11px",
            }}
          >
            Society Overview
          </div>
          <h2 className="dashboard-title" style={{ margin: "16px 0 8px", color: "#0f172a", fontSize: "32px" }}>{title}</h2>
          <p className="dashboard-subtitle" style={{ margin: 0, color: "#475569", fontSize: "15px" }}>{subtitle}</p>
        </div>

        {stats.length > 0 && (
          <div
            className="dashboard-stats"
            style={{
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            {stats.map((stat, index) => (
              <div className="dashboard-stat-card" key={index} style={cardStyle}>
                <div className="dashboard-stat-label" style={{ fontSize: "14px", opacity: 0.9, letterSpacing: "0.04em" }}>{stat.label}</div>
                <div className="dashboard-stat-value" style={{ fontSize: "30px", fontWeight: "800", marginTop: "10px" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {actions.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "30px",
            }}
          >
            {actions.map((action, index) => (
              <div
                key={index}
                style={actionStyle}
                onClick={action.onClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 14px 24px rgba(59,130,246,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 18px rgba(15, 23, 42, 0.04)";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{action.icon}</div>
                <div>{action.label}</div>
              </div>
            ))}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
