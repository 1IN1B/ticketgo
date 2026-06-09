import { NextResponse } from "next/server";
import { orgMemberDb } from "@/lib/db";
import { requireOrgAdmin } from "@/lib/auth/session";
import { orgMemberRoleSchema } from "@/lib/validations";

export async function PATCH(request, { params }) {
  try {
    const orgId = parseInt((await params).id);
    const userId = parseInt((await params).userId);
    await requireOrgAdmin(orgId);
    const body = await request.json();

    const validatedData = orgMemberRoleSchema.parse(body);

    const membership = await orgMemberDb.findByOrgAndUser(orgId, userId);
    if (!membership) {
      return NextResponse.json(
        { error: "User is not a member of this organization" },
        { status: 404 },
      );
    }

    await orgMemberDb.updateMemberRole(orgId, userId, validatedData.role);

    const members = await orgMemberDb.getMembers(orgId);

    return NextResponse.json({
      message: "Member role updated successfully",
      members,
    });
  } catch (error) {
    console.error("Update member role error:", error);

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
    const userId = parseInt((await params).userId);
    const admin = await requireOrgAdmin(orgId);

    if (userId === parseInt(admin.id)) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the organization" },
        { status: 400 },
      );
    }

    const membership = await orgMemberDb.findByOrgAndUser(orgId, userId);
    if (!membership) {
      return NextResponse.json(
        { error: "User is not a member of this organization" },
        { status: 404 },
      );
    }

    await orgMemberDb.removeMember(orgId, userId);

    const members = await orgMemberDb.getMembers(orgId);

    return NextResponse.json({
      message: "Member removed successfully",
      members,
    });
  } catch (error) {
    console.error("Remove member error:", error);

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