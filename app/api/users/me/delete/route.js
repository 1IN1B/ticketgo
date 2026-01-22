import { NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { accountDeletionSchema } from "@/lib/validations";

export async function DELETE(request) {
  try {
    const userSession = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = accountDeletionSchema.parse(body);

    // Confirmation check
    if (validatedData.confirmEmail !== userSession.email) {
      return NextResponse.json(
        { error: "Email confirmation does not match your account email" },
        { status: 400 },
      );
    }

    // Delete account
    userDb.delete(parseInt(userSession.id));

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
