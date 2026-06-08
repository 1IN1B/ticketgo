import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";
import Link from "next/link";
import { parseDate } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function TicketTable({ tickets }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
        <p className="text-muted-foreground">No tickets found matches your criteria.</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer group">
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{ticket.id}
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/tickets/${ticket.id}`} className="hover:underline text-blue-600 block">
                  {ticket.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell className="text-sm">
                {ticket.created_by_name}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDistanceToNow(parseDate(ticket.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
