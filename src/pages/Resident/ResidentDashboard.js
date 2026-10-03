import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import DashboardLayout from "../../components/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const defaultStats = [
  { label: "Maintenance Due", value: "₹0" },
  { label: "Amenities Used", value: "0" },
  { label: "Open Tickets", value: "0" },
  { label: "Society Score", value: "0/5" },
];

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState(defaultStats);
  const [notices, setNotices] = useState([]);
  const [visitorEntries, setVisitorEntries] = useState([]);
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);

  useEffect(() => {
    const loadResidentData = async () => {
      if (!currentUser?.email) return;

      const userEmail = currentUser.email.toLowerCase();

      try {
        const [paymentSnap, complaintSnap, amenitySnap, announcementSnap, visitorSnap, residentSnap] = await Promise.all([
          getDocs(collection(db, "maintenancePayments")),
          getDocs(collection(db, "complaints")),
          getDocs(collection(db, "amenitiesRequests")),
          getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "visitors"), orderBy("timestamp", "desc"))),
          getDoc(doc(db, "users", userEmail)),
        ]);

        const residentFlat = String(residentSnap.data()?.flatNumber || "").trim();

        const residentPayments = paymentSnap.docs.filter((doc) => {
          const data = doc.data();
          const email = (data.userEmail || data.email || "").toLowerCase();
          return email === userEmail;
        });

        const currentMonthKey = getMonthKey(new Date());
        const hasPaidMaintenanceThisMonth = residentPayments.some((doc) => {
          const payment = doc.data();
          const status = (payment.status || "").toLowerCase();
          const paidAt = payment.paidAt && payment.paidAt.toDate ? payment.paidAt.toDate() : null;
          return status === "paid" && paidAt && getMonthKey(paidAt) === currentMonthKey;
        });

        const pendingMaintenance = residentPayments.filter((doc) => {
          const status = (doc.data().status || "").toLowerCase();
          return status !== "paid" && status !== "completed";
        });

        setShowMaintenancePopup(!hasPaidMaintenanceThisMonth && !pendingMaintenance.length && currentUser);

        const residentComplaints = complaintSnap.docs.filter((doc) => {
          const data = doc.data();
          const email = (data.userEmail || data.email || "").toLowerCase();
          return email === userEmail;
        });

        const residentAmenities = amenitySnap.docs.filter((doc) => {
          const data = doc.data();
          const email = (data.userEmail || data.email || "").toLowerCase();
          return email === userEmail;
        });

        const maintenanceDue = pendingMaintenance.length > 0 ? `₹${pendingMaintenance.length * 4000}` : "₹0";

        setStats([
          { label: "Maintenance Due", value: maintenanceDue },
          { label: "Amenities Used", value: String(residentAmenities.length) },
          { label: "Open Tickets", value: String(residentComplaints.length) },
          { label: "Society Score", value: residentComplaints.length === 0 ? "4.8/5" : "4.5/5" },
        ]);

        setNotices(
          announcementSnap.docs.length
            ? announcementSnap.docs.slice(0, 3).map((doc) => ({
                id: doc.id,
                title: doc.data().title || "Society Update",
                detail: doc.data().message || doc.data().detail || "New update from the management.",
              }))
            : []
        );

        setVisitorEntries(
          visitorSnap.docs.map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
            return {
              id: doc.id,
              name: data.name || "Visitor",
              flatNumber: String(data.flatNumber || "").trim(),
              purpose: data.purpose || "Visit",
              mobile: data.mobile || "N/A",
              time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              date: timestamp.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }),
            };
          }).filter((entry) => residentFlat && entry.flatNumber === residentFlat).slice(0, 5)
        );
      } catch (error) {
        console.error("Resident dashboard data failed:", error);
        setStats(defaultStats);
        setNotices([]);
      }
    };

    loadResidentData();
  }, [currentUser]);

  const actions = [
    { label: "Pay Maintenance", icon: "💰", onClick: () => navigate("/resident/pay-maintenance") },
    { label: "Amenities", icon: "🏊", onClick: () => navigate("/resident/amenities") },
    { label: "Clubhouse", icon: "🏠", onClick: () => navigate("/resident/book-clubhouse") },
    { label: "Complaints", icon: "📝", onClick: () => navigate("/resident/complaints") },
    { label: "Notices", icon: "📢", onClick: () => navigate("/resident/notices") },
  ];

  return (
    <div>
      <Navbar />
      <DashboardLayout
        title="Resident Dashboard"
        subtitle="Your home, community, and day-to-day services in one place"
        stats={stats}
        actions={actions}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#003366" }}>Latest Society Notices</h3>
            {notices.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8", color: "#334155" }}>
                {notices.map((notice) => (
                  <li key={notice.id}>{notice.title}: {notice.detail}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#475569" }}>No announcements are available right now.</p>
            )}
          </div>

          <div
            style={{
              background: "#eef6ff",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #dfeeff",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f4c81" }}>Quick Summary</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span>Water Bill</span>
                <strong>{stats[0].value === "₹0" ? "Updated" : "Due"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span>Security</span>
                <strong>Active</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <span>Next Event</span>
                <strong>Check announcements</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            background: "#f0fdf4",
            borderRadius: "18px",
            border: "1px solid #bbf7d0",
            padding: "22px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, color: "#166534" }}>Recent Visitor Entries</h3>
            <span style={{ color: "#166534", fontWeight: 700, fontSize: "13px" }}>{visitorEntries.length} entries</span>
          </div>

          {visitorEntries.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {visitorEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid #bbf7d0",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "grid",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <strong style={{ color: "#14532d", fontSize: "16px" }}>{entry.name}</strong>
                    <span style={{ color: "#374151", fontSize: "12px", fontWeight: 700 }}>{entry.time}</span>
                  </div>
                  <div style={{ color: "#475569" }}>
                    <strong>Flat:</strong> {entry.flatNumber}
                  </div>
                  <div style={{ color: "#475569" }}>
                    <strong>Purpose:</strong> {entry.purpose}
                  </div>
                  <div style={{ color: "#475569" }}>
                    <strong>Mobile:</strong> {entry.mobile}
                  </div>
                  <div style={{ color: "#475569", fontSize: "12px" }}>{entry.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "#166534" }}>No visitor entries have been added yet.</p>
          )}
        </div>
      </DashboardLayout>

      {showMaintenancePopup && (
        <div
          onClick={() => setShowMaintenancePopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "430px",
              background: "white",
              borderRadius: "18px",
              padding: "28px 24px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#b91c1c" }}>Pay Your Maintenance</h3>
              <button
                type="button"
                onClick={() => setShowMaintenancePopup(false)}
                style={{
                  border: "none",
                  background: "#e2e8f0",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                ×
              </button>
            </div>

            <p style={{ margin: "0 0 18px", color: "#475569", lineHeight: 1.6 }}>
              Your maintenance payment for October 2026 is still pending. Please pay your dues to continue using the society services.
            </p>

            <button
              type="button"
              onClick={() => {
                setShowMaintenancePopup(false);
                navigate("/resident/pay-maintenance");
              }}
              style={{
                width: "100%",
                padding: "12px 18px",
                border: "none",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
