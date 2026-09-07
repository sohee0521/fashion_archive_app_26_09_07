import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import Router from "./Router";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Router />
    </HelmetProvider>
  </StrictMode>,
);
