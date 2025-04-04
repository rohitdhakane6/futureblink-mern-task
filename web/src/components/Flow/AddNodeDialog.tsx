import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hourglass, Mail } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useNodeId, useNodes, useReactFlow } from "@xyflow/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AddNodeDialog() {
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<
    "Cold Email" | "Wait" | null
  >(null);

  const NodeId = useNodeId();
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const currentNode = nodes.find((node) => node.id === NodeId);
  const previousNode = NodeId
    ? nodes.find((node) => node.id === (parseInt(NodeId) - 1).toString())
    : null;
  console.log("Previous Node:", previousNode);

  const handleNodeSelect = useCallback(
    (type: "email" | "wait", idOrTime: string, nameOrUnit: string) => {
      if (!NodeId) return;
      const nextNodeId = (parseInt(NodeId) + 1).toString();

      setEdges((edges) => {
        return [
          ...edges.map((edge) =>
            edge.target === NodeId
              ? {
                  ...edge,
                  animated: false,
                }
              : edge
          ),
          {
            id: `e${NodeId}-${nextNodeId}`,
            source: NodeId,
            target: nextNodeId,
            animated: true,
          },
        ];
      });

      setNodes((nodes) => {
        return [
          ...nodes.map((node) =>
            node.id === NodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    ...(type === "email"
                      ? { id: idOrTime }
                      : { time: idOrTime }),
                    ...(type === "email"
                      ? { label: nameOrUnit }
                      : { unit: nameOrUnit }),
                  },
                  type: type,
                }
              : node
          ),
          {
            id: nextNodeId,
            type: "addnode",
            position: { x: 100, y: (currentNode?.position.y ?? 0) + 100 },
            data: { label: "Add new node" },
          },
        ];
      });
    },
    [setNodes, setEdges, NodeId, currentNode?.position.y]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <span className="text-gray-700">+</span>
          </div>
        </DialogTrigger>

        <DialogContent className="w-[500px] p-6 rounded-lg shadow-lg">
          <DialogHeader className="font-bold">Add Blocks</DialogHeader>
          <DialogDescription>
            Click on a block to configure and add it in sequence.
          </DialogDescription>

          <h3 className="font-semibold">Outreach</h3>

          <div className="flex gap-4">
            <div
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 w-56"
              onClick={() => {
                setOpenSecondDialog(true);
                setSelectedBlock("Cold Email");
              }}
            >
              <div className="p-2 bg-purple-100 rounded-md">
                <Mail />
              </div>
              <div>
                <h4 className="font-medium">Cold Email</h4>
                <p className="text-xs">Send an email to a lead.</p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 w-56",
                previousNode?.type != "email" ? "hidden" : ""
              )}
              onClick={() => {
                setOpenSecondDialog(true);
                setSelectedBlock("Wait");
              }}
            >
              <div className="p-2 bg-purple-100 rounded-md">
                <Hourglass />
              </div>
              <div>
                <h4 className="font-medium">Wait</h4>
                <p className="text-xs">Add delay between blocks</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfigureDialog
        open={openSecondDialog}
        onOpenChange={setOpenSecondDialog}
        selectedBlock={selectedBlock}
        handleNodeSelect={handleNodeSelect}
      />
    </div>
  );
}

const ConfigureDialog = ({
  open,
  onOpenChange,
  selectedBlock,
  handleNodeSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBlock: string | null;
  handleNodeSelect: (type: "email" | "wait", idOrTime: string,nameOrUnit:string) => void;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [waitTime, setWaitTime] = useState("");
  const [waitType, setWaitType] = useState("days");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-6 rounded-lg shadow-lg">
        <DialogHeader className="font-bold">
          {selectedBlock} Settings
        </DialogHeader>
        <DialogDescription>
          Configure the settings for the <strong>{selectedBlock}</strong> block.
        </DialogDescription>

        {/* Configuration UI */}
        <div className="mt-4">
          {selectedBlock === "Cold Email" && (
            <ColdEmailBlock
              onSave={(template) => setSelectedTemplate(template)}
            />
          )}
          {selectedBlock === "Wait" && (
            <WaitBlock
              waitTime={waitTime}
              setWaitTime={setWaitTime}
              waitType={waitType}
              setWaitType={setWaitType}
            />
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              if (selectedBlock === "Cold Email" && selectedTemplate) {
                handleNodeSelect("email", selectedTemplate._id, selectedTemplate.name);
              } else if (selectedBlock === "Wait" && waitTime) {
                handleNodeSelect("wait", waitTime, waitType);
              }
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ColdEmailBlock = ({
  onSave,
}: {
  onSave: (template: { _id: string; name: string }) => void;
}) => {
  const [emailTemplate, setEmailTemplate] = useState<
    { _id: string; name: string }[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    _id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchEmailTemplate = async () => {
      try {
        const response = await axios.get("/email-template");
        if (response.data.length > 0) {
          setEmailTemplate(response.data);
          setSelectedTemplate(response.data[0]);
          onSave(response.data[0]); // Auto-select first template
        }
      } catch (error) {
        console.error("Error fetching email template:", error);
      }
    };
    fetchEmailTemplate();
  }, [onSave]);

  const handleTemplateChange = (templateId: string) => {
    const selected = emailTemplate.find(
      (template) => template._id === templateId
    );
    if (selected) {
      setSelectedTemplate(selected);
      onSave(selected);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={selectedTemplate?._id || ""}
        onValueChange={handleTemplateChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Email Template">
            {selectedTemplate ? selectedTemplate.name : "Select Email Template"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {emailTemplate.map((template) => (
            <SelectItem key={template._id} value={template._id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const WaitBlock = ({
  waitTime,
  setWaitTime,
  waitType,
  setWaitType,
}: {
  waitTime: string;
  setWaitTime: (value: string) => void;
  waitType: string;
  setWaitType: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Wait Time Input */}
      <div>
        <Label htmlFor="waittime" className="block mb-2">
          Wait For
        </Label>
        <Input
          id="waittime"
          type="number"
          placeholder="Enter wait time"
          className="w-full p-2 border rounded-md"
          value={waitTime}
          onChange={(e) => setWaitTime(e.target.value)}
        />
      </div>

      {/* Wait Type Select */}
      <div>
        <Label htmlFor="waittype" className="block mb-2">
          Wait Type
        </Label>
        <Select value={waitType} onValueChange={setWaitType}>
          <SelectTrigger id="waittype" className="w-full">
            <SelectValue placeholder="Select wait type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="min">Minutes</SelectItem>
            <SelectItem value="hour">Hours</SelectItem>
            <SelectItem value="day">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
