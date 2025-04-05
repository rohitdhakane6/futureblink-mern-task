import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner";

import Home from "@/pages/Home";
import Outreach from "@/pages/Outreach";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function AppContent() {
  const location = useLocation();
  const hideNavbarOnRoutes = ["/", "/login", "/register"];
  const shouldHideNavbar = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        {!shouldHideNavbar && <NavBar />}
        <main className={`${!shouldHideNavbar ? "mt-14" : ""} flex-grow`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/outreach/*" element={<Outreach />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
