import { NextResponse } from "next/server";
import { userDb, db } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { passwordChangeSchema } from "@/lib/validations";

export async function PATCH(request) {
  try {
    const userRole = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = passwordChangeSchema.parse(body);

    // Get full user data including current password
    // Find by ID because we need the hashed password
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(parseInt(userRole.id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(
      validatedData.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 },
      );
    }

    // Hash new password
    const newHashedPassword = await hashPassword(validatedData.newPassword);

    // Update password
    userDb.updatePassword(user.id, newHashedPassword);

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);

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
