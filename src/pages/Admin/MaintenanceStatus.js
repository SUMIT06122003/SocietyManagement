import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MaintenanceStatus() {
  const [residents, setResidents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "maintenance"));
      const data = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
      setResidents(data);
    };
    fetchData();
  }, []);

  const filtered = residents.filter(r => filter === "all" ? true : filter === "paid" ? r.paid : !r.paid);

  return (
    <div>
      <Navbar />
      <div style={{textAlign:"center", marginTop:"30px"}}>
        <h2>Maintenance Status</h2>
        <div style={{margin:"20px"}}>
          <button onClick={()=>setFilter("all")} style={{margin:"0 5px"}}>All</button>
          <button onClick={()=>setFilter("paid")} style={{margin:"0 5px"}}>Paid</button>
          <button onClick={()=>setFilter("unpaid")} style={{margin:"0 5px"}}>Unpaid</button>
        </div>

        <table style={{margin:"0 auto", borderCollapse:"collapse", width:"80%"}}>
          <thead>
            <tr>
              <th style={{border:"1px solid #ccc", padding:"10px"}}>Email</th>
              <th style={{border:"1px solid #ccc", padding:"10px"}}>Amount</th>
              <th style={{border:"1px solid #ccc", padding:"10px"}}>Paid</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>(
              <tr key={i}>
                <td style={{border:"1px solid #ccc", padding:"10px"}}>{r.email}</td>
                <td style={{border:"1px solid #ccc", padding:"10px"}}>{r.amount || "-"}</td>
                <td style={{border:"1px solid #ccc", padding:"10px"}}>{r.paid ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
