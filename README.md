# TicketGo

A modern internal ticketing and project management platform built with Next.js. Create, track, manage, and resolve support tickets across multiple organizations.

## Features

### Ticket Management
- Create tickets with title, description, and priority (LOW / MEDIUM / HIGH / URGENT)
- Ticket lifecycle: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Filter tickets by status, priority, and search
- Paginated ticket list with responsive mobile view
- Comment threads on each ticket
- Admin controls for status, priority, and assignment changes

### Organizations (Multi-Tenancy)
- Create and manage multiple organizations (name, slug, description)
- Auto-generated slugs from org names with manual override
- Two roles per org: **ORG_ADMIN** and **ORG_MEMBER**
- Org switcher in sidebar to change active org context
- Member management: add by email, change roles, remove members
- All tickets and dashboard stats are scoped to the current org
- New users auto-join a default org on signup

### Dashboard
- Org-scoped stats: total tickets, open count, resolved count, average resolution time
- Resolution rate progress bar
- Quick actions for admins (member management, new ticket)

### Authentication & Security
- Signup / Login with email and password (NextAuth Credentials provider)
- JWT-based sessions with org context stored in the token
- Three-tier authorization: `requireAuth`, `requireOrgMember`, `requireOrgAdmin`
- Password change and account deletion in settings

### UI / UX
- Dark / light / system theme toggle
- Animated page transitions and stagger effects (Motion / Framer Motion)
- shadcn/ui components (Radix UI + Tailwind CSS)
- Responsive design with separate mobile navigation
- Toast notifications (Sonner)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Radix UI (shadcn/ui pattern) |
| Styling | Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| State | Zustand v5 |
| Forms | React Hook Form + Zod v4 |
| Auth | NextAuth v5 (beta) |
| Database | Turso (serverless SQLite) |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js
- A [Turso](https://turso.tech) database instance

### Setup

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Create a `.env` file with your Turso credentials and NextAuth secret:

```env
TURSO_CONNECTION_URL=<your-turso-url>
TURSO_AUTH_TOKEN=<your-turso-token>
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000
```

3. Initialize the database schema and seed data:

```bash
bun lib/db/migrate.js
bun run db:seed
```

4. Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  page.js                          Landing page
  (auth)/login/                    Login page
  (auth)/signup/                   Signup page
  (dashboard)/dashboard/           Dashboard home (org-scoped stats)
  (dashboard)/tickets/             Ticket list, new, detail pages
  (dashboard)/organizations/       Org list, new, detail, edit pages
  (dashboard)/settings/            User settings
  api/                             API routes (auth, tickets, orgs, users)

components/
  organizations/                   OrgSwitcher, OrgCard, OrgForm, OrgDetailHeader, OrgMemberList, OrgMemberManagementDialog
  tickets/                         TicketForm, TicketTable, TicketDetails, CommentThread, etc.
  dashboard/                       StatsGrid, MetricCard, DashboardHeader
  layout/                          Sidebar, TopNav, MobileNav
  ui/                              shadcn/ui primitives

lib/
  db/                              Database access (schema, migrate, seed, queries)
  auth/                            Auth helpers (requireAuth, requireOrgMember, requireOrgAdmin)
  validations.js                   Zod schemas

store/
  org-store.js                     Org state (currentOrgId, orgs list, switchOrg)
  ticket-store.js                  Filter and pagination state
  ui-store.js                      UI state (mobile menu, modals)
```

## Database Schema

Five tables with org-scoped relationships:

- **users** — id, email, password, name
- **organizations** — id, name, slug, description
- **organization_members** — org_id, user_id, role (ORG_ADMIN / ORG_MEMBER)
- **tickets** — org_id, title, description, status, priority, created_by, assigned_to
- **comments** — ticket_id, user_id, content

## Deploy

Deploy on [Vercel](https://vercel.com) or any platform that supports Next.js. Make sure to set all environment variables in your deployment config.
