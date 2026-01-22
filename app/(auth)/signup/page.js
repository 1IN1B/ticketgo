import SignupForm from "@/components/auth/signup-form";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SignupForm />
    </div>
  );
}
