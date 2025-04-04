import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { PlaceholderNode } from "@/components/Flow/placeholder-node";
import AddNodeDialog from "@/components/Flow/AddNodeDialog";



const AddNode = memo(({ selected }: NodeProps) => {
  return (
    <PlaceholderNode selected={selected} type="addLead">
      <AddNodeDialog />
    </PlaceholderNode>
  );
});

export default AddNode;
