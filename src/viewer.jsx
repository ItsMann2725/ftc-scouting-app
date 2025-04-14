import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "./firebase";
import "./App.css";

export default function Viewer() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, "entries"));
      const data = snapshot.docs.map(doc => doc.data());
      setEntries(data);
    }
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <h1 className="title">Public Viewer – FTC Scouting</h1>
        {entries.length === 0 ? (
          <p>Loading...</p>
        ) : (
          entries.map((entry, idx) => (
            <div key={idx} className="summary-card">
              <p><strong>Team {entry.team}</strong></p>
              <p>Auto: {entry.autoCount} {entry.autoType}</p>
              <p>TeleOp: {entry.teleCount} {entry.teleType}</p>
              <p>Endgame: {entry.endgamePoints} pts</p>
              {entry.notes && <p><em>{entry.notes}</em></p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
