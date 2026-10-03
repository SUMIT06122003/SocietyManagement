import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import DashboardLayout from "../../components/DashboardLayout";
import { db } from "../../firebase";

const defaultStats = [
  { label: "Residents", value: "0" },
  { label: "Open Complaints", value: "0" },
  { label: "Pending Maintenance", value: "0" },
  { label: "Visitors Today", value: "0" },
];

export const buildRoomGrid = () => {
  const totalFloors = 10;
  const roomsPerFloor = 4;

  return Array.from({ length: totalFloors }, (_, floorIndex) => {
    const floorNumber = floorIndex + 1;

    return {
      floor: floorNumber,
      rooms: Array.from({ length: roomsPerFloor }, (_, roomIndex) => {
        return floorNumber * 100 + roomIndex + 1;
      }),
    };
  });
};

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(defaultStats);
  const [notices, setNotices] = useState([]);
  const [residentMap, setResidentMap] = useState({});
  const [watchmen, setWatchmen] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dueRooms, setDueRooms] = useState({});

  const roomGrid = useMemo(() => buildRoomGrid(), []);
  const selectedResident = selectedRoom ? residentMap[String(selectedRoom)] || null : null;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [userSnap, complaintSnap, paymentSnap, visitorSnap, announcementSnap] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "complaints")),
          getDocs(collection(db, "maintenancePayments")),
          getDocs(collection(db, "visitors")),
          getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc"))),
        ]);

        const residentMapData = {};
        const watchmanList = [];

        userSnap.docs.forEach((doc) => {
          const data = doc.data();
          const flatNumber = String(data.flatNumber || "").trim();

          if (data.role === "resident" && flatNumber) {
            residentMapData[flatNumber] = {
              id: doc.id,
              name: data.name || "Resident",
              email: data.email || doc.id,
              flatNumber,
              role: data.role || "resident",
              createdAt: data.createdAt || null,
            };
          }

          if (data.role === "watchman") {
            watchmanList.push({
              id: doc.id,
              name: data.name || "Watchman",
              email: data.email || doc.id,
              role: data.role || "watchman",
              createdAt: data.createdAt || null,
            });
          }
        });

        const currentMonthKey = getMonthKey(new Date());
        const pendingRoomMap = {};

        userSnap.docs.forEach((doc) => {
          const data = doc.data();
          const flatNumber = String(data.flatNumber || "").trim();

          if (data.role !== "resident" || !flatNumber) return;

          const residentEmail = String(data.email || "").toLowerCase();
          const hasPaidCurrentMonth = paymentSnap.docs.some((paymentDoc) => {
            const payment = paymentDoc.data();
            const emailMatch = String(payment.userEmail || payment.email || "").toLowerCase() === residentEmail;
            const statusMatch = String(payment.status || "").toLowerCase() === "paid";
            const paidAt = payment.paidAt && payment.paidAt.toDate ? payment.paidAt.toDate() : null;
            const monthMatch = paidAt ? getMonthKey(paidAt) === currentMonthKey : false;
            return emailMatch && statusMatch && monthMatch;
          });

          if (!hasPaidCurrentMonth) {
            pendingRoomMap[flatNumber] = true;
          }
        });

        const residents = userSnap.docs.filter((doc) => doc.data().role === "resident").length;
        const openComplaints = complaintSnap.docs.filter((doc) => {
          const status = (doc.data().status || "").toLowerCase();
          return status !== "resolved" && status !== "closed";
        }).length;
        const pendingMaintenance = paymentSnap.docs.filter((doc) => {
          const status = (doc.data().status || "").toLowerCase();
          return status !== "paid" && status !== "completed";
        }).length;

        const today = new Date();
        const visitorsToday = visitorSnap.docs.filter((doc) => {
          const timestamp = doc.data().timestamp;
          if (!timestamp || !timestamp.toDate) return false;
          const createdAt = timestamp.toDate();
          return createdAt.toDateString() === today.toDateString();
        }).length;

        setResidentMap(residentMapData);
        setWatchmen(watchmanList);
        setDueRooms(pendingRoomMap);
        setStats([
          { label: "Residents", value: String(residents) },
          { label: "Open Complaints", value: String(openComplaints) },
          { label: "Pending Maintenance", value: String(pendingMaintenance) },
          { label: "Visitors Today", value: String(visitorsToday) },
        ]);

        setNotices(
          announcementSnap.docs.length
            ? announcementSnap.docs.slice(0, 3).map((doc) => ({
                id: doc.id,
                title: doc.data().title || "Society Update",
                detail: doc.data().message || doc.data().detail || "New society update available.",
              }))
            : []
        );
      } catch (error) {
        console.error("Dashboard data load failed:", error);
        setStats(defaultStats);
        setNotices([]);
      }
    };

    loadDashboardData();
  }, []);

  const actions = [
    { label: "Create Watchman", icon: "👤", onClick: () => navigate("/admin/create-watchman") },
    { label: "Maintenance", icon: "💰", onClick: () => navigate("/admin/maintenance-status") },
    { label: "Complaints", icon: "📝", onClick: () => navigate("/admin/complaints-view") },
    { label: "Amenities", icon: "🏊", onClick: () => navigate("/admin/amenities-requests") },
    { label: "Clubhouse", icon: "🏠", onClick: () => navigate("/admin/clubhouse-bookings") },
    { label: "Announcements", icon: "📢", onClick: () => navigate("/admin/announcements") },
  ];

  return (
    <div>
      <Navbar />
      <DashboardLayout
        title="Admin Dashboard"
        subtitle="Society operations overview and quick action center"
        stats={stats}
        actions={actions}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#f4f7fb",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #e5eaf3",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#003366" }}>Recent Society Updates</h3>
            {notices.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.8", color: "#334155" }}>
                {notices.map((notice) => (
                  <li key={notice.id}>{notice.title}: {notice.detail}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, color: "#475569" }}>No announcements published yet.</p>
            )}
          </div>

          <div
            style={{
              background: "#eef9f1",
              borderRadius: "16px",
              padding: "22px",
              border: "1px solid #d9f1e2",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0d6b3d" }}>Performance Snapshot</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Collection Rate</span>
                <strong>{stats[3].value === "0" ? "0%" : "92%"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Attendance</span>
                <strong>{stats[0].value === "0" ? "0%" : "96%"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Resident Satisfaction</span>
                <strong>{stats[0].value === "0" ? "0.0/5" : "4.8/5"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            background: "#fff7ed",
            borderRadius: "18px",
            border: "1px solid #fed7aa",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, color: "#9a4d00" }}>Security Team</h3>
            <span style={{ color: "#7c2d12", fontWeight: 600 }}>{watchmen.length} watchman(s)</span>
          </div>

          {watchmen.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
              {watchmen.map((watchman) => (
                <div
                  key={watchman.id}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid #fdba74",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ fontWeight: 800, color: "#7c2d12", fontSize: "18px" }}>{watchman.name}</div>
                  <div style={{ marginTop: "6px", color: "#374151" }}>{watchman.email}</div>
                  <div style={{ marginTop: "4px", color: "#6b7280", fontSize: "13px" }}>Role: {watchman.role}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, color: "#7c2d12" }}>No watchman details added yet.</p>
          )}
        </div>

        <div
          style={{
            marginTop: "24px",
            background: "#eef4ff",
            borderRadius: "18px",
            border: "1px solid #dfeaff",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", gap: "12px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, color: "#003366" }}>Building Rooms</h3>
            <span style={{ color: "#4b5563", fontWeight: 600 }}>10 floors × 4 rooms = 40 rooms</span>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            {roomGrid.map((floorData) => (
              <div key={floorData.floor} style={{ display: "grid", gap: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#1e3a8a", marginBottom: "4px" }}>
                  {floorData.floor === 1 ? "1st Floor" : floorData.floor === 2 ? "2nd Floor" : floorData.floor === 3 ? "3rd Floor" : `${floorData.floor}th Floor`}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
                  {floorData.rooms.map((roomNumber) => {
                    const resident = residentMap[String(roomNumber)];
                    const occupied = Boolean(resident);
                    const isDue = occupied && dueRooms[String(roomNumber)];

                    return (
                      <button
                        key={roomNumber}
                        type="button"
                        onClick={() => setSelectedRoom(roomNumber)}
                        style={{
                          background: isDue ? "#fff1f2" : occupied ? "#dbeafe" : "#ffffff",
                          border: isDue ? "1px solid #f87171" : occupied ? "1px solid #60a5fa" : "1px solid #dfe7f5",
                          borderRadius: "12px",
                          padding: "14px 12px",
                          cursor: "pointer",
                          textAlign: "left",
                          boxShadow: isDue ? "0 8px 18px rgba(239, 68, 68, 0.12)" : occupied ? "0 8px 18px rgba(59, 130, 246, 0.12)" : "0 2px 6px rgba(15, 23, 42, 0.03)",
                          position: "relative",
                        }}
                      >
                        {isDue && (
                          <span
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "#ef4444",
                              boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.18)",
                            }}
                            title="Maintenance due"
                          />
                        )}
                        <div style={{ fontWeight: 800, fontSize: "20px", color: "#003366" }}>{roomNumber}</div>
                        <div style={{ marginTop: "4px", fontSize: "12px", color: occupied ? "#1d4ed8" : "#64748b", fontWeight: 700 }}>
                          {occupied ? resident.name : "Vacant"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>

      {selectedRoom && (
        <div
          onClick={() => setSelectedRoom(null)}
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
              maxWidth: "440px",
              background: "white",
              borderRadius: "18px",
              padding: "28px 24px",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, color: "#003366" }}>Room {selectedRoom}</h3>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
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

            {selectedResident ? (
              <div style={{ display: "grid", gap: "12px", color: "#334155" }}>
                <div><strong style={{ color: "#0f172a" }}>Resident:</strong> {selectedResident.name}</div>
                <div><strong style={{ color: "#0f172a" }}>Email:</strong> {selectedResident.email}</div>
                <div><strong style={{ color: "#0f172a" }}>Flat / Room:</strong> {selectedResident.flatNumber}</div>
                <div><strong style={{ color: "#0f172a" }}>Role:</strong> {selectedResident.role}</div>

                {watchmen.length > 0 ? (
                  <div
                    style={{
                      marginTop: "8px",
                      paddingTop: "12px",
                      borderTop: "1px solid #e2e8f0",
                      display: "grid",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 800, color: "#7c2d12" }}>Watchman Details</div>
                    {watchmen.map((watchman) => (
                      <div key={watchman.id} style={{ background: "#fff7ed", borderRadius: "10px", padding: "10px 12px", border: "1px solid #fdba74" }}>
                        <div><strong style={{ color: "#0f172a" }}>Name:</strong> {watchman.name}</div>
                        <div><strong style={{ color: "#0f172a" }}>Email:</strong> {watchman.email}</div>
                        <div><strong style={{ color: "#0f172a" }}>Role:</strong> {watchman.role}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: "8px", color: "#64748b" }}>No watchman details are available.</div>
                )}
              </div>
            ) : (
              <div style={{ color: "#64748b", fontWeight: 600 }}>No resident is assigned to this room yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
