"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, CheckCircle, AlertTriangle } from "lucide-react";

export default function TicketAdminControls({ ticket, orgAdmins }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTicket = async (updates) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update ticket");
      
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Status & Priority
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select 
              value={ticket.status} 
              onValueChange={(v) => updateTicket({ status: v })}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Priority</label>
            <Select 
              value={ticket.priority} 
              onValueChange={(v) => updateTicket({ priority: v })}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-blue-500" />
          Assignment
        </h4>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Assigned To</label>
          <Select 
             value={ticket.assigned_to?.toString() || "null"} 
             onValueChange={(v) => updateTicket({ assigned_to: v === "null" ? null : parseInt(v) })}
             disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Unassigned</SelectItem>
              {orgAdmins?.map((admin) => (
                <SelectItem key={admin.id} value={admin.id.toString()}>
                  {admin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isUpdating && (
        <div className="flex items-center justify-center p-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
          Saving changes...
        </div>
      )}
    </div>
  );
}