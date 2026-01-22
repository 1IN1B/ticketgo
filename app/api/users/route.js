import { NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/users - Get list of potential assignees (Admins)
export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    if (mode === "all" && user.role === "ADMIN") {
      const allUsers = await userDb.getAll();
      return NextResponse.json({ users: allUsers });
    }

    // Default: fetch admins for assignee lists
    const admins = await userDb.getAdmins();
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
