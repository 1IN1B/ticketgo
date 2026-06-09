import { auth } from "@/auth";
import { ticketDb, commentDb, userDb, orgMemberDb } from "@/lib/db";
import { notFound } from "next/navigation";
import TicketDetails from "@/components/tickets/ticket-details";

export async function generateMetadata({ params }) {
  const ticket = await ticketDb.findById(parseInt((await params).id));
  return {
    title: ticket ? `${ticket.title} - TicketGo` : "Ticket Not Found",
  };
}

export default async function TicketDetailPage({ params }) {
  const session = await auth();
  const ticketId = parseInt((await params).id);
  
  const ticket = await ticketDb.findById(ticketId);
  
  if (!ticket) {
    notFound();
  }

  const currentOrgId = session?.user?.currentOrgId ? parseInt(session.user.currentOrgId) : null;

  if (!session || !currentOrgId || ticket.org_id !== currentOrgId) {
    notFound();
  }

  const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(session.user.id));
  if (!isMember) {
    notFound();
  }

  const initialComments = await commentDb.getByTicketId(ticketId, currentOrgId);
  const orgAdmins = session.user.currentOrgRole === 'ORG_ADMIN' ? await userDb.getOrgAdmins(currentOrgId) : [];

  return (
    <div className="container mx-auto py-6">
      <TicketDetails 
        ticket={ticket} 
        session={session} 
        initialComments={initialComments}
        orgAdmins={orgAdmins}
      />
    </div>
  );
}