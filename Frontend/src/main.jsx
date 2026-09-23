import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


import "./styles/globals.css";
import "./i18n";

import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./auth/setupAuthFetch";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);