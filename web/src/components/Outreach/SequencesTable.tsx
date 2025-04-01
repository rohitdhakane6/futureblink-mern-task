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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Edit3, Link, MailCheck, MailIcon, MailOpen } from "lucide-react";

interface Performance {
  sent: number;
  open: number;
  clicks: number;
  replies: number;
}

interface Sequence {
  id: string;
  name: string;
  status: string;
  performance: Performance;
  scheduledTime: string;
}

const sequences: Sequence[] = [
  {
    id: "1",
    name: "Email Sequence 1",
    status: "Active",
    performance: { sent: 500, open: 400, clicks: 150, replies: 50 },
    scheduledTime: "2025-03-15 10:00 AM",
  },
  {
    id: "2",
    name: "Email Sequence 2",
    status: "Paused",
    performance: { sent: 300, open: 200, clicks: 75, replies: 25 },
    scheduledTime: "2025-03-18 11:30 AM",
  },
  {
    id: "3",
    name: "Follow-up Sequence",
    status: "Completed",
    performance: { sent: 700, open: 600, clicks: 250, replies: 100 },
    scheduledTime: "2025-03-12 09:15 AM",
  },
  {
    id: "4",
    name: "Promo Sequence",
    status: "Active",
    performance: { sent: 600, open: 500, clicks: 200, replies: 75 },
    scheduledTime: "2025-03-17 01:00 PM",
  },
  {
    id: "5",
    name: "Survey Sequence",
    status: "Pending",
    performance: { sent: 0, open: 0, clicks: 0, replies: 0 },
    scheduledTime: "2025-03-20 02:45 PM",
  },
];

const SequencesTable = () => {
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
                href={`/outreach/sequence${sequence.id}`}
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
      <span className="w-5 text-center">{performance.open}</span>

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
