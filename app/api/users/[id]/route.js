import { NextResponse } from "next/server";
import { userDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId) {
      return NextResponse.json(
        { error: "Forbidden: Organization context required" },
        { status: 403 },
      );
    }

    const isOrgAdmin = await orgMemberDb.isOrgAdmin(currentOrgId, parseInt(user.id));

    if (!isOrgAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Organization admin access required" },
        { status: 403 },
      );
    }

    const targetUserId = parseInt((await params).id);

    if (targetUserId === parseInt(user.id)) {
      return NextResponse.json(
        { error: "You cannot delete your own account from the user management tool." },
        { status: 400 },
      );
    }

    await orgMemberDb.removeMember(currentOrgId, targetUserId);
    await userDb.delete(targetUserId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin user deletion error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}