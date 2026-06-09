import { Suspense } from "react";
import StatsGrid from "@/components/dashboard/stats-grid";
import { ticketDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import OrgMemberManagementDialog from "@/components/organizations/org-member-management-dialog";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

async function StatsLoader({ orgId }) {
  const stats = await ticketDb.getStats(orgId);
  return <StatsGrid stats={stats} />;
}

export default async function DashboardPage() {
  const session = await auth();
  const currentOrgId = session?.user?.currentOrgId ? parseInt(session.user.currentOrgId) : null;
  const isOrgAdmin = session?.user?.currentOrgRole === 'ORG_ADMIN';

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {currentOrgId ? (
        <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl border" />
          ))}
        </div>}>
          <StatsLoader orgId={currentOrgId} />
        </Suspense>
      ) : (
        <div className="text-center py-20 bg-muted/50 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Select an organization to view stats.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card p-6 rounded-xl border shadow-sm">
           <h3 className="font-semibold mb-4">Quick Actions</h3>
           <div className="flex flex-wrap gap-4">
             <Link href="/tickets?status=OPEN">
               <Button variant="outline">View Open Tickets</Button>
             </Link>
             <Link href="/tickets">
               <Button variant="outline">Browse All Tickets</Button>
             </Link>
             {isOrgAdmin && currentOrgId && <OrgMemberManagementDialog orgId={currentOrgId} />}
           </div>
        </div>
        <div className="col-span-3 bg-card p-6 rounded-xl border shadow-sm">
           <h3 className="font-semibold mb-2">Support Info</h3>
           <p className="text-sm text-muted-foreground">
             Welcome to the Mini Support Desk. You can track, manage and resolve issues efficiently using this dashboard.
           </p>
        </div>
      </div>
    </div>
  );
}