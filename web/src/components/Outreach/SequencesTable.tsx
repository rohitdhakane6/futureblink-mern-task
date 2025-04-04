import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Edit3, Link, MailCheck, MailIcon, MailOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Performance {
  sent: number;
  opened: number;
  clicks: number;
  replies: number;
}

interface Sequence {
  _id: string;
  name: string;
  status: string;
  performance: Performance;
  scheduledTime: string;
}


const SequencesTable = () => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSequences = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/sequence");
        console.log(response.data);
        setSequences(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch sequences");
      } finally {
        setLoading(false);
      }
    };
    fetchSequences();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (sequences.length === 0) {
    return <div>No sequences available</div>;
  }
  return (
    <Table>
      <TableCaption>A list of your recent email sequences.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Scheduled Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sequences.map((sequence) => (
          <TableRow key={sequence.name}>
            <TableCell className="font-medium relative">
              <a
                className="flex items-center group"
                href={`/outreach/sequence/${sequence._id}`}
              >
                <span className="hover:text-blue-600 cursor-pointer">
                  {sequence.name}
                </span>
                <Edit3 className="ml-2 size-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
              </a>
            </TableCell>

            {/* Status Column */}
            <TableCell>
              <Badge>{sequence.status}</Badge>
            </TableCell>

            {/* Performance Column */}
            <TableCell>
              <PerformanceBar performance={sequence.performance} />
            </TableCell>

            {/* Scheduled Time Column */}
            <TableCell>{sequence.scheduledTime}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total Sequences: {sequences.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

const PerformanceBar = ({ performance }: { performance: Performance }) => {
  return (
    <span className="flex items-center gap-2">
      {/* Sent */}
      <Tooltip>
        <TooltipTrigger>
          <MailCheck className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Emails Sent</span>
        </TooltipContent>
      </Tooltip>
      <span className="w-5 text-center">{performance.sent}</span>

      {/* Open */}
      <Tooltip>
        <TooltipTrigger>
          <MailOpen className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Emails Opened</span>
        </TooltipContent>
      </Tooltip>
      <span className="w-5 text-center">{performance.opened}</span>

      {/* Clicks */}
      <Tooltip>
        <TooltipTrigger>
          <Link className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Links Clicked</span>
        </TooltipContent>
      </Tooltip>
      <span className="w-5 text-center">{performance.clicks}</span>

      {/* Replies */}
      <Tooltip>
        <TooltipTrigger>
          <MailIcon className="size-4" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Replies Received</span>
        </TooltipContent>
      </Tooltip>
      <span className="w-5 text-center">{performance.replies}</span>
    </span>
  );
};

export default SequencesTable;
