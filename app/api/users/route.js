import { NextResponse } from "next/server";
import { userDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");
    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (mode === "org-members" && currentOrgId) {
      const isOrgAdmin = await orgMemberDb.isOrgAdmin(currentOrgId, parseInt(user.id));
      if (isOrgAdmin) {
        const allUsers = await userDb.getAll();
        return NextResponse.json({ users: allUsers });
      }
    }

    if (currentOrgId) {
      const orgAdmins = await userDb.getOrgAdmins(currentOrgId);
      return NextResponse.json({ users: orgAdmins });
    }

    return NextResponse.json({ users: [] });
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