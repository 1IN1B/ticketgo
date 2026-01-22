import { Database } from "bun:sqlite";
import { hashPassword } from "../auth/password.js";
import { readFileSync } from "fs";
import { join } from "path";

const dbPath = join(process.cwd(), "ticketgo.db");
const db = new Database(dbPath);

async function seed() {
  console.log("Seeding database...");

  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON");

  // Initialize schema first
  const schema = readFileSync(
    join(process.cwd(), "lib/db/schema.sql"),
    "utf-8",
  );
  db.run(schema);

  // Clean up
  db.run("DELETE FROM comments");
  db.run("DELETE FROM tickets");
  db.run("DELETE FROM users");

  // Create Users
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const adminStmt = db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id",
  );
  const adminResult = adminStmt.get(
    "Admin User",
    "admin@example.com",
    adminPassword,
    "ADMIN",
  );
  const adminId = adminResult.id;

  const userStmt = db.prepare(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id",
  );
  const user1Result = userStmt.get(
    "John Doe",
    "john@example.com",
    userPassword,
    "USER",
  );
  const user2Result = userStmt.get(
    "Jane Smith",
    "jane@example.com",
    userPassword,
    "USER",
  );
  const user1Id = user1Result.id;
  const user2Id = user2Result.id;

  // Create Tickets
  const ticketStmt = db.prepare(`
    INSERT INTO tickets (title, description, priority, status, created_by, assigned_to) 
    VALUES (?, ?, ?, ?, ?, ?) RETURNING id
  `);

  const ticket1Result = ticketStmt.get(
    "Cannot access dashboard",
    "I get a 404 error whenever I try to access the dashboard page. Please help!",
    "HIGH",
    "OPEN",
    user1Id,
    null,
  );
  const ticket1Id = ticket1Result.id;

  const ticket2Result = ticketStmt.get(
    "Billing inquiry",
    "I was charged twice for my subscription this month.",
    "MEDIUM",
    "IN_PROGRESS",
    user2Id,
    adminId,
  );
  const ticket2Id = ticket2Result.id;

  const ticket3Result = ticketStmt.get(
    "Update email address",
    "I want to change my primary email to john.new@example.com",
    "LOW",
    "RESOLVED",
    user1Id,
    null,
  );
  const ticket3Id = ticket3Result.id;

  // Manual update for resolved_at
  db.run("UPDATE tickets SET resolved_at = ? WHERE id = ?", [
    new Date(Date.now() - 86400000).toISOString(),
    ticket3Id,
  ]);

  // Create Comments
  const commentStmt = db.prepare(`
    INSERT INTO comments (ticket_id, user_id, content) 
    VALUES (?, ?, ?)
  `);

  commentStmt.run(
    ticket2Id,
    adminId,
    "I am looking into this right now. Could you provide a screenshot of the charges?",
  );
  commentStmt.run(ticket2Id, user2Id, "Sure, sending it over in a moment.");

  console.log("Database seeded successfully!");
  console.log("Admin account: admin@example.com / admin123");
  console.log("User account: john@example.com / user123");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
