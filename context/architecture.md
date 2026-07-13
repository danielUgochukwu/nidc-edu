# NIDC Platform — Architecture

---

## Stack Table

| Layer | Technology | Role |
|---|---|---|
| Framework | Next.js 16 (App Router) | Full-stack framework handling frontend rendering, API routes, and server-side logic in a single codebase |
| Authentication | Clerk | User sign-up, login, session management, JWT issuance, and role metadata storage via `publicMetadata` |
| Database | PostgreSQL | Primary relational data store for all application, candidate, screening, mentorship, donation, and grant records |
| ORM | Prisma | Type-safe database access, schema definition, and migration management |
| Database & Storage | Supabase | Hosts the PostgreSQL database and provides Supabase Storage for all file uploads — candidate documents, application attachments, mentor profile images, and grant documentation |
| Payments | Paystack | Processes local Naira donations from Nigerian donors. Webhooks confirm payment success before records are written |
| Email | Resend | Sends all transactional emails — rejection notices, interview links, reminders, donation receipts, and grant milestone alerts |
| Hosting | Vercel | Deploys the Next.js application. Serverless functions handle API routes. Environment variables managed via Vercel dashboard |
| Background Jobs | Vercel Cron Jobs | Triggers the 48-hour screening escalation check, interview reminder dispatch, and any other time-based tasks |

---

## System Boundaries

Every folder in the codebase owns a specific responsibility. Nothing outside that folder should replicate or override it.

```
/
├── app/                        # Next.js App Router — all pages and API routes
│   ├── (public)/               # Public-facing pages — no auth required
│   │   ├── page.tsx            # Home
│   │   ├── about/              # About NIDC
│   │   ├── programs/           # Pipeline tracks explained
│   │   ├── sectors/            # Energy, Manufacturing, Digital Infrastructure
│   │   ├── apply/              # Eligibility, cohort status, CTA
│   │   ├── donate/             # Donor-facing page and Paystack flow
│   │   ├── impact/             # Public metrics dashboard
│   │   ├── contact/            # Contact form
│   │   ├── faqs/               # Frequently asked questions
│   │   └── blog/               # Cohort announcements and updates
│   │
│   ├── (auth)/                 # Clerk-managed auth pages
│   │   ├── sign-in/            # Login page
│   │   └── sign-up/            # Registration page — role set to applicant on completion
│   │
│   ├── (dashboard)/            # Protected route group — requires valid Clerk session
│   │   └── dashboard/          # URL segment for role-specific dashboards
│   │       ├── applicant/      # Application form, diagnostic assessment, submission status
│   │       ├── candidate/      # Pipeline stage, milestones, documents, notifications
│   │       ├── mentor/         # Assigned candidates, session logs, milestone tracking
│   │       ├── screening/      # Application queue, consensus voting, shortlist management
│   │       ├── program-director/ # Escalated applications, tie-breaking decisions
│   │       ├── finance/        # Finance Officer and Grant Officer work area
│   │       ├── admin/          # User management, cohort management, audit trails
│   │       └── donor/          # Donation history, impact metrics
│   │
│   └── api/                    # API route handlers — server-side only
│       ├── webhooks/
│       │   ├── clerk/          # Handles Clerk user.created webhook — assigns default role
│       │   └── paystack/       # Handles Paystack payment.success webhook — writes donation record
│       ├── invites/            # Administrator-only invite creation for internal roles
│       ├── applications/       # CRUD for application records and form progress
│       ├── assessments/        # Diagnostic assessment submission and pipeline assignment logic
│       ├── screening/          # Consensus votes, escalation triggers, shortlist actions
│       ├── interviews/         # Interview link storage, distribution, reminder scheduling
│       ├── mentorship/         # Mentor matching, session logging, milestone updates
│       ├── donations/          # Donation initiation and Paystack reference generation
│       ├── grants/             # Grant record management and milestone tracking
│       ├── notifications/      # In-platform notification creation and retrieval
│       └── cron/               # Cron job endpoints — escalation checks, reminder dispatch
│
├── prisma/
│   ├── schema.prisma           # Single source of truth for all database models and relations
│   └── migrations/             # Versioned migration history — never edited manually
├── prisma.config.ts            # Prisma CLI config — loads .env.local and points commands at schema.prisma
│
├── lib/
│   ├── prisma.ts               # Prisma client singleton — imported wherever DB access is needed
│   ├── clerk.ts                # Clerk server-side helpers — role checks, metadata updates
│   ├── resend.ts               # Resend client and email template dispatch functions
│   ├── storage.ts              # Supabase Storage client — upload helpers and signed URL generation
│   ├── paystack.ts             # Paystack API helpers — initiate transaction, verify reference
│   └── escalation.ts           # Screening escalation logic — 48-hour check and routing rules
│
├── components/
│   ├── ui/                     # Reusable, stateless UI components — buttons, inputs, modals
│   ├── forms/                  # Application form steps, assessment form, session log form
│   ├── dashboard/              # Role-specific dashboard layout components
│   └── public/                 # Landing page sections, navigation, footer
│
├── proxy.ts                    # Clerk proxy — protects all dashboard routes, enforces role-based routing
├── .env.local                  # Local environment variables — never committed to version control
└── .env.example                # Template of required environment variables — committed to version control
```

---

## Storage Model

### PostgreSQL — Relational Data

Everything that has relationships, requires querying, needs audit trails, or drives business logic lives in PostgreSQL via Prisma.

| Table | What it stores |
|---|---|
| `User` | Platform user record linked to Clerk user ID. Mirrors Clerk role for querying and audit context; later phases add sector, pipeline, and cohort references |
| `Organization` | Organization record for future partner, donor, or institutional grouping |
| `OrganizationMember` | Join table linking users to organizations with an organization-scoped role |
| `Invite` | Pending or accepted invite token for assigning approved internal roles during Clerk sign-up |
| `Cohort` | Cohort records with application window open/close dates, status, and sector |
| `Application` | Candidate application — form progress, submission status, pipeline assignment, diagnostic assessment result, and flag for borderline review |
| `AssessmentQuestion` | Questions in the diagnostic assessment — created and managed by the screening team |
| `AssessmentResponse` | Candidate responses to each assessment question, linked to their application |
| `ScreeningVote` | Individual reviewer votes on an application — approve, reject, or abstain — with timestamp and reviewer ID |
| `EscalationRecord` | Logs when an application was escalated, to whom, and the outcome |
| `Interview` | Interview session record — link, scheduled time, cohort, and status |
| `InterviewOutcome` | Pass or fail decision per candidate after the interview, with decision timestamp and recorder ID |
| `MentorProfile` | Mentor record — type (alumni or industry), sector, bio, and availability status |
| `MentorMatch` | Links a mentor to a candidate — start date, status, and track (mandatory or optional) |
| `MentorSession` | Logged session between mentor and candidate — date, duration, notes, and logger ID |
| `MentorMilestone` | Defined milestones for mentorship progress — linked to match, with completion status and date |
| `Donation` | Donor contribution record — amount in Naira, Paystack reference, status, and timestamp |
| `Grant` | Institutional grant record — funder, total amount, start and end date, and status |
| `GrantMilestone` | Individual milestone within a grant — description, due date, completion status, and disbursement amount |
| `Expenditure` | Financial expenditure recorded by Finance Officer — amount, category, linked program or candidate, and approval status |
| `Notification` | In-platform notification per user — type, message, read status, and timestamp |
| `AuditLog` | Immutable record of all screening decisions, role changes, and financial entries — actor ID, action, target, and timestamp |

### Supabase Storage — File Storage

Binary files that do not need to be queried or related to business logic live in Supabase Storage. The database stores only the Supabase Storage public or signed URL, never the file itself. Files are organised into dedicated buckets by category. Private buckets require a signed URL for access — use signed URLs for all sensitive files. Only genuinely public files may live in a public bucket.

| Bucket | File type | Who uploads | Access policy |
|---|---|---|---|
| `application-attachments` | Application supporting documents | Applicant | Private — signed URL required |
| `identity-documents` | Candidate identity documents | Applicant | Private — signed URL required |
| `grant-documents` | Grant milestone documentation | Finance Officer | Private — signed URL required |
| `expenditure-receipts` | Expenditure receipt images | Finance Officer | Private — signed URL required |
| `mentor-avatars` | Mentor profile images | Mentor | Public |

### Cache — None in Initial Build

No caching layer is introduced in the initial build. Vercel's serverless functions and Next.js's built-in fetch caching handle performance adequately at early scale. A Redis layer can be introduced in a future phase if query performance degrades under load.

---

## Auth and Access Model

### How Authentication Works

1. A user signs up or logs in via Clerk on the `/sign-up` or `/sign-in` page.
2. On `user.created`, Clerk fires a webhook to `/api/webhooks/clerk`. The handler creates a `User` record in PostgreSQL linked to the Clerk user ID, and sets the role in Clerk `publicMetadata` from a valid invite or falls back to `applicant`.
3. Every subsequent request to a protected route passes through `proxy.ts`, which validates the Clerk session token and reads the role from `publicMetadata`.
4. The proxy enforces role-based routing — a user with the `applicant` role cannot access `/dashboard/screening`, a user with the `screening_team` role cannot access `/dashboard/finance`, and so on.
5. API routes perform a second role check server-side using Clerk's `auth()` helper. The proxy check alone is not sufficient — every API route that writes data must verify the caller's role independently.

### Role Definitions and Access

| Role | How it is assigned | What it can access |
|---|---|---|
| `applicant` | Automatically on Clerk `user.created` webhook | Application form, own submission status, own notifications |
| `candidate` | Programmatically by the system on interview acceptance | Candidate dashboard, pipeline progress, milestones, mentorship dashboard |
| `mentor` | Manually by Administrator or Screening Team Member | Mentor dashboard, assigned candidate profiles, session logging, milestone tracking |
| `screening_team` | Manually by Administrator | Application queue, consensus voting, assessment design, shortlist management, interview link input |
| `program_director` | Manually by Administrator | All screening views, escalated applications, tie-breaking interface, Deputy Program Director assignment |
| `deputy_program_director` | Assigned by Program Director — reassignable at any time | Same access as Program Director when acting in that capacity |
| `finance_officer` | Manually by Administrator | Expenditure entry, grant management, financial report generation — no access to screening or candidate data |
| `grant_officer` | Manually by Administrator via invite link | Grant record management, milestone tracking, grant documentation uploads, financial reports for institutional funders |
| `administrator` | Manually by another Administrator or seeded at setup | User management, role assignment, cohort management, audit trail access, platform settings |
| `donor` | Self-registers publicly or assigned after first donation | Donor dashboard, donation history, public impact metrics |

### Ownership Rules

- A `ScreeningVote` is owned by the reviewer who cast it. No other user can modify or delete it.
- An `Expenditure` record is created by a Finance Officer and cannot be edited or deleted after a second Finance Officer or Program Director has approved it.
- An `AuditLog` entry is immutable. No role — including Administrator — can update or delete an audit log record. This is enforced at the ORM boundary via a Prisma query extension that rejects any update, upsert, or delete operation on the `AuditLog` table.
- A `MentorMatch` can only be created by an Administrator or Screening Team Member, never by the mentor or candidate themselves.

---

## Background Tasks

All background tasks run as Vercel Cron Jobs calling internal API endpoints. Each endpoint is protected by a shared secret header — requests without the correct `CRON_SECRET` header are rejected with a 401.

| Job | Endpoint | Schedule | What it does |
|---|---|---|---|
| Screening escalation check | `/api/cron/escalation-check` | Every hour | Queries all `ScreeningVote` groups where consensus has not been reached. If the oldest vote is more than 48 hours old and no escalation record exists, creates an `EscalationRecord` and notifies the Program Director via Resend and in-platform notification |
| Deputy escalation fallback | `/api/cron/deputy-escalation` | Every hour | Queries `EscalationRecord` entries assigned to the Program Director with no response after 24 hours. Reassigns to the current Deputy Program Director and sends notification |
| Interview reminder dispatch | `/api/cron/interview-reminders` | Every hour | Queries upcoming `Interview` records. Sends Resend email and in-platform notification to all shortlisted candidates 24 hours before and again 1 hour before the scheduled interview time |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Runtime Supabase PostgreSQL connection string used by Prisma Client; use transaction pooling for serverless deployments |
| `DIRECT_URL` | Prisma CLI migration connection string; use a direct database connection or Supabase session pooler, not transaction pooling |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk browser key |
| `CLERK_SECRET_KEY` | Clerk server API key |
| `CLERK_WEBHOOK_SECRET` | Svix signing secret for Clerk webhook verification |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Public Clerk sign-in route |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Public Clerk sign-up route |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-login route before role-based dashboard routing |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-signup route before role-based dashboard routing |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase service role key for Storage operations |
| `RESEND_API_KEY` | Resend server API key for transactional email |
| `PAYSTACK_SECRET_KEY` | Paystack server secret used by Phase 8 payment helpers |
| `NEXT_PUBLIC_APP_URL` | Canonical application URL used when generating invite links |
| `CRON_SECRET` | Shared secret for future Vercel Cron endpoints |

Prisma CLI commands load `.env.local` through `prisma.config.ts`. The config uses `DIRECT_URL` when present so migrations bypass the transaction pooler; it falls back to `DATABASE_URL` only for local commands that do not require the migration engine. Next.js reads `.env.local` directly at runtime and build time.

---

## Invariants

These are rules the codebase must never violate under any circumstances. They are not preferences or guidelines — they are hard constraints that protect the integrity of the platform.

**1. Roles are set and read exclusively through Clerk `publicMetadata` — never from the database alone.**
The `User` table in PostgreSQL mirrors the role for querying and audit purposes, but the authoritative source of a user's role is always Clerk `publicMetadata`. Any access control decision — in proxy logic or in an API route — must read from Clerk, not from a database query. Reading role from the database for access decisions creates a desync attack surface.

**2. No API route that writes data may skip a server-side role check.**
The proxy protects pages, not API routes. Every API route handler that creates, updates, or deletes a record must call Clerk's `auth()` helper and verify the caller's role before executing any database operation. A valid session token is not sufficient — the role must be explicitly checked against what that endpoint permits.

**3. The `AuditLog` table is append-only. No update or delete operation is ever permitted.**
Every screening decision, role change, financial entry, and escalation event writes an `AuditLog` record. This table must never be modified after creation. This is enforced by a Prisma query extension that throws an error on any `update`, `upsert`, or `delete` operation targeting `AuditLog`, regardless of who calls it. Administrators have no UI to edit or remove audit records.

**4. A Paystack donation record is only written to the database after the Paystack webhook confirms payment success.**
The donation flow initiates a Paystack transaction and stores a pending reference. The `Donation` record is not created, and no receipt is sent, until the `/api/webhooks/paystack` handler receives and verifies a `charge.success` event with a matching reference. Writing a donation record before webhook confirmation produces false financial data and corrupts the donor's history.

**5. The Deputy Program Director is always a role assigned to a user — never a hardcoded user ID.**
No file in the codebase may reference a specific user ID as the deputy or fallback decision-maker. The escalation logic must query the `User` table for the current user with `role = deputy_program_director`. If no such user exists, the escalation must halt and alert the Administrator — it must never fall back to a hardcoded individual.

**6. Administrators cannot create, edit, or approve financial records.**
The Finance Officer role is the only role permitted to write to the `Expenditure` and `GrantMilestone` tables. Administrator access to the finance dashboard is read-only. This separation of duties is enforced at the API route level — any write request to a financial endpoint from a user with the `administrator` role must be rejected with a 403, even if that Administrator is also the platform owner.

**7. A candidate's pipeline track assignment cannot be changed after their application is submitted.**
Once an `Application` record has `status = submitted`, the `pipelineTrack` field is locked. No API route, administrator action, or screening decision may update it. If a borderline review determines the initial assignment was incorrect, the application must be rejected and the candidate invited to reapply in the correct track. Allowing mid-pipeline track changes breaks milestone integrity, mentorship matching logic, and audit consistency.

**8. Files are never stored in the database.**
No binary file content, base64-encoded data, or raw file bytes may be written to any PostgreSQL column. The database stores only Supabase Storage URLs. Any upload handler must complete the Supabase Storage upload first and write only the resulting URL to the database. For private files, signed URLs are generated at request time and never persisted. This keeps the database performant, the storage costs predictable, and the backup strategy clean.
