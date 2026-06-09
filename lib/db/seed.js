import { connect } from "@tursodatabase/serverless";
import { hashPassword } from "../auth/password.js";
import { readFileSync } from "fs";
import { join } from "path";

const conn = connect({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
  console.log("Seeding database...");

  // Drop old tables first to handle schema changes
  await conn.execute("DROP TABLE IF EXISTS comments");
  await conn.execute("DROP TABLE IF EXISTS tickets");
  await conn.execute("DROP TABLE IF EXISTS organization_members");
  await conn.execute("DROP TABLE IF EXISTS organizations");
  await conn.execute("DROP TABLE IF EXISTS users");
  await conn.execute("DROP INDEX IF EXISTS idx_tickets_created_by");
  await conn.execute("DROP INDEX IF EXISTS idx_tickets_assigned_to");
  await conn.execute("DROP INDEX IF EXISTS idx_tickets_status");
  await conn.execute("DROP INDEX IF EXISTS idx_comments_ticket_id");

  const schema = readFileSync(
    join(process.cwd(), "lib/db/schema.sql"),
    "utf-8",
  );
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await conn.execute(statement);
  }

  // Clean up
  await conn.execute("DELETE FROM comments");
  await conn.execute("DELETE FROM tickets");
  await conn.execute("DELETE FROM organization_members");
  await conn.execute("DELETE FROM organizations");
  await conn.execute("DELETE FROM users");

  // Create Users
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const adminResult = await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    ["Admin User", "admin@example.com", adminPassword],
  );
  const adminId = Number(adminResult.lastInsertRowid);

  const user1Result = await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    ["John Doe", "john@example.com", userPassword],
  );
  const user1Id = Number(user1Result.lastInsertRowid);

  const user2Result = await conn.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    ["Jane Smith", "jane@example.com", userPassword],
  );
  const user2Id = Number(user2Result.lastInsertRowid);

  // Create Default Organization
  const orgResult = await conn.execute(
    "INSERT INTO organizations (name, slug, description) VALUES (?, ?, ?)",
    ["TicketGo Default", "ticketgo-default", "Default organization for TicketGo support desk"],
  );
  const orgId = Number(orgResult.lastInsertRowid);

  // Add users to organization
  await conn.execute(
    "INSERT INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)",
    [orgId, adminId, "ORG_ADMIN"],
  );
  await conn.execute(
    "INSERT INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)",
    [orgId, user1Id, "ORG_MEMBER"],
  );
  await conn.execute(
    "INSERT INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)",
    [orgId, user2Id, "ORG_MEMBER"],
  );

  // Create Tickets (now with org_id)
  const ticket1Result = await conn.execute(
    "INSERT INTO tickets (title, description, priority, status, org_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      "Cannot access dashboard",
      "I get a 404 error whenever I try to access the dashboard page. Please help!",
      "HIGH",
      "OPEN",
      orgId,
      user1Id,
      null,
    ],
  );
  const ticket1Id = Number(ticket1Result.lastInsertRowid);

  const ticket2Result = await conn.execute(
    "INSERT INTO tickets (title, description, priority, status, org_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      "Billing inquiry",
      "I was charged twice for my subscription this month.",
      "MEDIUM",
      "IN_PROGRESS",
      orgId,
      user2Id,
      adminId,
    ],
  );
  const ticket2Id = Number(ticket2Result.lastInsertRowid);

  const ticket3Result = await conn.execute(
    "INSERT INTO tickets (title, description, priority, status, org_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      "Update email address",
      "I want to change my primary email to john.new@example.com",
      "LOW",
      "RESOLVED",
      orgId,
      user1Id,
      null,
    ],
  );
  const ticket3Id = Number(ticket3Result.lastInsertRowid);

  // Set resolved_at for ticket3
  await conn.execute(
    "UPDATE tickets SET resolved_at = ? WHERE id = ?",
    [new Date(Date.now() - 86400000).toISOString(), ticket3Id],
  );

  // Create Comments
  await conn.execute(
    "INSERT INTO comments (ticket_id, user_id, content) VALUES (?, ?, ?)",
    [
      ticket2Id,
      adminId,
      "I am looking into this right now. Could you provide a screenshot of the charges?",
    ],
  );

  await conn.execute(
    "INSERT INTO comments (ticket_id, user_id, content) VALUES (?, ?, ?)",
    [ticket2Id, user2Id, "Sure, sending it over in a moment."],
  );

  console.log("Database seeded successfully!");
  console.log("Admin account: admin@example.com / admin123 (ORG_ADMIN)");
  console.log("User account: john@example.com / user123 (ORG_MEMBER)");
  console.log("User account: jane@example.com / user123 (ORG_MEMBER)");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});