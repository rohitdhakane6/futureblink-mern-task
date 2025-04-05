import { Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] flex-col text-center px-4">
      <Clock className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold">Dashboard Coming Soon</h1>
      <p className="text-muted-foreground mt-2 text-sm max-w-md">
        We're building something awesome! Your dashboard will be available shortly.
      </p>
    </div>
  );
}
