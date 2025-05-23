import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircleIcon } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

const CreateSequenceDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const CreateSequenceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    performance: z.object({
      sent: z.number().default(0),
      opened: z.number().default(0),
      clicks: z.number().default(0),
      replies: z.number().default(0),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateSequenceSchema),
    defaultValues: {
      name: "",
      performance: {
        sent: 0,
        opened: 0,
        clicks: 0,
        replies: 0,
      },
    },
  });

  type FormData = z.infer<typeof CreateSequenceSchema>;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post("/sequence", {
        name: data.name,
        performance: {
          sent: data.performance.sent,
          opened: data.performance.opened,
          clicks: data.performance.clicks,
          replies: data.performance.replies,
        },
      });
      setSuccess("Sequence created successfully");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      setError("Failed to create sequence");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Create New Sequence
          <PlusCircleIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Sequence from Scratch</DialogTitle>
          <DialogDescription>
            Create a new sequence from scratch with multiple building blocks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Input
              {...register("name")}
              id="sequence-name"
              placeholder="Enter Name For Sequence"
            />
          </div>
          <div className="text-destructive">{errors.name?.message}</div>
          <div className="text-sm">
            This name will be used to identify the sequence in your dashboard.
          </div>
          {error && <div className="text-destructive">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          <DialogFooter>
            <Button type="submit">
              {isSubmitting ? "Creating..." : "Create Sequence"}
            </Button>
          </DialogFooter>{" "}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSequenceDialog;
