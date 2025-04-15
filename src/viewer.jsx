import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "./firebase";
import "./App.css";

export default function Viewer() {
  const [groupedEntries, setGroupedEntries] = useState({});

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, "entries"));
      const data = snapshot.docs.map(doc => doc.data());

      const grouped = {
        Jemison: [],
        Franklin: [],
        Edison: [],
        Ochoa: []
      };

      const getSection = (pit) => {
        if (!pit || pit.length < 2) return "Unknown";
        const row = pit[0].toUpperCase();
        const num = parseInt(pit.slice(1));

        if (["A", "B", "C", "D"].includes(row)) {
          return num <= 27 ? "Jemison" : "Franklin";
        }
        if (["E", "F", "G"].includes(row)) {
          return num <= 27 ? "Edison" : "Ochoa";
        }
        return "Unknown";
      };

      data.forEach((entry) => {
        const section = getSection(entry.pitLocation?.toUpperCase());
        if (grouped[section]) grouped[section].push(entry);
      });

      // Sort each section by pitLocation
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => {
          const pitA = a.pitLocation?.toUpperCase() || "Z99";
          const pitB = b.pitLocation?.toUpperCase() || "Z99";
          const [rowA, numA] = [pitA[0], parseInt(pitA.slice(1))];
          const [rowB, numB] = [pitB[0], parseInt(pitB.slice(1))];
          if (rowA !== rowB) return rowA.localeCompare(rowB);
          return numA - numB;
        });
      });

      setGroupedEntries(grouped);
    }

    fetchData();
  }, []);

  const orderedSections = ["Jemison", "Franklin", "Edison", "Ochoa"];

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <h1 className="title">Public Viewer – FTC Scouting</h1>
        {orderedSections.map((section) => (
          <div key={section}>
            <h2 className={`section-header ${section.toLowerCase()}`}>{section} Section</h2>
            {!Array.isArray(groupedEntries[section]) || groupedEntries[section].length === 0 ? (
              <p>No teams in this section.</p>
            ) : (
              groupedEntries[section].map((entry, idx) => (
                <div key={idx} className="summary-card">
                  <p><strong>Pit {entry.pitLocation?.toUpperCase() || "??"}</strong></p>
                  <p><strong>{entry.teamName} ({entry.teamNumber})</strong></p>
                  <p>Auto: {entry.autoCount} {entry.autoType}, Park: {entry.autoParkPoints} pts</p>
                  <p>TeleOp: {entry.teleCount} {entry.teleType}</p>
                  <p>Endgame: {entry.endgamePoints} pts</p>
                  {entry.notes && <p><em>Notes: {entry.notes}</em></p>}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
