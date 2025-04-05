import { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import axios from "axios";

interface LeadNodeProps {
  data: {
    id: string;
    label: string;
  };
  isConnectable: boolean;
  onLeadSelect: (listId: string, listName: string) => void;
}

const LeadNode = ({ data, isConnectable, onLeadSelect }: LeadNodeProps) => {
  const [open, setOpen] = useState(false);
  const [leadSources, setLeadSources] = useState<
    {
      _id: string;
      listName: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      leads: any[];
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadSources = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/list");
        setLeadSources(response.data);
      } catch (error) {
        console.error("Error fetching lead sources:", error);
        setError("Failed to fetch lead sources");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadSources();
  }, []);

  const handleSelectLead = (leadId: string) => {
    setOpen(false);
    onLeadSelect(
      leadId,
      leadSources.find((item) => item._id === leadId)?.listName || ""
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white border rounded-lg shadow-md">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer flex flex-col items-center gap-2">
            {data.id ? (
              <span className="text-gray-700">{data.label}</span>
            ) : (
              <Plus className="w-6 h-6 text-gray-500" />
            )}
            <span className="text-xs text-gray-500">
              {data.id ? "Change Lead Source" : "Select Lead Source"}
            </span>
          </div>
        </DialogTrigger>

        <DialogContent className="w-96 p-4">
          <h2 className="text-lg font-semibold">Select Lead Source</h2>

          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {leadSources.map((lead) => (
                <li
                  key={lead._id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectLead(lead._id)}
                >
                  {lead.listName}
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default LeadNode;
