/* eslint-disable @typescript-eslint/no-explicit-any */
import SequenceFlow from "@/components/SequenceFlow";
import { Button } from "@/components/ui/button";
import { useEdges, useNodes, useReactFlow } from "@xyflow/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface ISequence {
  _id: string;
  name: string;
  status: "draft" | "published";
  performance: {
    sent: number;
    opened: number;
    clicks: number;
    replies: number;
  };
  flowChart: {
    nodes: any[];
    edges: any[];
  };
}

export default function Sequence() {
  const { id } = useParams();
  const [sequence, setSequence] = useState<ISequence | null>(null);
  const { setNodes, setEdges } = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();

  useEffect(() => {
    const fetchSequence = async () => {
      try {
        toast.loading("Loading sequence...");
        const response = await axios.get(`/sequence/${id}`);
        const data: ISequence = response.data;
        setSequence(data);

        if (data.flowChart.nodes) {
          setNodes(data.flowChart.nodes);
        }
        if (data.flowChart.edges) {
          setEdges(data.flowChart.edges);
        }
      } catch (error) {
        toast.error("Failed to fetch sequence");
        console.error("Error fetching sequence:", error);
      } finally {
        toast.dismiss();
      }
    };

    fetchSequence();
  }, [id, setNodes, setEdges]);

  const handleSave = async ({ published }: { published: boolean }) => {
    const toastId = toast.loading("Saving...");
    try {
      await axios.put(`/sequence/${id}`, {
        status: published ? "published" : "draft",
        flowChart: {
          nodes: nodes,
          edges: edges,
        },
      });
      toast.success("Sequence saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save sequence");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex flex-col gap-2 container mx-auto p-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {sequence?.name || "Untitled Sequence"}
          </h1>
          <p>Click on a block to configure and add it in sequence.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              handleSave({ published: false });
            }}
          >
            Save As Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleSave({ published: true });
            }}
          >
            Save and Publish
          </Button>
        </div>
      </div>
      <div>
        <SequenceFlow />
      </div>
    </div>
  );
}
