import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router";

import "./css/index.scss";
import MilkdownPhone from "./pages/milkdown-phone";
import MilkdownPC from "./pages/milkdown-pc";
import { getDeviceInfos } from "./utils/dev-infos";

function App() {
  onload = () => {
    useNavigate()(document.location.pathname);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            getDeviceInfos().isMobile ? <MilkdownPhone /> : <MilkdownPC />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/** Main Start */
window.onload = () => {
  let node = document.createElement("div");
  document.body.appendChild(node);
  ReactDOM.createRoot(node).render(<App />);

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
