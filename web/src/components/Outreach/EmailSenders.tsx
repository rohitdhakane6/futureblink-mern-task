import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import AddEmailSenderDialog from "@/components/Outreach/Add-Email-Sender-Dialog";

interface EmailSender {
  _id: string;
  email: string;
  status: "active" | "inactive";
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
  };
}

export default function Emailsenders() {
  const [emailSenders, setEmailSenders] = useState<EmailSender[]>([]);

  useEffect(() => {
    axios
      .get("/email-senders")
      .then((res) => setEmailSenders(res.data))
      .catch(() => toast.error("Failed to fetch email senders."));
  }, []);

  return (
    <div>
      <div className="container mx-auto space-y-3 px-4 py-3">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Email Senders</h1>
            <h3 className="text-sm text-gray-600">
              Manage SMTP settings & improve email deliverability.
            </h3>
          </div>
          <AddEmailSenderDialog />
        </header>

        {/* List all email senders */}
        <div className="border rounded-lg p-4">
          {emailSenders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>SMTP Host</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailSenders.map((sender) => (
                  <TableRow key={sender._id}>
                    <TableCell>{sender.email}</TableCell>
                    <TableCell>{sender.smtp.host}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded ${
                          sender.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sender.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No email senders added yet.</p>
          )}
        </div>

        {/* Add Email Sender Dialog */}
      </div>
    </div>
  );
}
