import { NextResponse } from "next/server";
import { commentDb, ticketDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { commentSchema } from "@/lib/validations";

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

    const comments = await commentDb.getByTicketId(ticketId, currentOrgId);

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

export async function POST(request, { params }) {
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

    const isMember = await orgMemberDb.isMember(currentOrgId, parseInt(user.id));
    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validatedData = commentSchema.parse(body);

    const result = await commentDb.create(
      ticketId,
      parseInt(user.id),
      validatedData.content,
    );

    const comments = await commentDb.getByTicketId(ticketId, currentOrgId);
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