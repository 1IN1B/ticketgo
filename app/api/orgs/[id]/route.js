import { NextResponse } from "next/server";
import { orgDb, orgMemberDb } from "@/lib/db";
import { requireOrgMember, requireOrgAdmin } from "@/lib/auth/session";
import { orgUpdateSchema } from "@/lib/validations";

export async function GET(request, { params }) {
  try {
    const orgId = parseInt((await params).id);
    const user = await requireOrgMember(orgId);

    const org = await orgDb.findById(orgId);

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const memberCount = await orgDb.getMemberCount(orgId);
    const ticketCount = await orgDb.getTicketCount(orgId);

    const memberRecord = await orgMemberDb.findByOrgAndUser(orgId, parseInt(user.id));

    return NextResponse.json({
      org: {
        ...org,
        memberCount,
        ticketCount,
        userRole: memberRecord?.role,
      },
    });
  } catch (error) {
    console.error("Get org error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const orgId = parseInt((await params).id);
    await requireOrgAdmin(orgId);
    const body = await request.json();

    const validatedData = orgUpdateSchema.parse(body);

    if (validatedData.slug) {
      const existingOrg = await orgDb.findBySlug(validatedData.slug);
      if (existingOrg && existingOrg.id !== orgId) {
        return NextResponse.json(
          { error: "An organization with this slug already exists" },
          { status: 400 },
        );
      }
    }

    await orgDb.update(orgId, validatedData);

    const org = await orgDb.findById(orgId);

    return NextResponse.json({
      message: "Organization updated successfully",
      org,
    });
  } catch (error) {
    console.error("Update org error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
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
    const orgId = parseInt((await params).id);
    await requireOrgAdmin(orgId);

    const org = await orgDb.findById(orgId);
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    await orgDb.delete(orgId);

    return NextResponse.json({
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Delete org error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}