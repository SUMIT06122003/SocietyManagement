import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, "announcements"), orderBy("createdAt", "desc")));
        setAnnouncements(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "Society Update",
            detail: doc.data().message || doc.data().detail || "No details provided.",
          }))
        );
      } catch (error) {
        console.error("Announcements load failed:", error);
        setAnnouncements([]);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "32px auto", padding: "0 20px" }}>
        <h2 style={{ color: "#003366", marginBottom: "24px" }}>Community Announcements</h2>
        {announcements.length > 0 ? (
          <div style={{ display: "grid", gap: "18px" }}>
            {announcements.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#f8fafc",
                  borderRadius: "14px",
                  border: "1px solid #dfe8f4",
                  padding: "20px 22px",
                  boxShadow: "0 6px 14px rgba(15, 23, 42, 0.04)",
                }}
              >
                <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#475569" }}>No announcements available yet.</p>
        )}
      </div>
    </div>
  );
}
