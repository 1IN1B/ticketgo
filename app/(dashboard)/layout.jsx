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
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-slate-900">
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
