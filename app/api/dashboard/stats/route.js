import { NextResponse } from "next/server";
import { ticketDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

export async function GET(request) {
  try {
    const user = await requireAuth();

    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId) {
      return NextResponse.json({ stats: { total: 0, byStatus: {}, avgResolutionHours: 0 } });
    }

    const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(user.id));
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = await ticketDb.getStats(currentOrgId);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}