"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

export default function CommentForm({ ticketId, onCommentAdded }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(commentSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to post comment");
      
      const result = await response.json();
      reset();
      if (onCommentAdded) onCommentAdded(result.comment);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Add a comment or internal note..."
          className="min-h-[100px] resize-none pr-12"
          {...register("content")}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 bottom-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      {errors.content && (
        <p className="text-xs text-red-500">{errors.content.message}</p>
      )}
    </form>
  );
}
