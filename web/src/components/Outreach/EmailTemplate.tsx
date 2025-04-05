import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

export default function EmailTemplatePage() {
  const { id } = useParams<{ id?: string }>();
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchEmailTemplate = async () => {
      if (!id) {
        toast.error("Invalid email template ID");
        return;
      }

      try {
        const response = await axios.get<EmailTemplate>(`/email-template/${id}`);
        setEmailTemplate(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || "Failed to fetch email template");
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    };

    fetchEmailTemplate();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!id || !emailTemplate) return;
      await axios.put(`/email-template/${id}`, emailTemplate);
      toast.success("Template updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save template");
    }
  };

  if (!emailTemplate) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Template</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Template
          </Button>
        )}
      </div>

      <div className="w-full border shadow-md rounded-xl p-6 space-y-4">
        <div>
          <label className="block font-semibold">Name:</label>
          {isEditing ? (
            <input
              type="text"
              className="w-full border rounded p-2 mt-1"
              value={emailTemplate.name}
              onChange={(e) =>
                setEmailTemplate({ ...emailTemplate, name: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-800 mt-1">{emailTemplate.name}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Subject:</label>
          {isEditing ? (
            <input
              type="text"
              className="w-full border rounded p-2 mt-1"
              value={emailTemplate.subject}
              onChange={(e) =>
                setEmailTemplate({ ...emailTemplate, subject: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-800 mt-1">{emailTemplate.subject}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Body:</label>
          {isEditing ? (
            <textarea
              rows={10}
              className="w-full border rounded p-2 mt-1 font-mono bg-gray-50"
              value={emailTemplate.body}
              onChange={(e) =>
                setEmailTemplate({ ...emailTemplate, body: e.target.value })
              }
            />
          ) : (
            <div
              className="prose max-w-none mt-1 bg-gray-50 p-4 rounded"
              dangerouslySetInnerHTML={{ __html: emailTemplate.body }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
