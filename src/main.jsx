import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";         // Form
import Viewer from "./viewer";   // Public View
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/form-stingray5979-deep" element={<App />} />      // team-only
        <Route path="/viewer" element={<Viewer />} />           // public
        <Route path="*" element={<Navigate to="/viewer" />} />  // fallback
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
