import CreateSequenceDialog from "@/components/Outreach/CreateSequenceDialog";
import SequencesTable from "@/components/Outreach/SequencesTable";

export default function Sequence() {
  return (
    <div>
      <div className="container mx-auto space-y-3 px-4 py-3">
        <nav>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Outreach Sequences</h1>
              <h3>
                Create/Manage your sequences with automated emails & timely
                tasks.
              </h3>
            </div>
            <CreateSequenceDialog />
          </div>
        </nav>
        <SequencesTable />
      </div>
    </div>
  );
}
