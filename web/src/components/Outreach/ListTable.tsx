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
import axios from "axios";

import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";

const ListTable = () => {
  const [lists, setLists] = useState<
    {
      _id: string;
      listName: string;
      leads: any;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/list");
        const data = response.data;
        setLists(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!lists) {
    return <div>Loading...</div>;
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No sequences found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Your recent email sequences.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4 py-2 text-left">Name</TableHead>
          <TableHead className="px-4 py-2 text-left">Contacts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lists.map((list) => (
          <TableRow key={list._id} className="hover:bg-muted hover:bg-opacity-10">
            <TableCell className="font-medium relative px-4 py-2">
              <a
                className="flex items-center group space-x-2"
                href={`/outreach/list/${list._id}`}
              >
                <span className="text-muted-foreground hover:text-primary">
                  {list.listName}
                </span>
                <Edit3 className="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
              </a>
            </TableCell>

            {/* Leads Column */}
            <TableCell className="px-4 py-2">
              <Badge className="rounded-md px-3 py-1">{list.leads.length}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ListTable;
