import CreateListDialog from "@/components/Outreach/Create-List-Dialog";
import ListTable from "@/components/Outreach/ListTable";

export default function Lists() {
  return (
    <div>
      <div className="container mx-auto space-y-3 px-4 py-3">
        <nav>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Lists</h1>
              <h3>Lists contain uploaded leads along with custom data.</h3>
            </div>
            <CreateListDialog />
          </div>
        </nav>
        <ListTable />
      </div>
    </div>
  );
}
