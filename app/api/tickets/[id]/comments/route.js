import { NextResponse } from "next/server";
import { commentDb, ticketDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { commentSchema } from "@/lib/validations";

// GET /api/tickets/[id]/comments - Get all comments for a ticket
export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);

    const ticket = ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Non-admin users can only view comments on their own tickets
    if (user.role !== "ADMIN" && ticket.created_by !== parseInt(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const comments = commentDb.getByTicketId(ticketId);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Get comments error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/tickets/[id]/comments - Add a comment to a ticket
export async function POST(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);
    const body = await request.json();

    const ticket = ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Non-admin users can only comment on their own tickets
    if (user.role !== "ADMIN" && ticket.created_by !== parseInt(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Validate input
    const validatedData = commentSchema.parse(body);

    // Create comment
    const result = commentDb.create(
      ticketId,
      parseInt(user.id),
      validatedData.content,
    );

    const comments = commentDb.getByTicketId(ticketId);
    const newComment = comments.find((c) => c.id === result.lastInsertRowid);

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create comment error:", error);

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
