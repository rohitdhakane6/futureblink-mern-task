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
import { redirect } from "react-router-dom";

const CreateTemplateDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const CreateTemplateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateTemplateSchema),
    defaultValues: {
      name: "Welcome Email",
      subject: "Welcome to Our Platform!",
      body: "Hello {{firstName}},\n\nWelcome to our platform! We're excited to have you on board. Let us know if you need any help.\n\nBest,\nThe Team",
    },
  });

  type FormData = z.infer<typeof CreateTemplateSchema>;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res=await axios.post("/email-template", {
        name: data.name,
        subject: data.subject,
        body: data.body,
      });
      setSuccess("Template created successfully!");
      setOpen(false);
      redirect(`/outreach/templates/${res.data._id}`);
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
          Create New Template
          <PlusCircleIcon className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Template</DialogTitle>
          <DialogDescription>
            Create a new Template for your outreach sequence.
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
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </DialogFooter>{" "}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;
