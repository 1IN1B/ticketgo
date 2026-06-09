import { NextResponse } from "next/server";
import { orgMemberDb, userDb } from "@/lib/db";
import { requireOrgAdmin } from "@/lib/auth/session";
import { orgMemberSchema } from "@/lib/validations";

export async function GET(request, { params }) {
  try {
    const orgId = parseInt((await params).id);
    await requireOrgAdmin(orgId);

    const members = await orgMemberDb.getMembers(orgId);

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Get org members error:", error);

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

export async function POST(request, { params }) {
  try {
    const orgId = parseInt((await params).id);
    await requireOrgAdmin(orgId);
    const body = await request.json();

    const validatedData = orgMemberSchema.parse(body);

    const targetUser = await userDb.findByEmail(validatedData.email);
    if (!targetUser) {
      return NextResponse.json(
        { error: "No user found with this email address" },
        { status: 404 },
      );
    }

    const isAlreadyMember = await orgMemberDb.isMember(orgId, targetUser.id);
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "User is already a member of this organization" },
        { status: 400 },
      );
    }

    await orgMemberDb.addMember(orgId, targetUser.id, validatedData.role);

    const members = await orgMemberDb.getMembers(orgId);

    return NextResponse.json(
      { message: "Member added successfully", members },
      { status: 201 },
    );
  } catch (error) {
    console.error("Add org member error:", error);

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