import { NextResponse } from "next/server";
import { ticketDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { ticketUpdateSchema } from "@/lib/validations";

// GET /api/tickets/[id] - Get ticket details
export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);

    const ticket = ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Non-admin users can only view their own tickets
    if (user.role !== "ADMIN" && ticket.created_by !== parseInt(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Get ticket error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/tickets/[id] - Update ticket
export async function PATCH(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);
    const body = await request.json();

    const ticket = ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Validate input
    const validatedData = ticketUpdateSchema.parse(body);

    // Check permissions
    const isOwner = ticket.created_by === parseInt(user.id);
    const isAdmin = user.role === "ADMIN";

    // Only owner can edit if status is OPEN
    if (isOwner && ticket.status === "OPEN") {
      // Owner can only update title and description
      const allowedUpdates = {
        title: validatedData.title,
        description: validatedData.description,
      };

      ticketDb.update(ticketId, allowedUpdates);
    } else if (isAdmin) {
      // Admin can update everything
      ticketDb.update(ticketId, validatedData);
    } else {
      return NextResponse.json(
        { error: "Forbidden: You cannot edit this ticket" },
        { status: 403 },
      );
    }

    const updatedTicket = ticketDb.findById(ticketId);

    return NextResponse.json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

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

// DELETE /api/tickets/[id] - Delete ticket (admin only)
export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    const ticketId = parseInt((await params).id);
    const ticket = ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    ticketDb.delete(ticketId);

    return NextResponse.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Delete ticket error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
