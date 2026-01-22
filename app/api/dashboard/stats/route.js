import { NextResponse } from "next/server";
import { ticketDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";

// GET /api/dashboard/stats - Get dashboard metrics
export async function GET(request) {
  try {
    const user = await requireAuth();

    // Stats are currently global, but we could filter by user if needed
    // For now, let's return global stats for everyone, but typically
    // normal users might only see their own stats.

    const stats = await ticketDb.getStats();

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
