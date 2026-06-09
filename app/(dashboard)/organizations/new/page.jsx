import OrgForm from "@/components/organizations/org-form";

export const metadata = {
  title: "New Organization - TicketGo",
};

export default function NewOrgPage() {
  return (
    <div className="py-6">
      <OrgForm />
    </div>
  );
}