import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Validation schema
const emailSenderSchema = z.object({
  email: z.string().email("Invalid email address"),
  smtp: z.object({
    host: z.string().min(1, "SMTP Host is required"),
    port: z.number().min(1, "Invalid SMTP Port"),
    username: z.string().min(1, "SMTP Username is required"),
    password: z.string().min(1, "SMTP Password is required"),
    secure: z.boolean(),
  }),
});

export default function AddEmailSenderDialog() {
  const [open, setOpen] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(emailSenderSchema),
    defaultValues: {
      email: "",
      smtp: {
        host: "",
        port: 587,
        username: "",
        password: "",
        secure: false,
      },
    },
  });

  // Handle adding a new email sender
  const onSubmit = async (data) => {
    try {
      // API call
      await axios.post("/email-senders", data);

      toast.success("Email sender added successfully!");
      setOpen(false);
      reset(); // Reset the form after successful submission
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.error ===
          "Invalid SMTP credentials or connection issue."
      ) {
        toast.error("Invalid SMTP credentials or connection issue.");
      } else if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("An error occurred while adding the email sender.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Email Sender</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Email Sender</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" {...register("email")} />
          </div>

          {/* SMTP Host */}
          <div className="space-y-1">
            <label className="text-sm font-medium">SMTP Host</label>
            <Input
              type="text"
              placeholder="Enter SMTP Host"
              {...register("smtp.host")}
            />
            <p className="text-destructive text-xs h-3">
              {errors.smtp?.host?.message}
            </p>
          </div>

          {/* SMTP Port */}
          <div className="space-y-1">
            <label className="text-sm font-medium">SMTP Port</label>
            <Input
              type="number"
              placeholder="Enter SMTP Port"
              {...register("smtp.port", { valueAsNumber: true })}
            />
            <p className="text-destructive text-xs h-3">
              {errors.smtp?.port?.message}
            </p>
          </div>

          {/* SMTP Username */}
          <div className="space-y-1">
            <label className="text-sm font-medium">SMTP Username</label>
            <Input
              type="text"
              placeholder="Enter SMTP Username"
              {...register("smtp.username")}
            />
            <p className="text-destructive text-xs h-3">
              {errors.smtp?.username?.message}
            </p>
          </div>

          {/* SMTP Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium">SMTP Password</label>
            <Input
              type="password"
              placeholder="Enter SMTP Password"
              {...register("smtp.password")}
            />
            <p className="text-destructive text-xs h-3">
              {errors.smtp?.password?.message}
            </p>
          </div>

          {/* Secure Option */}
          <label className="flex items-center space-x-2">
            <input type="checkbox" {...register("smtp.secure")} />
            <span className="text-sm">Use SSL/TLS</span>
          </label>

          {/* Submit Button */}
          <Button type="submit" className="w-full mt-3">
            Add Email Sender
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
