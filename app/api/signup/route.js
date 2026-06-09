import { NextResponse } from "next/server";
import { userDb, orgMemberDb, orgDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/validations";

export async function POST(request) {
  try {
    const body = await request.json();

    const validatedData = signupSchema.parse(body);

    const existingUser = await userDb.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const result = await userDb.create(
      validatedData.email,
      hashedPassword,
      validatedData.name,
    );

    const defaultOrg = await orgDb.findBySlug("ticketgo-default");
    if (defaultOrg) {
      await orgMemberDb.addMember(defaultOrg.id, result.lastInsertRowid, "ORG_MEMBER");
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.lastInsertRowid,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

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