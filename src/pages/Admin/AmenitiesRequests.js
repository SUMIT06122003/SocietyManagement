import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function AmenitiesRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, "amenitiesRequests"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRequests();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>Amenities Requests</h2>
        <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Resident Email</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Amenity</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{r.user}</td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{r.amenity}</td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
