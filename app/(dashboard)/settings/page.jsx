import { auth } from "@/auth";
import SettingsForm from "@/components/settings/settings-form";
import { SettingsHeader } from "@/components/settings/settings-header";

export const metadata = {
  title: "Settings - TicketGo",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <SettingsForm user={session.user} />
    </div>
  );
}
