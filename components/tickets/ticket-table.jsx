"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";
import Link from "next/link";
import { parseDate } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

export default function TicketTable({ tickets }) {
  if (tickets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-20 bg-muted/50 rounded-xl border border-dashed"
      >
        <p className="text-muted-foreground">No tickets found matches your criteria.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden md:block rounded-xl border overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket, index) => (
            <motion.tr
              key={ticket.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-border/50 transition-colors hover:bg-muted/30 cursor-pointer group"
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{ticket.id}
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/tickets/${ticket.id}`} className="hover:underline text-primary block transition-colors">
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
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
