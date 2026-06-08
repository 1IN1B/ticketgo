import LoginForm from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
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
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  );
}
