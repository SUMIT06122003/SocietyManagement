import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function ComplaintsView() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const q = query(collection(db, "complaints"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setComplaints(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchComplaints();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>Complaints</h2>
        <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Resident Email</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Complaint</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{c.user}</td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{c.complaint}</td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
