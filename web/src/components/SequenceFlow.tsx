/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
} from "@xyflow/react";
import AddLeadNode from "@/components/Flow/AddLeadNode";
import AddNode from "@/components/Flow/Add-Node-Placeholder";
import EmailNode from "@/components/Flow/EmailNode";
import WaitNode from "@/components/Flow/WaitNode";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "addLead",
    selected: true,
    position: { x: 100, y: 100 },
    data: { label: "Add Lead", selectedLead: null },
  },
  {
    id: "2",
    position: { x: 100, y: 250 },
    data: { label: "Sequence Start Point" },
  },
];

const initialEdges: Edge[] = [];

export default function SequenceFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedLead, setSelectedLead] = useState<{
    _id: string;
    listName: string;
  } | null>(null);

  const handleLeadSelect = (listId: string, listName: string) => {
    setSelectedLead(
      listId && listName ? { _id: listId, listName: listName } : null
    );
    setNodes((nds) => [
      ...nds.map((node) =>
        node.id === "1"
          ? {
              ...node,
              data: {
                ...node.data,
                selectedLead: {
                  _id: listId,
                  listName: listName,
                },
              },
            }
          : node
      ),
      {
        id: "3",
        type: "addnode",
        position: { x: 100, y: 350 },
        data: { label: "Add new node" },
      },
    ]);

    setEdges([
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" , animated: true },
    ]);
  };

  const nodeTypes = {
    addnode: AddNode,
    email: EmailNode,
    wait:WaitNode,
    addLead: (props: any) => (
      <AddLeadNode {...props} onLeadSelect={handleLeadSelect} />
    ),
  };
  console.log("nodes", nodes);
  console.log("edges", edges);

  return (
    <div className="mt-3">
      <div className="h-[700px] w-full border-2 border-gray-300 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
