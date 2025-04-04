import { Handle, Position } from "@xyflow/react";
import { Clock } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function WaitNode({ data, isConnectable }: any) {
  return (
    <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm w-55">
      <div className="flex items-start gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-full">
          <Clock className="text-blue-500 w-5 h-5" />
        </div>
        <div className="text-left">
          <h1 className="text-sm font-semibold text-gray-800">Delay</h1>
          <h2 className="text-xs text-gray-500">
            Wait{" "}
            <span className="text-purple-800">
              {data.time}{" "} {data.unit}(S)
            </span>
          </h2>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-500"
      />
    </div>
  );
}
