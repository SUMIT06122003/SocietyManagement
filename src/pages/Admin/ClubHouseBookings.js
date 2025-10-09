import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function ClubhouseBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(collection(db, "clubhouse"), orderBy("date", "asc"));
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>Clubhouse Bookings</h2>
        <table style={{ margin: "20px auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "10px" }}>Booked By</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{b.date}</td>
                <td style={{ border: "1px solid #ccc", padding: "10px" }}>{b.bookedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
