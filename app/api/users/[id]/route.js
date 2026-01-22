import { NextResponse } from "next/server";
import { userDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";

export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin();
    const targetUserId = parseInt((await params).id);

    // Prevent self-deletion via this admin management tool
    // (they can use settings for that)
    if (targetUserId === parseInt(admin.id)) {
      return NextResponse.json(
        {
          error:
            "You cannot delete your own account from the user management tool.",
        },
        { status: 400 },
      );
    }

    userDb.delete(targetUserId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin user deletion error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
