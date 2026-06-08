import SignupForm from "@/components/auth/signup-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign Up - TicketGo",
  description: "Create a new account",
};

export default async function SignupPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
}
