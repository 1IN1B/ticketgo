import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { join } from "path";

// Create a connection pool to be used throughout the app
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "ticketgo",
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper for schema initialization (Admin only / Manual setup normally)
export async function initializeDatabase() {
  const schema = readFileSync(
    join(process.cwd(), "lib/db/schema.sql"),
    "utf-8",
  );

  // MySQL doesn't support multiple statements by default in one query
  // We need to split them or enable multipleStatements
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await pool.execute(statement);
  }

  console.log("Database initialized successfully");
}

// User operations
export const userDb = {
  create: async (email, password, name, role = "USER") => {
    const [result] = await pool.execute(
      "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
      [email, password, name, role],
    );
    return { lastInsertRowid: result.insertId };
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.execute(
      "SELECT id, email, name, role, created_at FROM users WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  },

  getAdmins: async () => {
    const [rows] = await pool.execute(
      "SELECT id, email, name FROM users WHERE role = ?",
      ["ADMIN"],
    );
    return rows;
  },

  getAll: async () => {
    const [rows] = await pool.execute(
      "SELECT id, email, name, role, created_at FROM users",
    );
    return rows;
  },

  updateProfile: async (id, name) => {
    const [result] = await pool.execute(
      "UPDATE users SET name = ? WHERE id = ?",
      [name, id],
    );
    return result;
  },

  updatePassword: async (id, hashedPassword) => {
    const [result] = await pool.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id],
    );
    return result;
  },

  delete: async (id) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Delete user's comments
      await connection.execute("DELETE FROM comments WHERE user_id = ?", [id]);

      // Delete user's tickets
      await connection.execute("DELETE FROM tickets WHERE created_by = ?", [
        id,
      ]);

      // Nullify assignments
      await connection.execute(
        "UPDATE tickets SET assigned_to = NULL WHERE assigned_to = ?",
        [id],
      );

      // Finally delete user
      const [result] = await connection.execute(
        "DELETE FROM users WHERE id = ?",
        [id],
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

// Ticket operations
export const ticketDb = {
  create: async (title, description, priority, createdBy) => {
    const [result] = await pool.execute(
      "INSERT INTO tickets (title, description, priority, created_by) VALUES (?, ?, ?, ?)",
      [title, description, priority, createdBy],
    );
    return { lastInsertRowid: result.insertId };
  },

  findById: async (id) => {
    const [rows] = await pool.execute(
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
    return rows[0] || null;
  },

  getAll: async (filters = {}) => {
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

    const [rows] = await pool.execute(query, params);
    return rows;
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

    // If status is being changed to RESOLVED, set resolved_at
    if (updates.status === "RESOLVED" && !updates.resolved_at) {
      fields.push("resolved_at");
      updates.resolved_at = new Date();
    }

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);

    const [result] = await pool.execute(
      `UPDATE tickets SET ${setClause} WHERE id = ?`,
      [...values, id],
    );
    return { changes: result.affectedRows };
  },

  delete: async (id) => {
    const [result] = await pool.execute("DELETE FROM tickets WHERE id = ?", [
      id,
    ]);
    return { changes: result.affectedRows };
  },

  getStats: async () => {
    const [totalRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM tickets",
    );
    const total = totalRows[0] ? totalRows[0].count : 0;

    const [byStatusRows] = await pool.execute(
      "SELECT status, COUNT(*) as count FROM tickets GROUP BY status",
    );

    const [avgRows] = await pool.execute(`
      SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) as avg_hours
      FROM tickets 
      WHERE resolved_at IS NOT NULL
    `);

    return {
      total: total,
      byStatus: byStatusRows.reduce((acc, { status, count }) => {
        acc[status] = count;
        return acc;
      }, {}),
      avgResolutionHours: avgRows[0] ? avgRows[0].avg_hours || 0 : 0,
    };
  },
};

// Comment operations
export const commentDb = {
  create: async (ticketId, userId, content) => {
    const [result] = await pool.execute(
      "INSERT INTO comments (ticket_id, user_id, content) VALUES (?, ?, ?)",
      [ticketId, userId, content],
    );
    return { lastInsertRowid: result.insertId };
  },

  getByTicketId: async (ticketId) => {
    const [rows] = await pool.execute(
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
    return rows || [];
  },

  delete: async (id) => {
    const [result] = await pool.execute("DELETE FROM comments WHERE id = ?", [
      id,
    ]);
    return { changes: result.affectedRows };
  },
};

export const db = pool;
export default pool;
