import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "./firebase";
import "./App.css";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    team: "",
    autoType: "Sample",
    autoCount: 0,
    autoParkPoints: 0,
    teleType: "Sample",
    teleCount: 0,
    endgamePoints: 0,
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🚨 Basic validation
    if (
      !form.team.trim() ||
      form.autoCount < 0 ||
      form.teleCount < 0 ||
      form.endgamePoints < 0
    ) {
      alert("Please fill in all required fields correctly.");
      return;
    }
  
    const newEntry = { ...form };
  
    try {
      await addDoc(collection(db, "entries"), newEntry);
      console.log("Entry added to Firebase");
  
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);
      localStorage.setItem("scoutingData", JSON.stringify(updatedEntries));
  
      setForm({
        team: "",
        autoType: "Sample",
        autoCount: 0,
        autoParkPoints: 0,
        teleType: "Sample",
        teleCount: 0,
        endgamePoints: 0,
        notes: ""
      });
  
    } catch (error) {
      console.error("Error adding entry to Firebase: ", error);
    }
  };
  
  

  const exportCSV = () => {
    const headers = Object.keys(form);
    const rows = entries.map((entry) =>
      headers.map((header) => entry[header])
    );
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "scouting_data.csv");
    link.click();
  };

  return (
    <div className="app-container">
      <div className="app-wrapper">
        
      <h1 className="title">FTC 5979 Scouting App - Into the Deep</h1>

      <form onSubmit={handleSubmit} className="form">
        
        
      <input
  name="teamName"
  value={form.teamName}
  onChange={handleChange}
  placeholder="Team Name"
  className="input"
  required

/>
<input
  name="teamNumber"
  value={form.teamNumber}
  onChange={handleChange}
  placeholder="Team Number"
  className="input"
  required

/>


        <div className="field">
          <label>Auto Piece Type</label>
          <select name="autoType" value={form.autoType} onChange={handleChange} className="select">
            <option>Sample</option>
            <option>Specimen</option>
            <option>Both</option>
          </select>
        </div>

        <input
          type="number"
          name="autoCount"
          value={form.autoCount}
          onChange={handleChange}
          placeholder="# Scored in Auto"
          className="input"
          required

        />

        <div className="field">
          <label>Parking Points</label>
          <select name="autoParkPoints" value={form.autoParkPoints} onChange={handleChange} className="select">
            <option value={0}>0</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>

        <div className="field">
          <label>TeleOp Piece Type</label>
          <select name="teleType" value={form.teleType} onChange={handleChange} className="select">
            <option>Sample</option>
            <option>Specimen</option>
            <option>Both</option>
          </select>
        </div>

        <input
          type="number"
          name="teleCount"
          value={form.teleCount}
          onChange={handleChange}
          placeholder="# Scored in TeleOp"
          className="input"
          required

        />

        <div className="field">
          <label>Ascent Points</label>
          <select name="endgamePoints" value={form.endgamePoints} onChange={handleChange} className="select">
            <option value={0}>0</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
        </div>

        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Additional Notes"
          className="textarea"
        />

        <div className="submit">
          <button type="submit" className="button submit">Save Entry</button>
        </div>
        
      </form>

      <div className="summary">
        <h2>Scouting Summary</h2>
        <ul>
          {entries.map((entry, idx) => (
            <li key={idx} className="summary-card">
              <p><strong>Team {entry.team}</strong></p>
              <p>Auto: {entry.autoCount} {entry.autoType.toLowerCase()}(s), Park: {entry.autoParkPoints} pts</p>
              <p>TeleOp: {entry.teleCount} {entry.teleType.toLowerCase()}(s)</p>
              <p>Endgame: Ascent - {entry.endgamePoints} pts</p>
              <p><em>Notes: {entry.notes}</em></p>
            </li>
          ))}
        </ul>
        <button onClick={exportCSV} className="button export">Export to CSV</button>
      </div>
    
      </div>
    </div>
  );
}
