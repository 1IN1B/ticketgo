"use client";

import { useState } from "react";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";
import CommentThread from "./comment-thread";
import CommentForm from "./comment-form";
import TicketAdminControls from "./ticket-admin-controls";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2, Calendar, User, Mail, Hash, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { parseDate } from "@/lib/utils";

export default function TicketDetails({ ticket, session, initialComments, admins }) {
  const [comments, setComments] = useState(initialComments || []);
  const isAdmin = session?.user?.role === 'ADMIN';
  const isOwner = session?.user?.id && (String(session.user.id) === String(ticket.created_by));
  const canEdit = isOwner && ticket.status === 'OPEN';

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Ticket Info (Full width on mobile, 2/3 on desktop) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="bg-slate-50/50 pb-6">
            <div className="flex justify-between items-start gap-4 mb-4">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                   <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5 h-5">
                     #{ticket.id}
                   </Badge>
                   <StatusBadge status={ticket.status} />
                   <PriorityBadge priority={ticket.priority} />
                 </div>
                 <CardTitle className="text-2xl font-bold leading-tight">
                   {ticket.title}
                 </CardTitle>
               </div>
               {canEdit && (
                 <Button variant="outline" size="sm">
                   <Edit2 className="h-4 w-4 mr-2" />
                   Edit
                 </Button>
               )}
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground mt-4">
               <div className="flex items-center gap-1.5">
                 <User className="h-4 w-4" />
                 <span>{ticket.created_by_name}</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <Calendar className="h-4 w-4" />
                 <span>{format(parseDate(ticket.created_at), "PPP")}</span>
               </div>
               {ticket.assigned_to_name && (
                 <div className="flex items-center gap-1.5">
                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   <span>Assigned to {ticket.assigned_to_name}</span>
                 </div>
               )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 px-1">
            Activity
            <Badge variant="secondary" className="rounded-full h-5 px-1.5 min-w-[20px] justify-center text-[10px]">
              {comments.length}
            </Badge>
          </h3>
          <CommentThread comments={comments} currentUserId={session?.user?.id} />
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-4">Add a Reply</h4>
            <CommentForm ticketId={ticket.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </div>

      {/* Right Column: Metadata & Controls (Stack on mobile, sidebar on desktop) */}
      <div className="space-y-6">
        {isAdmin && (
          <Card className="shadow-sm border-amber-200 bg-amber-50/10">
            <CardHeader className="pb-3 border-b border-amber-100 mb-4 bg-amber-50/30">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-800">Admin Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketAdminControls ticket={ticket} admins={admins} />
            </CardContent>
          </Card>
        )}

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b mb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Requester</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{ticket.created_by_name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {ticket.created_by_email}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Requested At</span>
              <p className="text-sm">{format(parseDate(ticket.created_at), "PPPP p")}</p>
            </div>

            <Separator />
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Identifier</span>
              <p className="text-sm font-mono flex items-center gap-1.5">
                <Hash className="h-3 w-3" /> TICKET-{ticket.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
