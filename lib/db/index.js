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
  create: async (email, password, name) => {
    const result = await conn.execute(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, password, name],
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
      "SELECT id, email, name, created_at FROM users WHERE id = ?",
      [id],
    );
    return rowToObject(result);
  },

  getAll: async () => {
    const result = await conn.execute(
      "SELECT id, email, name, created_at FROM users",
    );
    return rowsToObjects(result);
  },

  getByOrgId: async (orgId) => {
    const result = await conn.execute(
      `SELECT u.id, u.email, u.name, u.created_at, om.role as org_role
       FROM users u
       INNER JOIN organization_members om ON u.id = om.user_id
       WHERE om.org_id = ?`,
      [orgId],
    );
    return rowsToObjects(result);
  },

  getOrgAdmins: async (orgId) => {
    const result = await conn.execute(
      `SELECT u.id, u.email, u.name
       FROM users u
       INNER JOIN organization_members om ON u.id = om.user_id
       WHERE om.org_id = ? AND om.role = 'ORG_ADMIN'`,
      [orgId],
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
    await conn.execute("DELETE FROM organization_members WHERE user_id = ?", [id]);
    await conn.execute("DELETE FROM comments WHERE user_id = ?", [id]);
    await conn.execute("DELETE FROM tickets WHERE created_by = ?", [id]);
    await conn.execute("UPDATE tickets SET assigned_to = NULL WHERE assigned_to = ?", [id]);
    const result = await conn.execute("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },
};

export const orgDb = {
  create: async (name, slug, description = null) => {
    const result = await conn.execute(
      "INSERT INTO organizations (name, slug, description) VALUES (?, ?, ?)",
      [name, slug, description],
    );
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findById: async (id) => {
    const result = await conn.execute(
      "SELECT * FROM organizations WHERE id = ?",
      [id],
    );
    return rowToObject(result);
  },

  findBySlug: async (slug) => {
    const result = await conn.execute(
      "SELECT * FROM organizations WHERE slug = ?",
      [slug],
    );
    return rowToObject(result);
  },

  getAll: async () => {
    const result = await conn.execute(
      "SELECT * FROM organizations ORDER BY created_at DESC",
    );
    return rowsToObjects(result);
  },

  getByUserId: async (userId) => {
    const result = await conn.execute(
      `SELECT o.*, om.role as user_role
       FROM organizations o
       INNER JOIN organization_members om ON o.id = om.org_id
       WHERE om.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId],
    );
    return rowsToObjects(result);
  },

  update: async (id, updates) => {
    const allowedFields = ["name", "slug", "description"];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key),
    );

    if (fields.length === 0) return { changes: 0 };

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);

    const result = await conn.execute(
      `UPDATE organizations SET ${setClause} WHERE id = ?`,
      [...values, id],
    );
    return { changes: result.rowsAffected };
  },

  delete: async (id) => {
    await conn.execute("DELETE FROM organization_members WHERE org_id = ?", [id]);
    await conn.execute("DELETE FROM tickets WHERE org_id = ?", [id]);
    const result = await conn.execute(
      "DELETE FROM organizations WHERE id = ?",
      [id],
    );
    return { changes: result.rowsAffected };
  },

  getMemberCount: async (orgId) => {
    const result = await conn.execute(
      "SELECT COUNT(*) as count FROM organization_members WHERE org_id = ?",
      [orgId],
    );
    return Number(result.rows[0]?.count || 0);
  },

  getTicketCount: async (orgId) => {
    const result = await conn.execute(
      "SELECT COUNT(*) as count FROM tickets WHERE org_id = ?",
      [orgId],
    );
    return Number(result.rows[0]?.count || 0);
  },
};

export const orgMemberDb = {
  addMember: async (orgId, userId, role = "ORG_MEMBER") => {
    const result = await conn.execute(
      "INSERT INTO organization_members (org_id, user_id, role) VALUES (?, ?, ?)",
      [orgId, userId, role],
    );
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  removeMember: async (orgId, userId) => {
    const result = await conn.execute(
      "DELETE FROM organization_members WHERE org_id = ? AND user_id = ?",
      [orgId, userId],
    );
    return { changes: result.rowsAffected };
  },

  getMembers: async (orgId) => {
    const result = await conn.execute(
      `SELECT om.*, u.name, u.email, u.created_at
       FROM organization_members om
       INNER JOIN users u ON om.user_id = u.id
       WHERE om.org_id = ?
       ORDER BY om.created_at ASC`,
      [orgId],
    );
    return rowsToObjects(result);
  },

  findByOrgAndUser: async (orgId, userId) => {
    const result = await conn.execute(
      "SELECT * FROM organization_members WHERE org_id = ? AND user_id = ?",
      [orgId, userId],
    );
    return rowToObject(result);
  },

  updateMemberRole: async (orgId, userId, role) => {
    const result = await conn.execute(
      "UPDATE organization_members SET role = ? WHERE org_id = ? AND user_id = ?",
      [role, orgId, userId],
    );
    return { changes: result.rowsAffected };
  },

  isMember: async (orgId, userId) => {
    const result = await conn.execute(
      "SELECT id FROM organization_members WHERE org_id = ? AND user_id = ?",
      [orgId, userId],
    );
    return result.rows.length > 0;
  },

  isOrgAdmin: async (orgId, userId) => {
    const result = await conn.execute(
      "SELECT id FROM organization_members WHERE org_id = ? AND user_id = ? AND role = 'ORG_ADMIN'",
      [orgId, userId],
    );
    return result.rows.length > 0;
  },

  getOrgsForUser: async (userId) => {
    const result = await conn.execute(
      `SELECT o.*, om.role as user_role
       FROM organizations o
       INNER JOIN organization_members om ON o.id = om.org_id
       WHERE om.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId],
    );
    return rowsToObjects(result);
  },
};

export const ticketDb = {
  create: async (title, description, priority, createdBy, orgId) => {
    const result = await conn.execute(
      "INSERT INTO tickets (title, description, priority, created_by, org_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, priority, createdBy, orgId],
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
          u2.email as assigned_to_email,
          o.name as org_name,
          o.slug as org_slug
        FROM tickets t
        LEFT JOIN users u1 ON t.created_by = u1.id
        LEFT JOIN users u2 ON t.assigned_to = u2.id
        LEFT JOIN organizations o ON t.org_id = o.id
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

    if (filters.orgId) {
      sql += " AND t.org_id = ?";
      args.push(filters.orgId);
    }

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

  getStats: async (orgId) => {
    const totalResult = await conn.execute(
      "SELECT COUNT(*) as count FROM tickets WHERE org_id = ?",
      [orgId],
    );
    const total = Number(totalResult.rows[0]?.count || 0);

    const byStatusResult = await conn.execute(
      "SELECT status, COUNT(*) as count FROM tickets WHERE org_id = ? GROUP BY status",
      [orgId],
    );

    const avgResult = await conn.execute(
      `SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 24) as avg_hours
       FROM tickets 
       WHERE resolved_at IS NOT NULL AND org_id = ?`,
      [orgId],
    );

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

  getByTicketId: async (ticketId, orgId) => {
    const result = await conn.execute(
      `
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email,
          om.role as user_org_role
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN organization_members om ON om.user_id = u.id AND om.org_id = ?
        WHERE c.ticket_id = ?
        ORDER BY c.created_at ASC
      `,
      [orgId, ticketId],
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