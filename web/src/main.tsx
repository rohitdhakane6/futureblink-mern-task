import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@xyflow/react/dist/style.css";
import axios from "axios";
import App from "./App.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "token"
)}`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
