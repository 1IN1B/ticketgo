import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import TopNav from "@/components/layout/top-nav";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="h-full relative min-h-screen bg-background">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 bg-sidebar border-r border-sidebar-border">
        <Sidebar />
      </div>
      <main className="md:pl-72 pb-10">
        <TopNav user={session.user} />
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
