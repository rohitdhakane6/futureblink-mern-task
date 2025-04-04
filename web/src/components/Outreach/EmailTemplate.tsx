import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

export default function EmailTemplate() {
  const { id } = useParams<{ id?: string }>();
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid email template ID");
      setIsLoading(false);
      return;
    }

    const fetchEmailTemplate = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await axios.get<EmailTemplate>(`/email-template/${id}`);
        setEmailTemplate(response.data);
        console.log(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch email template");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailTemplate();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!emailTemplate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No template found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Email Template</h1>
        <Button variant="outline">Save Template</Button>
      </div>

      <div className="w-full max-w-2xl p-6 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold">Template Details</h2>

        <div className="mt-4 space-y-3">
          <p>
            <strong>Name:</strong> {emailTemplate.name}
          </p>
          <p>
            <strong>Subject:</strong> {emailTemplate.subject}
          </p>
          <div>
            <p className="font-medium">Body:</p>
            <div className="mt-2 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: emailTemplate.body }} />
          </div>
        </div>
      </div>
    </div>
  );
}
