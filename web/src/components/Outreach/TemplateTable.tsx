"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Edit3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Template {
  _id: string;
  name: string;
  subject: string;
  body: string;
}

export default function TemplateTable() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    axios
      .get("/email-template")
      .then((res) => setTemplates(res.data))
      .catch((err) => console.error("Error fetching templates", err));
  }, []);

  return (
    

      <div className="border rounded-lg p-4">
        {templates.length > 0 ? (
          <Table>
            <TableCaption>Your saved email templates.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template._id} className="hover:bg-muted/50">
                  <TableCell>
                    <a
                      href={`/outreach/templates/${template._id}`}
                      className="flex items-center group space-x-2"
                    >
                      <span className="hover:text-primary transition">
                        {template.name}
                      </span>
                      <Edit3 className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Total Templates: {templates.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <p className="text-muted-foreground">No email templates found.</p>
        )}
      </div>
  );
}
