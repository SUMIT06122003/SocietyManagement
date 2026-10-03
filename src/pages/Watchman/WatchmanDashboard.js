import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import DashboardLayout from "../../components/DashboardLayout";
import { db } from "../../firebase";

const flatNumbers = Array.from({ length: 10 }, (_, floorIndex) =>
  Array.from({ length: 4 }, (_, roomIndex) => String((floorIndex + 1) * 100 + roomIndex + 1))
).flat();

export default function WatchmanDashboard() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [isFlatGridOpen, setIsFlatGridOpen] = useState(false);
  const [occupiedFlats, setOccupiedFlats] = useState(new Set());
  const [isFlatStatusLoaded, setIsFlatStatusLoaded] = useState(false);
  const [flatStatusError, setFlatStatusError] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState([
    { label: "Visitors Today", value: "0" },
    { label: "All-time Entries", value: "0" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const loadVisitorData = async () => {
      try {
        const q = query(collection(db, "visitors"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        try {
          const residentSnapshot = await getDocs(collection(db, "users"));
          setOccupiedFlats(new Set(residentSnapshot.docs
            .filter((residentDoc) => residentDoc.data().role === "resident")
            .map((residentDoc) => String(residentDoc.data().flatNumber || "").trim())
            .filter(Boolean)));
          setIsFlatStatusLoaded(true);
        } catch (occupancyError) {
          console.error("Failed to load flat occupancy:", occupancyError);
          setFlatStatusError(true);
        }

        const visitorList = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : new Date();
          return {
            id: doc.id,
            name: data.name || "Unknown Visitor",
            mobile: data.mobile || "",
            flatNumber: data.flatNumber || "",
            purpose: data.purpose || "Visit",
            time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: timestamp,
          };
        });

        const today = new Date();
        const visitorsToday = visitorList.filter((item) => item.createdAt.toDateString() === today.toDateString()).length;

        setEntries(visitorList
          .filter((item) => item.createdAt.toDateString() === today.toDateString())
          .slice(0, 8));
        setStats([
          { label: "Visitors Today", value: String(visitorsToday) },
          { label: "All-time Entries", value: String(visitorList.length) },
        ]);
      } catch (error) {
        console.error("Failed to load visitors:", error);
        setEntries([]);
        setStats([
          { label: "Visitors Today", value: "0" },
          { label: "All-time Entries", value: "0" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitorData();
  }, []);

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    const visitorName = name.trim();
    const visitorMobile = mobile.trim();
    const visitorFlatNumber = flatNumber;
    const visitorPurpose = purpose.trim();
    if (!visitorName || !visitorMobile || !visitorPurpose) return;
    if (!visitorFlatNumber) {
      setSaveError("Select the flat this visitor is visiting.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setSaveError("");
    try {
      const createdAt = new Date();
      const visitorRef = await addDoc(collection(db, "visitors"), {
        name: visitorName,
        mobile: visitorMobile,
        flatNumber: visitorFlatNumber,
        purpose: visitorPurpose,
        timestamp: serverTimestamp(),
      });

      setEntries((currentEntries) => [{
        id: visitorRef.id,
        name: visitorName,
        mobile: visitorMobile,
        flatNumber: visitorFlatNumber,
        purpose: visitorPurpose,
        time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt,
      }, ...currentEntries].slice(0, 8));
      setStats((currentStats) => currentStats.map((stat) => ({
        ...stat,
        value: String(Number(stat.value) + 1),
      })));
      setName("");
      setMobile("");
      setFlatNumber("");
      setPurpose("");
      setSaveMessage("Visitor entry saved.");
    } catch (error) {
      console.error("Error adding visitor:", error);
      setSaveError("Unable to save this visitor entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const todayLabel = new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="watchman-page">
      <Navbar />
      <DashboardLayout
        title="Watchman Dashboard"
        subtitle="Visitor register and gate activity"
        stats={stats}
      >
        <div className="watchman-workspace">
          <section className="watchman-panel watchman-form-panel">
            <div className="watchman-panel-heading">
              <div>
                <p className="watchman-eyebrow">Gate register</p>
                <h3>Register a visitor</h3>
              </div>
              <span className="watchman-panel-mark" aria-hidden="true">+</span>
            </div>
            <form className="watchman-form" onSubmit={handleAddVisitor}>
              <div className="watchman-form-field">
                <label htmlFor="visitor-name">Visitor name</label>
                <input
                  id="visitor-name"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="watchman-form-field">
                <label htmlFor="visitor-mobile">Mobile number</label>
                <input
                  id="visitor-mobile"
                  type="tel"
                  inputMode="tel"
                  placeholder="Enter contact number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
              <div className="watchman-form-field watchman-flat-field">
                <span className="watchman-field-label" id="visitor-flat-label">Select flat</span>
                <button
                  className="watchman-flat-trigger"
                  type="button"
                  aria-expanded={isFlatGridOpen}
                  aria-controls="visitor-flat-options"
                  onClick={() => setIsFlatGridOpen((isOpen) => !isOpen)}
                >
                  <span>{flatNumber ? `Flat ${flatNumber}` : "Choose a flat"}</span>
                  <span className={`watchman-flat-chevron${isFlatGridOpen ? " open" : ""}`} aria-hidden="true">⌄</span>
                </button>
                {isFlatGridOpen && (
                  <>
                    {isFlatStatusLoaded ? (
                      <div className="watchman-flat-legend" aria-label="Flat status legend">
                        <span><i className="watchman-flat-swatch occupied" />Occupied</span>
                        <span><i className="watchman-flat-swatch vacant" />Vacant</span>
                      </div>
                    ) : (
                      <p className="watchman-flat-status-message">
                        {flatStatusError ? "Flat occupancy is unavailable." : "Loading flat occupancy..."}
                      </p>
                    )}
                    <div className="watchman-flat-grid" id="visitor-flat-options" role="group" aria-labelledby="visitor-flat-label">
                      {flatNumbers.map((number) => {
                        const isOccupied = occupiedFlats.has(number);
                        const statusClass = isFlatStatusLoaded ? (isOccupied ? " occupied" : " vacant") : "";
                        return (
                          <button
                            className={`watchman-flat-option${statusClass}${flatNumber === number ? " selected" : ""}`}
                            key={number}
                            type="button"
                            aria-label={`Flat ${number}${isFlatStatusLoaded ? `, ${isOccupied ? "occupied" : "vacant"}` : ""}`}
                            aria-pressed={flatNumber === number}
                            title={isFlatStatusLoaded ? `Flat ${number} - ${isOccupied ? "Occupied" : "Vacant"}` : `Flat ${number}`}
                            onClick={() => {
                              setFlatNumber(number);
                              setIsFlatGridOpen(false);
                              setSaveError("");
                            }}
                          >
                            {number}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              <div className="watchman-form-field">
                <label htmlFor="visitor-purpose">Purpose of visit</label>
                <select
                  id="visitor-purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a purpose</option>
                  <option value="Food">Food</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              {saveMessage && <p className="watchman-feedback success" role="status">{saveMessage}</p>}
              {saveError && <p className="watchman-feedback error" role="alert">{saveError}</p>}
              <button className="watchman-submit" type="submit" disabled={isSaving}>
                {isSaving ? "Saving entry..." : "Save visitor entry"}
              </button>
            </form>
          </section>

          <section className="watchman-panel watchman-log-panel">
            <div className="watchman-panel-heading">
              <div>
                <p className="watchman-eyebrow">Daily activity</p>
                <h3>Today’s visitor log</h3>
              </div>
              <span className="watchman-date">{todayLabel}</span>
            </div>
            {entries.length > 0 ? (
              <div className="watchman-entries">
                {entries.map((entry) => (
                  <article className="watchman-entry" key={entry.id}>
                    <div className="watchman-entry-main">
                      <div className="watchman-visitor-name">
                        <span className="watchman-avatar" aria-hidden="true">
                          {entry.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                        </span>
                        <div className="watchman-visitor-summary">
                          <strong>{entry.name}</strong>
                          <span className="watchman-flat-tag">Flat {entry.flatNumber || "Unassigned"}</span>
                        </div>
                      </div>
                      <span className="watchman-entry-time">{entry.time}</span>
                    </div>
                    <div className="watchman-entry-details">
                      <span className="watchman-purpose-tag">{entry.purpose}</span>
                      {entry.mobile && <a href={`tel:${entry.mobile}`}>{entry.mobile}</a>}
                    </div>
                  </article>
                ))}
              </div>
            ) : isLoading ? (
              <p className="watchman-empty">Loading today’s entries...</p>
            ) : (
              <p className="watchman-empty">No visitors have been recorded today.</p>
            )}
          </section>
        </div>
      </DashboardLayout>
    </div>
  );
}
