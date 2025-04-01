import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ImportList from "@/components/Outreach/ImportList";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

const CreateListDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Create New List
          <PlusCircleIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-6xl sm:max-w-6xl sm:min-h-6xl sm:max-h-6xl w-full">
        <ImportList
          closeDilog={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateListDialog;
