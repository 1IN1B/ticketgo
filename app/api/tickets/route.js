import { NextResponse } from "next/server";
import { ticketDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { ticketSchema } from "@/lib/validations";

// GET /api/tickets - List all tickets with filters
export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const filters = {
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined,
    };

    // Non-admin users can only see their own tickets
    if (user.role !== "ADMIN") {
      filters.createdBy = parseInt(user.id);
    }

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

// POST /api/tickets - Create a new ticket
export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = ticketSchema.parse(body);

    // Create ticket
    const result = await ticketDb.create(
      validatedData.title,
      validatedData.description,
      validatedData.priority,
      parseInt(user.id),
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
