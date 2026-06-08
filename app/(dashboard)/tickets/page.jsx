"use client";

import { useEffect, useState } from "react";
import TicketFilters from "@/components/tickets/ticket-filters";
import TicketTable from "@/components/tickets/ticket-table";
import TicketListMobile from "@/components/tickets/ticket-list-mobile";
import { useTicketStore } from "@/store/ticket-store";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    searchQuery, statusFilter, priorityFilter,
    currentPage, itemsPerPage, setCurrentPage
  } = useTicketStore();

  useEffect(() => {
    async function fetchTickets() {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter !== 'ALL') queryParams.append('status', statusFilter);
        if (priorityFilter !== 'ALL') queryParams.append('priority', priorityFilter);
        if (searchQuery) queryParams.append('search', searchQuery);

        const response = await fetch(`/api/tickets?${queryParams.toString()}`);
        const data = await response.json();
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, [searchQuery, statusFilter, priorityFilter]);

  // Client-side pagination logic
  const totalItems = tickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
          <p className="text-muted-foreground">
            Manage and track all support requests.
          </p>
        </div>
        <Link href="/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </motion.div>

      <TicketFilters />

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-2"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading tickets...</p>
        </motion.div>
      ) : (
        <>
          <TicketTable tickets={paginatedTickets} />
          <TicketListMobile tickets={paginatedTickets} />

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between border-t pt-4 mt-6"
            >
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} tickets
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
