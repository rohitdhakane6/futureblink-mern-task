"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Edit3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ListTable() {
  const [lists, setLists] = useState<
    {
      _id: string;
      listName: string;
      leads: any[];
    }[]
  >([]);

  useEffect(() => {
    axios
      .get("/list")
      .then((res) => setLists(res.data))
      .catch((err) => console.error("Error fetching lists", err));
  }, []);

  return (
      <div className="border rounded-lg p-4">
        {lists.length > 0 ? (
          <Table>
            <TableCaption>Your recent email lists.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contacts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list._id} className="hover:bg-muted/50">
                  <TableCell>
                    <a
                      href={`/outreach/list/${list._id}`}
                      className="flex items-center group space-x-2"
                    >
                      <span className="hover:text-primary transition">
                        {list.listName}
                      </span>
                      <Edit3 className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge className="rounded-md px-3 py-1">
                      {list.leads.length}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No email lists found.</p>
        )}
      </div>
  );
}
