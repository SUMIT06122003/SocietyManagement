import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function VisitorsView() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      const q = query(collection(db, "visitors"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setVisitors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchVisitors();
  }, []);

  return (
    <div>
      <Navbar />
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Visitor Log</h2>
      <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "80%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Mobile Number</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Purpose</th>
            <th style={{ border: "1px solid #ccc", padding: "10px" }}>Date / Time</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v.id}>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{v.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{v.mobile}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>{v.purpose}</td>
              <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                {v.timestamp?.toDate ? v.timestamp.toDate().toLocaleString() : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
