import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import styles
import "./styles/global.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
