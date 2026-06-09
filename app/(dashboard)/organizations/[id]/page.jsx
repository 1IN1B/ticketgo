"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import OrgDetailHeader from "@/components/organizations/org-detail-header";
import OrgMemberList from "@/components/organizations/org-member-list";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, Users, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function OrgDetailPage({ params }) {
  const router = useRouter();
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
          router.push("/organizations");
          return;
        }
        const data = await response.json();
        setOrg(data.org);
      } catch (error) {
        console.error("Failed to fetch org:", error);
        router.push("/organizations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrg();
  }, [orgId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading organization...</p>
      </div>
    );
  }

  if (!org) return null;

  const isOrgAdmin = org.userRole === "ORG_ADMIN";

  return (
    <div className="space-y-8">
      <OrgDetailHeader org={org} isOrgAdmin={isOrgAdmin} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                <Ticket className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{org.ticketCount || 0}</p>
                <p className="text-xs text-muted-foreground">Total Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{org.memberCount || 0}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="sm:col-span-2 lg:col-span-1"
        >
          <Link href="/tickets">
            <Card className="border-none shadow-sm ring-1 ring-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/15 transition-colors duration-200">
                    <ArrowRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="font-medium text-sm">View Tickets</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      <OrgMemberList orgId={orgId} isOrgAdmin={isOrgAdmin} />
    </div>
  );
}