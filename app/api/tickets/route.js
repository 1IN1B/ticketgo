import { NextResponse } from "next/server";
import { ticketDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { ticketSchema } from "@/lib/validations";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId) {
      return NextResponse.json({ tickets: [] });
    }

    const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(user.id));
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const filters = {
      orgId: currentOrgId,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const tickets = await ticketDb.getAll(filters);

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Get tickets error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId) {
      return NextResponse.json(
        { error: "You must be in an organization to create tickets" },
        { status: 400 },
      );
    }

    const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(user.id));
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validatedData = ticketSchema.parse(body);

    const result = await ticketDb.create(
      validatedData.title,
      validatedData.description,
      validatedData.priority,
      parseInt(user.id),
      currentOrgId,
    );

    const ticket = await ticketDb.findById(result.lastInsertRowid);

    return NextResponse.json(
      { message: "Ticket created successfully", ticket },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create ticket error:", error);

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