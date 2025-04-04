import CreateTemplateDialog from "@/components/Outreach/Create-Template-Dialog";
import TeamplateTable from "@/components/Outreach/TemplateTable";
export default function EmailTemplets() {
  return (
    <div>
      <div className="container mx-auto space-y-3 px-4 py-3">
        <nav>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">Email Templates</h1>
              <h3>Create/Manage your Templates for outreach sequences.</h3>
            </div>
            <CreateTemplateDialog />
          </div>
        </nav>
        <TeamplateTable />
      </div>
    </div>
  );
}
