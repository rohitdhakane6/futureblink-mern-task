import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
} from "@xyflow/react";
import AddNode from "@/components/Flow/Add-Node-Placeholder";
import EmailNode from "@/components/Flow/EmailNode";
import WaitNode from "@/components/Flow/WaitNode";
import LeadNode from "@/components/Flow/LeadNode";

const defaultNodes: Node[] = [
  {
    id: "1",
    type: "lead",
    selected: true,
    position: { x: 100, y: 100 },
    data: {
      label: "Add Lead",
    },
  },
  {
    id: "2",
    position: { x: 100, y: 250 },
    data: { label: "Sequence Start Point" },
  },
];

const defaultEdges: Edge[] = [];

export default function SequenceFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

  const handleLeadSelect = (listId: string, listName: string) => {
    console.log("Selected lead:", listId, listName);
    setNodes((nds) => [
      ...nds.map((node) =>
        node.id === "1"
          ? {
              ...node,
              data: {
                id: listId,
                label: `Lead Added (${listName})`,
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
      { id: "e1-2", source: "1", target: "2", animated: false },
      { id: "e2-3", source: "2", target: "3", animated: true },
    ]);
  };

  const nodeTypes = {
    addnode: AddNode,
    email: EmailNode,
    wait: WaitNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lead: (props: any) => (
      <LeadNode {...props} onLeadSelect={handleLeadSelect} />
    ),
  };

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
