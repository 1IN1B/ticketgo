import { connect } from "@tursodatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

const conn = connect({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function rowsToObjects(result) {
  return result.rows.map((row) => {
    const obj = {};
    result.columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

function rowToObject(result) {
  if (!result.rows.length) return null;
  const obj = {};
  result.columns.forEach((col, i) => {
    obj[col] = result.rows[0][i];
  });
  return obj;
}

export async function initializeDatabase() {
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

  console.log("Database initialized successfully");
}

export const userDb = {
  create: async (email, password, name, role = "USER") => {
    const result = await conn.execute(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, password, name, role],
    );
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findByEmail: async (email) => {
    const result = await conn.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return rowToObject(result);
  },

  findById: async (id) => {
    const result = await conn.execute(
      "SELECT id, email, name, role, created_at FROM users WHERE id = ?",
      [id],
    );
    return rowToObject(result);
  },

  getAdmins: async () => {
    const result = await conn.execute(
      "SELECT id, email, name FROM users WHERE role = ?",
      ["ADMIN"],
    );
    return rowsToObjects(result);
  },

  getAll: async () => {
    const result = await conn.execute(
      "SELECT id, email, name, role, created_at FROM users",
    );
    return rowsToObjects(result);
  },

  updateProfile: async (id, name) => {
    const result = await conn.execute(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, id],
    );
    return result;
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await conn.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id],
    );
    return result;
  },

  delete: async (id) => {
    await conn.execute("DELETE FROM comments WHERE user_id = ?", [id]);
    await conn.execute("DELETE FROM tickets WHERE created_by = ?", [id]);
    await conn.execute("UPDATE tickets SET assigned_to = NULL WHERE assigned_to = ?", [id]);
    const result = await conn.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },
};

export const ticketDb = {
  create: async (title, description, priority, createdBy) => {
    const result = await conn.execute(
      "INSERT INTO tickets (title, description, priority, created_by) VALUES (?, ?, ?, ?)",
      [title, description, priority, createdBy],
    );
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findById: async (id) => {
    const result = await conn.execute(
      `
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
      `,
      [id],
    );
    return rowToObject(result);
  },

  getAll: async (filters = {}) => {
    let sql = `
      SELECT 
        t.*,
        u1.name as created_by_name,
        u2.name as assigned_to_name
      FROM tickets t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      WHERE 1=1
    `;
    const args = [];

    if (filters.status) {
      sql += " AND t.status = ?";
      args.push(filters.status);
    }

    if (filters.priority) {
      sql += " AND t.priority = ?";
      args.push(filters.priority);
    }

    if (filters.createdBy) {
      sql += " AND t.created_by = ?";
      args.push(filters.createdBy);
    }

    if (filters.assignedTo) {
      sql += " AND t.assigned_to = ?";
      args.push(filters.assignedTo);
    }

    if (filters.search) {
      sql += " AND (t.title LIKE ? OR t.description LIKE ?)";
      args.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += " ORDER BY t.created_at DESC";

    const result = await conn.execute(sql, args);
    return rowsToObjects(result);
  },

  update: async (id, updates) => {
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

    if (updates.status === "RESOLVED" && !updates.resolved_at) {
      fields.push("resolved_at");
      updates.resolved_at = new Date().toISOString();
    }

    fields.push("updated_at");
    updates.updated_at = new Date().toISOString();

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);

    const result = await conn.execute(
      `UPDATE tickets SET ${setClause} WHERE id = ?`,
      [...values, id],
    );
    return { changes: result.rowsAffected };
  },

  delete: async (id) => {
    const result = await conn.execute(
      "DELETE FROM tickets WHERE id = ?",
      [id],
    );
    return { changes: result.rowsAffected };
  },

  getStats: async () => {
    const totalResult = await conn.execute(
      "SELECT COUNT(*) as count FROM tickets",
    );
    const total = Number(totalResult.rows[0]?.count || 0);

    const byStatusResult = await conn.execute(
      "SELECT status, COUNT(*) as count FROM tickets GROUP BY status",
    );

    const avgResult = await conn.execute(`
      SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 24) as avg_hours
      FROM tickets 
      WHERE resolved_at IS NOT NULL
    `);

    return {
      total,
      byStatus: byStatusResult.rows.reduce((acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      }, {}),
      avgResolutionHours: Number(avgResult.rows[0]?.avg_hours || 0),
    };
  },
};

export const commentDb = {
  create: async (ticketId, userId, content) => {
    const result = await conn.execute(
      "INSERT INTO comments (ticket_id, user_id, content) VALUES (?, ?, ?)",
      [ticketId, userId, content],
    );
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  getByTicketId: async (ticketId) => {
    const result = await conn.execute(
      `
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email,
          u.role as user_role
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.ticket_id = ?
        ORDER BY c.created_at ASC
      `,
      [ticketId],
    );
    return rowsToObjects(result);
  },

  delete: async (id) => {
    const result = await conn.execute(
      "DELETE FROM comments WHERE id = ?",
      [id],
    );
    return { changes: result.rowsAffected };
  },
};

export { conn as db };
export default conn;