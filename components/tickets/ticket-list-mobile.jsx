import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { parseDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function TicketListMobile({ tickets }) {
  if (tickets.length === 0) return null;

  return (
    <div className="grid gap-4 md:hidden">
      {tickets.map((ticket) => (
        <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
          <Card className="active:scale-[0.98] transition-transform">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-muted-foreground">#{ticket.id}</span>
                <div className="flex gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
              <CardTitle className="text-base line-clamp-1">{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between items-end">
                <div className="text-xs text-muted-foreground">
                  <p>By {ticket.created_by_name}</p>
                  <p>{formatDistanceToNow(parseDate(ticket.created_at), { addSuffix: true })}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
