/**
 * @project Cleanwave Recycling Platform
 * @author  Muhammad Aliyu Muazu
 * @year    2026
 * @version 2.0.0
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
