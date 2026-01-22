import TicketForm from "@/components/tickets/ticket-form";

export const metadata = {
  title: "New Ticket - TicketGo",
};

export default function NewTicketPage() {
  return (
    <div className="py-6">
      <TicketForm />
    </div>
  );
}
