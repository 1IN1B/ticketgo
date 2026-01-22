import { NextResponse } from "next/server";
import { userDb, initializeDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { signupSchema } from "@/lib/validations";

// Initialize database on first run
// Database should be initialized via migration scripts or manual setup in MySQL
// try {
//   await initializeDatabase();
// } catch (error) {
//   console.log("Database already initialized");
// }

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await userDb.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const result = await userDb.create(
      validatedData.email,
      hashedPassword,
      validatedData.name,
      validatedData.role,
    );

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
