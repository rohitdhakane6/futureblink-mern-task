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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (sequences.length === 0) return <div className="text-center py-10">No sequences available</div>;

  return (
    <div className="rounded-xl border bg-white shadow-sm dark:bg-background">
      <Table>
        <TableCaption className="pt-2 text-muted-foreground">A list of your recent email sequences.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Scheduled Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sequences.map((sequence) => (
            <TableRow key={sequence._id} className="hover:bg-muted transition-colors duration-150">
              {/* Name */}
              <TableCell className="font-semibold">
                <a href={`/outreach/sequence/${sequence._id}`} className="flex items-center group">
                  <span className="group-hover:text-blue-600 transition-colors duration-150 capitalize">
                    {sequence.name}
                  </span>
                  <Edit3 className="ml-2 size-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                </a>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={sequence.status === "published" ? "default" : "secondary"}>
                  {sequence.status}
                </Badge>
              </TableCell>

              {/* Performance */}
              <TableCell>
                <PerformanceBar performance={sequence.performance} />
              </TableCell>

              {/* Time */}
              <TableCell className="text-muted-foreground">{sequence.scheduledTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium text-sm text-muted-foreground pr-4">
              Total Sequences: {sequences.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

const PerformanceBar = ({ performance }: { performance: Performance }) => {
  const stats = [
    { icon: MailCheck, label: "Sent", value: performance.sent },
    { icon: MailOpen, label: "Opened", value: performance.opened },
    { icon: Link, label: "Clicked", value: performance.clicks },
    { icon: MailIcon, label: "Replied", value: performance.replies },
  ];

  return (
    <div className="flex gap-4">
      {stats.map(({ icon: Icon, label, value }, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <Icon className="size-4 text-foreground" />
              <span>{value}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <span>{label}</span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default SequencesTable;
