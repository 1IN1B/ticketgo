# SQLite to MySQL Migration Plan (for freedb.tech / Vercel)

This plan outlines the steps required to refactor the **TicketGo** application to use a remote MySQL database (freedb.tech), enabling seamless hosting on Vercel.

## 1. Environment Configuration

- [ ] Install `mysql2` dependency.
- [ ] Create a `.env` file (if not exists) with `DATABASE_URL` or individual `DB_HOST`, `DB_USER`, etc.
- [ ] Add these environment variables to the Vercel project settings.

## 2. Database Schema Migration

- [ ] Convert `lib/db/schema.sql` from SQLite to MySQL syntax.
  - [ ] Change `AUTOINCREMENT` to `AUTO_INCREMENT`.
  - [ ] Update `DATETIME DEFAULT CURRENT_TIMESTAMP` if necessary (MySQL typical).
  - [ ] Verify foreign key syntax.

## 3. Core Database Refactor (`lib/db/index.js`)

- [ ] Replace `bun:sqlite` with `mysql2/promise`.
- [ ] Refactor all export objects (`userDb`, `ticketDb`, `commentDb`) to use `async/await`.
- [ ] Update query syntax:
  - [ ] Remove `RETURNING id` (MySQL uses `insertId` on the result object).
  - [ ] Replace `julianday()` math with MySQL `TIMESTAMPDIFF`.
  - [ ] Update `db.run/get/all` to the `mysql2` pool equivalent (`pool.execute`).
- [ ] Refactor `delete` transaction logic to use MySQL transactions.

## 4. Auth Integration Refactor

- [ ] Update `auth.js` `authorize` function to `await` the `userDb.findByEmail` call.
- [ ] Update any other session-related database calls to be asynchronous.

## 5. API Route Refactor

- [ ] Audit all files in `app/api/**/*`.
- [ ] Update every database call to include the `await` keyword.
- [ ] Ensure proper error handling for network-based database errors.

## 6. Frontend/Page Refactor

- [ ] Audit server components (e.g., `app/(dashboard)/dashboard/page.jsx`, `app/(dashboard)/tickets/[id]/page.jsx`).
- [ ] Update direct database calls to include `await`.

## 7. Migration & Seeding

- [ ] Update `lib/db/seed.js` for MySQL.
- [ ] Run the migration script against the `freedb.tech` instance.

---

**Next Steps:**

1. Install `mysql2`.
2. Refactor `lib/db/index.js`.
3. Systematically update API routes.
