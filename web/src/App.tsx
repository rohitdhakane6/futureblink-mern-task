import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner"

import Home from "@/pages/Home";
import Outreach from "@/pages/Outreach";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
function App() {
  return (
    <Router>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow mt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/outreach/*" element={<Outreach />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
