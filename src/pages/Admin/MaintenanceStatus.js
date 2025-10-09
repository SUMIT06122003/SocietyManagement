import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Navbar from "../../components/Navbar";

export default function MaintenanceStatus({ role }) {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all"); // all, Paid, Unpaid
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        let q;
        if (role === "resident") {
          q = query(
            collection(db, "maintenancePayments"),
            where("userEmail", "==", auth.currentUser.email)
          );
        } else {
          q = query(collection(db, "maintenancePayments")); // admin sees all
        }

        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
      setLoading(false);
    };

    fetchPayments();
  }, [role]);

  const containerStyle = {
    padding: "30px",
    textAlign: "center",
  };

  const tableStyle = {
    width: "90%",
    margin: "20px auto",
    borderCollapse: "collapse",
  };

  const thTdStyle = {
    border: "1px solid #ccc",
    padding: "12px",
    fontSize: "16px",
  };

  const thStyle = {
    ...thTdStyle,
    backgroundColor: "#003366",
    color: "white",
  };

  const filterBtnStyle = (type) => ({
    padding: "8px 15px",
    margin: "0 5px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    backgroundColor: filter === type ? "#4c6ef5" : "#15aabf",
    color: "white",
  });

  const filteredPayments =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);

  return (
    <div>
      <Navbar currentUser={auth.currentUser} role={role} />
      <div style={containerStyle}>
        <h2 style={{ fontSize: "28px", color: "#003366" }}>Maintenance Status</h2>

        {role === "admin" && (
          <div style={{ margin: "20px 0" }}>
            <button style={filterBtnStyle("all")} onClick={() => setFilter("all")}>
              All
            </button>
            <button style={filterBtnStyle("Paid")} onClick={() => setFilter("Paid")}>
              Paid
            </button>
            <button style={filterBtnStyle("Unpaid")} onClick={() => setFilter("Unpaid")}>
              Unpaid
            </button>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : filteredPayments.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Amount (₹)</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td style={thTdStyle}>{p.name}</td>
                  <td style={thTdStyle}>{p.userEmail}</td>
                  <td style={thTdStyle}>{p.amount}</td>
                  <td style={{ ...thTdStyle, color: p.status === "Paid" ? "green" : "red" }}>
                    {p.status}
                  </td>
                  <td style={thTdStyle}>
                    {p.paidAt?.toDate ? p.paidAt.toDate().toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
