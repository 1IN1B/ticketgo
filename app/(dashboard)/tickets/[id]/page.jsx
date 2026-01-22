import { auth } from "@/auth";
import { ticketDb, commentDb, userDb } from "@/lib/db";
import { notFound } from "next/navigation";
import TicketDetails from "@/components/tickets/ticket-details";

export async function generateMetadata({ params }) {
  const ticket = ticketDb.findById(parseInt((await params).id));
  return {
    title: ticket ? `${ticket.title} - TicketGo` : "Ticket Not Found",
  };
}

export default async function TicketDetailPage({ params }) {
  const session = await auth();
  const ticketId = parseInt((await params).id);
  
  const ticket = ticketDb.findById(ticketId);
  
  if (!ticket) {
    notFound();
  }

  // Security check: Non-admins can only see their own tickets
  if (!session || (session.user.role !== 'ADMIN' && ticket.created_by !== parseInt(session.user.id))) {
    notFound(); 
  }

  const initialComments = commentDb.getByTicketId(ticketId);
  const admins = session.user.role === 'ADMIN' ? userDb.getAdmins() : [];

  return (
    <div className="container mx-auto py-6">
      <TicketDetails 
        ticket={ticket} 
        session={session} 
        initialComments={initialComments}
        admins={admins}
      />
    </div>
  );
}
