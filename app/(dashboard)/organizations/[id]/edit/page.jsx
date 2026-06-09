"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import OrgForm from "@/components/organizations/org-form";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

export default function EditOrgPage({ params }) {
  const { id } = use(params);
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const orgId = parseInt(id);

  useEffect(() => {
    async function fetchOrg() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orgs/${orgId}`);
        if (!response.ok) {
          setOrg(null);
          return;
        }
        const data = await response.json();
        setOrg(data.org);
      } catch (error) {
        console.error("Failed to fetch org:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrg();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 bg-muted/50 rounded-xl border border-dashed"
      >
        <p className="text-muted-foreground">{"Organization not found or you don't have access."}</p>
      </motion.div>
    );
  }

  return (
    <div className="py-6">
      <OrgForm initialData={org} />
    </div>
  );
}