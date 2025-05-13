import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </AuthProvider>
);
