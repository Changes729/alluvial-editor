import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index.scss";
import { TyporaEditorView } from "./typoraView";
import AlluvialTidal from "./AlluvialTidal";

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<TyporaEditorView />} />
        <Route index path="/tidal-test" element={<AlluvialTidal />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  ReactDOM.createRoot(document.body).render(<App />);

  /** Main Start */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && (e.key === "o" || e.key === "O")) {
      e.preventDefault();
      console.log("Ctrl+O pressed! Executing custom action.");
    } else if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      console.log("Ctrl+S pressed! Executing custom save action.");
    }
  });
};
