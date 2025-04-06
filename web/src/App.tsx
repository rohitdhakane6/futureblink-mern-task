import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner";

import Home from "@/pages/Home";
import Outreach from "@/pages/Outreach";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PrivateRoute from "@/components/PrivateRoute";

function App() {
  const location = useLocation();

  const protectedRoutes = ["/dashboard", "/outreach"];
  const showNavbar = protectedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        {showNavbar && <NavBar />}
        <main className={`${showNavbar ? "mt-14" : ""} flex-grow`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/outreach/*"
              element={
                <PrivateRoute>
                  <Outreach />
                </PrivateRoute>
              }
            />

            {/* 404 fallback */}
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
