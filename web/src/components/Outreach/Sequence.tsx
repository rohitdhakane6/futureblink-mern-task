import SequenceFlow from "@/components/SequenceFlow";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Sequence() {
  const { id } = useParams();
  const [sequence, setSequence] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSequence = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await axios.get(`/sequence/${id}`);
        setSequence(response.data);
      } catch (error) {
        setError("Failed to fetch sequence");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSequence();
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

  return (
    <div className="flex flex-col gap-2 container mx-auto p-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {sequence?.name || "Untitled Sequence"}
          </h1>
          <p>Click on a block to configure and add it in sequence.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save As Draft</Button>
          <Button>Save and Publish</Button>
        </div>
      </div>
      <div>
        <SequenceFlow/>
      </div>
    </div>
  );
}
