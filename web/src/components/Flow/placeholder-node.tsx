import {  ReactNode, forwardRef } from "react";
import {
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import { BaseNode } from "@/components/Flow/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  type?: string; // Ensure `type` is defined
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ selected, children }, ref) => {
    return (
      <BaseNode
        ref={ref}
        selected={selected}
        className="w-[150px] border-dashed border-blue-500 bg-card p-2 text-center text-blue-500 shadow-none"
        // onClick={handleClick}
      >
        {children}
        <Handle
          type="target"
          style={{ visibility: "hidden" }}
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          type="source"
          style={{ visibility: "hidden" }}
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  }
);

PlaceholderNode.displayName = "PlaceholderNode";
