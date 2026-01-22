import { NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/users - Get list of potential assignees (Admins)
export async function GET(request) {
  try {
    await requireAuth();

    // Only fetch admins as they are the ones who can handle tickets
    const admins = userDb.getAdmins();

    return NextResponse.json({ users: admins });
  } catch (error) {
    console.error("Get users error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
