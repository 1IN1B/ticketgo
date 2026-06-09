"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useOrgStore } from "@/store/org-store";
import { Building2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrgSwitcher() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [isSwitching, setIsSwitching] = useState(false);

  const fetchOrgs = useOrgStore((s) => s.fetchOrgs);
  const orgs = useOrgStore((s) => s.orgs);
  const currentOrgId = useOrgStore((s) => s.currentOrgId);
  const switchOrg = useOrgStore((s) => s.switchOrg);

  const syncSessionToStore = useCallback(() => {
    if (session?.user?.currentOrgId) {
      useOrgStore.setState({
        currentOrgId: parseInt(session.user.currentOrgId),
        currentOrgRole: session.user.currentOrgRole,
      });
    }
  }, [session]);

  useEffect(() => {
    fetchOrgs();
    syncSessionToStore();
  }, [fetchOrgs, syncSessionToStore]);

  const currentOrg = orgs.find((o) => o.id === currentOrgId);

  const handleSwitch = async (orgId) => {
    setIsSwitching(true);
    try {
      const data = await switchOrg(parseInt(orgId));

      await updateSession({
        currentOrgId: data.currentOrgId,
        currentOrgRole: data.currentOrgRole,
      });

      toast.success(`Switched to ${orgs.find((o) => o.id === parseInt(orgId))?.name}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to switch organization");
    } finally {
      setIsSwitching(false);
    }
  };

  if (orgs.length === 0 && !isSwitching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-3 py-2"
      >
        <p className="text-xs text-muted-foreground">No organizations</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-3 py-2"
    >
      <div className="flex items-center gap-2 mb-2 px-2">
        <Building2 className="h-4 w-4 text-primary shrink-0" />
        <span className="text-xs font-medium text-sidebar-foreground/50">Organization</span>
      </div>
      <Select
        value={currentOrgId?.toString() || ""}
        onValueChange={handleSwitch}
        disabled={isSwitching}
      >
        <SelectTrigger className="h-9 rounded-xl text-sm w-full">
          {isSwitching ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Switching...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select org" />
          )}
        </SelectTrigger>
        <SelectContent>
          {orgs.map((org) => (
            <SelectItem key={org.id} value={org.id.toString()}>
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                <span>{org.name}</span>
                {org.user_role === "ORG_ADMIN" && (
                  <span className="text-xs text-muted-foreground">(Admin)</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}