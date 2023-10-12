import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/landing.css";
import "./assets/css/Room.css";
import "./assets/css/VideoGrid.css";

import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
