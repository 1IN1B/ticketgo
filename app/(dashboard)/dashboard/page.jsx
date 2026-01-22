import { Suspense } from "react";
import StatsGrid from "@/components/dashboard/stats-grid";
import { ticketDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import UserManagementDialog from "@/components/dashboard/user-management-dialog";

async function StatsLoader() {
  const stats = await ticketDb.getStats();
  return <StatsGrid stats={stats} />;
}

export default async function DashboardPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
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
      </div>

      <Suspense fallback={<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg border" />
        ))}
      </div>}>
        <StatsLoader />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-white p-6 rounded-lg border shadow-sm">
           <h3 className="font-semibold mb-4">Quick Actions</h3>
           <div className="flex flex-wrap gap-4">
             <Link href="/tickets?status=OPEN">
               <Button variant="outline">View Open Tickets</Button>
             </Link>
             <Link href="/tickets">
               <Button variant="outline">Browse All Tickets</Button>
             </Link>
             {isAdmin && <UserManagementDialog />}
           </div>
        </div>
        <div className="col-span-3 bg-white p-6 rounded-lg border shadow-sm">
           <h3 className="font-semibold mb-2">Support Info</h3>
           <p className="text-sm text-muted-foreground">
             Welcome to the Mini Support Desk. You can track, manage and resolve issues efficiently using this dashboard.
           </p>
        </div>
      </div>
    </div>
  );
}
