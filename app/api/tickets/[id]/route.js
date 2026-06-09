import { NextResponse } from "next/server";
import { ticketDb, orgMemberDb, userDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { ticketUpdateSchema } from "@/lib/validations";

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);

    const ticket = await ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId || ticket.org_id !== currentOrgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(user.id));
    if (!isMember) {
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

export async function PATCH(request, { params }) {
  try {
    const user = await requireAuth();
    const ticketId = parseInt((await params).id);
    const body = await request.json();

    const ticket = await ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const currentOrgId = user.currentOrgId ? parseInt(user.currentOrgId) : null;

    if (!currentOrgId || ticket.org_id !== currentOrgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validatedData = ticketUpdateSchema.parse(body);

    const isOrgAdmin = await orgMemberDb.isOrgAdmin(currentOrgId, parseInt(user.id));
    const isOwner = ticket.created_by === parseInt(user.id);

    if (isOwner && ticket.status === "OPEN") {
      const allowedUpdates = {
        title: validatedData.title,
        description: validatedData.description,
      };

      await ticketDb.update(ticketId, allowedUpdates);
    } else if (isOrgAdmin) {
      await ticketDb.update(ticketId, validatedData);
    } else {
      return NextResponse.json(
        { error: "Forbidden: You cannot edit this ticket" },
        { status: 403 },
      );
    }

    const updatedTicket = await ticketDb.findById(ticketId);

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

    const ticketId = parseInt((await params).id);
    const ticket = await ticketDb.findById(ticketId);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.org_id !== currentOrgId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ticketDb.delete(ticketId);

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