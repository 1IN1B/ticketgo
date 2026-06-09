"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Edit2, Pencil } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function OrgDetailHeader({ org, isOrgAdmin }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start justify-between gap-4"
    >
      <div className="flex items-start gap-4 min-w-0">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{org.name}</h2>
            <Badge
              variant={isOrgAdmin ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0 h-4 shrink-0 uppercase font-bold"
            >
              {isOrgAdmin ? "Admin" : "Member"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{org.slug}</p>
          {org.description && (
            <p className="text-sm text-muted-foreground mt-1">{org.description}</p>
          )}
        </div>
      </div>
      {isOrgAdmin && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href={`/organizations/${org.id}/edit`}>
            <Button variant="outline" size="sm" className="shrink-0">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}