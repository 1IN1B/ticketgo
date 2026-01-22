-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('USER', 'ADMIN')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (
        status IN (
            'OPEN',
            'IN_PROGRESS',
            'RESOLVED',
            'CLOSED'
        )
    ),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (
        priority IN (
            'LOW',
            'MEDIUM',
            'HIGH',
            'URGENT'
        )
    ),
    created_by INTEGER NOT NULL,
    assigned_to INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES users (id),
    FOREIGN KEY (assigned_to) REFERENCES users (id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets (created_by);

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets (assigned_to);

CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets (status);

CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments (ticket_id);