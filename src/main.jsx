import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/500.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import { RootRouter } from "./RootRouter.jsx";
import "./styles.css";
import "./spring-path.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>,
);
