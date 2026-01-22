import { auth } from "@/auth";
import SettingsForm from "@/components/settings/settings-form";

export const metadata = {
  title: "Settings - TicketGo",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account profile and security preferences.
        </p>
      </div>
      
      <SettingsForm user={session.user} />
    </div>
  );
}
