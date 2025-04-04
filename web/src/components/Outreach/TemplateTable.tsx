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

import { useEffect, useState } from "react";
import axios from "axios";
import { Edit3 } from "lucide-react";

interface Teamplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
}

const TeamplateTable = () => {
  const [Teamplate, setTeamplate] = useState<Teamplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamplate = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/email-template");
        console.log(response.data);
        setTeamplate(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch Teamplate");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamplate();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (Teamplate.length === 0) {
    return <div>No Teamplate available</div>;
  }
  return (
    <Table>
      <TableCaption>A list of your recent email Teamplate.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Teamplate.map((template) => (
          <TableRow key={template.name}>
            <TableCell className="font-medium relative">
              <a
                className="flex items-center group"
                href={`/outreach/templates/${template._id}`}
              >
                <span className="hover:text-blue-600 cursor-pointer">
                  {template.name}
                </span>
                <Edit3 className="ml-2 size-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Teamplate: {Teamplate.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TeamplateTable;
