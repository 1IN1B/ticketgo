import { Database } from "bun:sqlite";
import { readFileSync } from "fs";
import { join } from "path";

const dbPath = join(process.cwd(), "ticketgo.db");
const db = new Database(dbPath);

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");

// Initialize database with schema
export function initializeDatabase() {
  const schema = readFileSync(
    join(process.cwd(), "lib/db/schema.sql"),
    "utf-8",
  );
  db.run(schema);
  console.log("Database initialized successfully");
}

// User operations
export const userDb = {
  create: (email, password, name, role = "USER") => {
    const stmt = db.prepare(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?) RETURNING id",
    );
    const result = stmt.get(email, password, name, role);
    return { lastInsertRowid: result.id };
  },

  findByEmail: (email) => {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare(
      "SELECT id, email, name, role, created_at FROM users WHERE id = ?",
    );
    return stmt.get(id);
  },

  getAdmins: () => {
    const stmt = db.prepare("SELECT id, email, name FROM users WHERE role = ?");
    return stmt.all("ADMIN");
  },

  getAll: () => {
    const stmt = db.prepare(
      "SELECT id, email, name, role, created_at FROM users",
    );
    return stmt.all();
  },
};

// Ticket operations
export const ticketDb = {
  create: (title, description, priority, createdBy) => {
    const stmt = db.prepare(
      "INSERT INTO tickets (title, description, priority, created_by) VALUES (?, ?, ?, ?) RETURNING id",
    );
    const result = stmt.get(title, description, priority, createdBy);
    return { lastInsertRowid: result.id };
  },

  findById: (id) => {
    const stmt = db.prepare(`
      SELECT 
        t.*,
        u1.name as created_by_name,
        u1.email as created_by_email,
        u2.name as assigned_to_name,
        u2.email as assigned_to_email
      FROM tickets t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE t.id = ?
    `);
    return stmt.get(id);
  },

  getAll: (filters = {}) => {
    let query = `
      SELECT 
        t.*,
        u1.name as created_by_name,
        u2.name as assigned_to_name
      FROM tickets t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += " AND t.status = ?";
      params.push(filters.status);
    }

    if (filters.priority) {
      query += " AND t.priority = ?";
      params.push(filters.priority);
    }

    if (filters.createdBy) {
      query += " AND t.created_by = ?";
      params.push(filters.createdBy);
    }

    if (filters.assignedTo) {
      query += " AND t.assigned_to = ?";
      params.push(filters.assignedTo);
    }

    if (filters.search) {
      query += " AND (t.title LIKE ? OR t.description LIKE ?)";
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += " ORDER BY t.created_at DESC";

    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  update: (id, updates) => {
    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "assigned_to",
    ];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key),
    );

    if (fields.length === 0) return { changes: 0 };

    // Always update the updated_at timestamp
    fields.push("updated_at");
    updates.updated_at = new Date().toISOString();

    // If status is being changed to RESOLVED, set resolved_at
    if (updates.status === "RESOLVED" && !updates.resolved_at) {
      fields.push("resolved_at");
      updates.resolved_at = new Date().toISOString();
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);

    const stmt = db.prepare(`UPDATE tickets SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    return { changes: 1 };
  },

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM tickets WHERE id = ?");
    stmt.run(id);
    return { changes: 1 };
  },

  getStats: () => {
    const totalResult = db
      .prepare("SELECT COUNT(*) as count FROM tickets")
      .get();
    const total = totalResult ? totalResult.count : 0;

    const byStatus = db
      .prepare("SELECT status, COUNT(*) as count FROM tickets GROUP BY status")
      .all();

    const avgResult = db
      .prepare(
        `
      SELECT AVG(
        CAST((julianday(resolved_at) - julianday(created_at)) * 24 AS INTEGER)
      ) as avg_hours
      FROM tickets 
      WHERE resolved_at IS NOT NULL
    `,
      )
      .get();

    return {
      total: total,
      byStatus: byStatus.reduce((acc, { status, count }) => {
        acc[status] = count;
        return acc;
      }, {}),
      avgResolutionHours: avgResult ? avgResult.avg_hours || 0 : 0,
    };
  },
};

// Comment operations
export const commentDb = {
  create: (ticketId, userId, content) => {
    const stmt = db.prepare(
      "INSERT INTO comments (ticket_id, user_id, content) VALUES (?, ?, ?) RETURNING id",
    );
    const result = stmt.get(ticketId, userId, content);
    return { lastInsertRowid: result.id };
  },

  getByTicketId: (ticketId) => {
    const stmt = db.prepare(`
      SELECT 
        c.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC
    `);
    const results = stmt.all(ticketId);
    return results || [];
  },

  delete: (id) => {
    const stmt = db.prepare("DELETE FROM comments WHERE id = ?");
    stmt.run(id);
    return { changes: 1 };
  },
};

export default db;
