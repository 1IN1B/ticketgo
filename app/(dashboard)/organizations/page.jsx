"use client";

import { useState, useEffect } from "react";
import OrgCard, { containerVariants } from "@/components/organizations/org-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrgs() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/orgs");
        const data = await response.json();
        setOrgs(data.orgs || []);
      } catch (error) {
        console.error("Failed to fetch orgs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrgs();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">
            Manage your organizations and team memberships.
          </p>
        </div>
        <Link href="/organizations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-2"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading organizations...</p>
        </motion.div>
      ) : orgs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-20 bg-muted/50 rounded-xl border border-dashed"
        >
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">You are not part of any organization yet.</p>
          <Link href="/organizations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Organization
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {orgs.map((org, index) => (
            <OrgCard key={org.id} org={org} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}