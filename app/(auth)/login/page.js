import LoginForm from "@/components/auth/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login - TicketGo",
  description: "Login to your account",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  );
}
