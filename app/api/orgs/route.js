import { NextResponse } from "next/server";
import { orgDb, orgMemberDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { orgSchema } from "@/lib/validations";

export async function GET(request) {
  try {
    const user = await requireAuth();
    const userId = parseInt(user.id);

    const orgs = await orgMemberDb.getOrgsForUser(userId);

    return NextResponse.json({ orgs });
  } catch (error) {
    console.error("Get orgs error:", error);

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
    const userId = parseInt(user.id);
    const body = await request.json();

    const validatedData = orgSchema.parse(body);

    const existingOrg = await orgDb.findBySlug(validatedData.slug);
    if (existingOrg) {
      return NextResponse.json(
        { error: "An organization with this slug already exists" },
        { status: 400 },
      );
    }

    const result = await orgDb.create(
      validatedData.name,
      validatedData.slug,
      validatedData.description,
    );

    await orgMemberDb.addMember(result.lastInsertRowid, userId, "ORG_ADMIN");

    const org = await orgDb.findById(result.lastInsertRowid);

    return NextResponse.json(
      { message: "Organization created successfully", org },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create org error:", error);

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