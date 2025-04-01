import NavBar from "@/components/Outreach/Outreach-Navbar";
import { Route, Routes } from "react-router-dom";
import Sequence from "@/components/Outreach/Sequence";
import Outbox from "@/components/Outreach/Outbox";
import EmailSenders from "@/components/Outreach/EmailSenders";
import Lists from "@/components/Outreach/Lists";

export default function Outreach() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex-grow">
        <Routes>
          <Route path="sequence" element={<Sequence />} />
          <Route path="outbox" element={<Outbox />} />
          <Route path="lists" element={<Lists/>} />
          <Route path="templates" element={<div>Templates</div>} />
          <Route path="email-senders" element={<EmailSenders />} />
        </Routes>
      </div>
    </div>
  );
}
