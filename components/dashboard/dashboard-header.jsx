"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "motion/react";

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between"
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your support tickets and metrics.
        </p>
      </div>
      <Link href="/tickets/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </Link>
    </motion.div>
  );
}
