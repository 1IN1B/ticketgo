import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { orgMemberDb } from "@/lib/db";

export async function POST(request) {
  try {
    const user = await requireAuth();
    const userId = parseInt(user.id);
    const body = await request.json();

    const orgId = parseInt(body.orgId);

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 },
      );
    }

    const membership = await orgMemberDb.findByOrgAndUser(orgId, userId);
    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this organization" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      currentOrgId: orgId.toString(),
      currentOrgRole: membership.role,
    });
  } catch (error) {
    console.error("Switch org error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}