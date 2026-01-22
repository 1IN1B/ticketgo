import { NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { profileSchema } from "@/lib/validations";

export async function PATCH(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = profileSchema.parse(body);

    // Update user name
    await userDb.updateProfile(parseInt(user.id), validatedData.name);

    return NextResponse.json({
      message: "Profile updated successfully",
      name: validatedData.name,
    });
  } catch (error) {
    console.error("Profile update error:", error);

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
