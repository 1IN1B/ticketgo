---
description: Full-stack Mini Support Desk Implementation Plan
---

# Mini Support Desk - Implementation Plan

## Project Overview

A mobile-responsive ticketing system with Role-Based Access Control (User vs. Admin) built with Next.js 14+ App Router, Tailwind CSS, shadcn/ui, NextAuth.js, Zustand, and SQLite.

---

## Phase 1: Environment Setup & Dependencies

### 1.1 Install Core Dependencies

```bash
bun add next-auth@beta zustand better-sqlite3
bun add -d @types/better-sqlite3
```

### 1.2 Install shadcn/ui CLI and Components

```bash
bunx shadcn@latest init
```

Configure with:

- Style: Default
- Base color: Slate
- CSS variables: Yes

Install required shadcn components:

```bash
bunx shadcn@latest add card input button label select textarea table sheet progress badge dropdown-menu avatar separator
```

### 1.3 Install Form Validation

```bash
bun add zod react-hook-form @hookform/resolvers
```

---

## Phase 2: Database Architecture

### 2.1 Create Database Schema (`lib/db/schema.sql`)

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('USER', 'ADMIN')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  created_by INTEGER NOT NULL,
  assigned_to INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tickets_created_by ON tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_comments_ticket_id ON comments(ticket_id);
```

### 2.2 Create Database Connection (`lib/db/index.js`)

- Initialize SQLite database
- Create helper functions for CRUD operations
- Add connection pooling if needed

---

## Phase 3: Authentication Setup

### 3.1 Configure NextAuth.js

- Create `app/api/auth/[...nextauth]/route.js`
- Set up Credentials provider
- Configure session strategy (JWT)
- Add role to session object

### 3.2 Create Auth Components

- `components/auth/login-form.jsx` - Login form with shadcn Card, Input, Button
- `components/auth/signup-form.jsx` - Signup form with role toggle
- `app/(auth)/login/page.jsx` - Login page
- `app/(auth)/signup/page.jsx` - Signup page

### 3.3 Create Auth Utilities

- `lib/auth/password.js` - Password hashing with bcrypt
- `lib/auth/session.js` - Session helpers

---

## Phase 4: State Management (Zustand)

### 4.1 Create Stores

- `store/ticket-store.js` - Ticket filtering, sorting, pagination state
- `store/ui-store.js` - Mobile menu state, modal state

---

## Phase 5: Core Components

### 5.1 Layout Components

- `components/layout/sidebar.jsx` - Desktop sidebar navigation
- `components/layout/mobile-nav.jsx` - Mobile hamburger menu with Sheet
- `components/layout/top-nav.jsx` - Top navigation with user info and logout
- `components/layout/main-layout.jsx` - Main layout wrapper

### 5.2 Ticket Components

- `components/tickets/ticket-card.jsx` - Mobile card view for tickets
- `components/tickets/ticket-table.jsx` - Desktop table view
- `components/tickets/ticket-filters.jsx` - Search and filter controls
- `components/tickets/ticket-detail.jsx` - Ticket detail view
- `components/tickets/comment-thread.jsx` - Comment timeline
- `components/tickets/comment-form.jsx` - Add comment form
- `components/tickets/ticket-form.jsx` - Create/Edit ticket form
- `components/tickets/status-badge.jsx` - Status badge component
- `components/tickets/priority-badge.jsx` - Priority badge component

### 5.3 Dashboard Components

- `components/dashboard/metric-card.jsx` - Metric display card
- `components/dashboard/stats-grid.jsx` - Grid of metrics

---

## Phase 6: API Routes

### 6.1 Ticket APIs

- `app/api/tickets/route.js` - GET (list), POST (create)
- `app/api/tickets/[id]/route.js` - GET (detail), PATCH (update), DELETE
- `app/api/tickets/[id]/comments/route.js` - GET (list), POST (create)

### 6.2 User APIs

- `app/api/users/route.js` - GET (list admins for assignment)
- `app/api/users/[id]/route.js` - GET (user details)

### 6.3 Dashboard APIs

- `app/api/dashboard/stats/route.js` - GET (dashboard metrics)

---

## Phase 7: Pages

### 7.1 Protected Routes

- `app/(dashboard)/layout.jsx` - Dashboard layout with sidebar/mobile nav
- `app/(dashboard)/dashboard/page.jsx` - Dashboard with metrics
- `app/(dashboard)/tickets/page.jsx` - Ticket listing with filters
- `app/(dashboard)/tickets/[id]/page.jsx` - Ticket detail view
- `app/(dashboard)/tickets/new/page.jsx` - Create ticket form

---

## Phase 8: Responsive Design & Styling

### 8.1 Mobile-First Approach

- Use Tailwind's responsive breakpoints (sm, md, lg, xl)
- Table → Card transformation for mobile
- Sidebar → Sheet for mobile
- Stack columns on mobile, side-by-side on desktop

### 8.2 Custom Styles

- Add custom CSS for timeline in comments
- Progress bars for ticket resolution
- Hover effects and transitions
- Badge styling for status/priority

---

## Phase 9: Business Logic & Validation

### 9.1 Form Validation (Zod)

- Ticket creation schema
- Comment creation schema
- User registration schema
- Login schema

### 9.2 Role-Based Access Control

- Middleware to check user role
- Conditional rendering based on role
- API route protection

### 9.3 Ticket Logic

- Only owner can edit if status is OPEN
- Only admin can change status/priority/assignee
- Auto-update `updated_at` timestamp
- Set `resolved_at` when status changes to RESOLVED

---

## Phase 10: Testing & Refinement

### 10.1 Manual Testing

- Test all user flows (signup, login, create ticket, comment, etc.)
- Test role-based access (User vs Admin)
- Test responsive design on mobile and desktop
- Test form validations

### 10.2 Database Seeding

- Create seed script with sample users (1 admin, 2 users)
- Create sample tickets with various statuses
- Create sample comments

---

## Phase 11: Final Polish

### 11.1 UI/UX Enhancements

- Loading states
- Error handling and toast notifications
- Empty states
- Pagination
- Smooth transitions

### 11.2 Performance

- Optimize database queries
- Add proper indexes
- Implement proper caching

---

## Implementation Order

1. **Setup** (Phase 1-2): Install dependencies, setup database
2. **Auth** (Phase 3): Implement authentication
3. **State** (Phase 4): Setup Zustand stores
4. **Components** (Phase 5): Build reusable components
5. **APIs** (Phase 6): Create API routes
6. **Pages** (Phase 7): Build application pages
7. **Styling** (Phase 8): Ensure responsive design
8. **Logic** (Phase 9): Implement business rules
9. **Testing** (Phase 10): Test and refine
10. **Polish** (Phase 11): Final touches

---

## Key Technical Decisions

- **Database**: SQLite with better-sqlite3 (synchronous, simple, file-based)
- **Auth**: NextAuth.js v5 (beta) with Credentials provider
- **State**: Zustand for client-side filtering/sorting state
- **UI**: shadcn/ui for consistent, accessible components
- **Validation**: Zod for type-safe validation
- **Styling**: Tailwind CSS with mobile-first approach
- **Package Manager**: Bun (as specified)

---

## File Structure Preview

```
ticketgo/
├── app/
│   ├── (auth)/
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── (dashboard)/
│   │   ├── layout.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── tickets/
│   │   │   ├── page.jsx
│   │   │   ├── [id]/page.jsx
│   │   │   └── new/page.jsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── tickets/
│   │   ├── users/
│   │   └── dashboard/
│   ├── globals.css
│   └── layout.js
├── components/
│   ├── auth/
│   ├── layout/
│   ├── tickets/
│   ├── dashboard/
│   └── ui/ (shadcn components)
├── lib/
│   ├── db/
│   │   ├── index.js
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── auth/
│   └── utils.js
├── store/
│   ├── ticket-store.js
│   └── ui-store.js
├── package.json
└── next.config.mjs
```
