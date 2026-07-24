# NIDC Platform — Progress Tracker

This file is the single source of truth for build progress. It must be read at the start of every session and updated at the end of every session. No unit of work is considered complete until it is marked done here.

---

## Current Status

**Active Phase:** Phase 3 — Application System
**Current Unit:** Phase 3 verification — apply pending migrations, seed assessment questions, and clear Prisma generate file lock
**Last Updated:** 2026-07-24
**Build Status:** Feature Spec 03 local implementation is in place: application schema fixed, `Notification` model and migration added, seed script added, application APIs added, applicant form/dashboard added, and `ui-registry.md` imprinted. On 2026-07-24, `npx prisma validate`, `npx prisma generate --no-engine`, `npx tsc --noEmit`, and `npm run lint` passed, with one existing lint warning in `app/(public)/impact/page.tsx`. Full `npm run build` remains blocked by a Windows EPERM lock on `node_modules/.prisma/client/query_engine-windows.dll.node`. `npx next build` with network access now compiles and type-checks, but fails prerendering `/applicant/apply` because the protected page uses Clerk request headers while Next attempts static rendering. Grace explicitly approved `npx prisma migrate deploy` on 2026-07-24; migrations `20260716114222_add_application_user_relation` and `20260717000000_add_notification_model` were applied successfully, and `npx prisma migrate status` now reports the database schema is up to date. `ts-node` is installed for Prisma seeding, but `npx prisma db seed` has not run because seeding would write to the configured database and requires explicit approval.

---

## Phase Overview

| Phase | Name | Status |
|---|---|---|
| 1 | Foundation | In progress — local implementation complete; external provisioning pending |
| 2 | Public Facing Pages | Done |
| 3 | Application System | In progress — local Feature Spec 03 implementation complete; migrations applied; seed, protected route prerender fix, and full build verification blocked |
| 4 | Screening Workflow | Not started |
| 5 | Interview Management | Not started |
| 6 | Candidate Dashboard | Not started |
| 7 | Mentorship System | Not started |
| 8 | Donation and Funding | Not started |
| 9 | Admin and Governance | Not started |

---

## Phase 1 — Foundation

**Goal:** Get the core infrastructure in place. Every subsequent phase depends on this being correct and stable.

| Unit | Description | Status |
|---|---|---|
| 1.1 | Initialise Next.js project with TypeScript and App Router | Done |
| 1.2 | Configure `tsconfig.json` with strict mode enabled | Done |
| 1.3 | Install and configure Tailwind CSS | Done |
| 1.4 | Extend Tailwind config with NIDC colour tokens and design scale | Done |
| 1.5 | Install and configure Clerk — proxy, provider, environment variables | Done |
| 1.6 | Create Clerk webhook handler at `app/api/webhooks/clerk/route.ts` — creates User record and assigns invite role or `applicant` role on `user.created` | Done |
| 1.7 | Set up Supabase project — provision PostgreSQL database and Storage buckets | Pending Storage bucket confirmation |
| 1.8 | Install Prisma, initialise schema, connect to Supabase PostgreSQL via connection string | Done locally; Prisma CLI loads `.env.local` via `prisma.config.ts` |
| 1.9 | Define Phase 1 core Prisma models — `User`, `Organization`, `OrganizationMember`, `Invite`, `AuditLog` | Done |
| 1.10 | Run first migration and verify it applies cleanly | Needs verification — migration file exists, but `npx prisma migrate status` returned a schema engine error via `DIRECT_URL` |
| 1.11 | Create `lib/prisma.ts` — Prisma client singleton with AuditLog append-only query extension | Done |
| 1.12 | Create `lib/clerk.ts` — server-side role check helpers | Done |
| 1.13 | Create `lib/storage.ts` — Supabase Storage client, upload helpers, signed URL generation | Done |
| 1.14 | Create `lib/resend.ts` — Resend client initialisation | Done |
| 1.15 | Create `lib/paystack.ts` — Paystack signature helper placeholder | Done |
| 1.16 | Create `lib/escalation.ts` — placeholder file, escalation logic implemented in Phase 4 | Done |
| 1.17 | Configure `.env.example` with all environment variables introduced in Phase 1 | Done |
| 1.18 | Deploy shell application to Vercel — confirm build passes and environment variables are set | Done — deployed successfully on Vercel |

---

## Phase 2 — Public Facing Pages

**Goal:** Build all ten public-facing pages. No authentication required. Every page must have a metadata export.

| Unit | Description | Status |
|---|---|---|
| 2.1 | Build shared navigation and footer components | Done |
| 2.2 | Home page — NIDC overview, CTA to apply | Done |
| 2.3 | About page — mission, vision, origin story | Done |
| 2.4 | Programs page — Educational Pathway and Direct Development Track explained | Done |
| 2.5 | Sectors page — Energy, Manufacturing and Industrial Systems, Digital Infrastructure | Done |
| 2.6 | Apply page — eligibility criteria, cohort status, application window, CTA | Done |
| 2.7 | Donate page — funding model, impact summary, Paystack donation CTA | Done |
| 2.8 | Impact page — public metrics, candidates in pipeline, cohorts completed | Done |
| 2.9 | Contact page — contact form | Done — invalid request path verified; live Resend send not exercised to avoid sending a real email |
| 2.10 | FAQs page — common candidate and donor questions | Done |
| 2.11 | Blog page — cohort announcements and updates index | Done |
| 2.12 | Verify all pages are responsive at 375px, 768px, and 1280px | Done |

---

## Phase 3 — Application System

**Goal:** A candidate can land on the site, create an account, complete and submit a saveable application form including the diagnostic assessment, and receive confirmation.

| Unit | Description | Status |
|---|---|---|
| 3.1 | Add `Application`, `AssessmentQuestion`, `AssessmentResponse` Prisma models and migrate | Done — migrations `20260716114222_add_application_user_relation` and `20260717000000_add_notification_model` applied successfully on 2026-07-24; `npx prisma migrate status` reports the database schema is up to date |
| 3.2 | Build cohort management — open and close application windows | Open question — Feature Spec 03 dependencies say to create an open cohort manually via Prisma Studio or seed script for testing, while this tracker lists cohort management as a Phase 3 unit and Phase 9.4 also owns cohort management |
| 3.3 | Build application form shell — multi-step, saveable, resumable | Done locally — implemented at `/applicant/apply`; end-to-end database testing still needs pending migrations, seed data, and an open cohort |
| 3.4 | Build diagnostic assessment step within application form | Done locally — Step 6 fetches active questions without `correctOption`; runtime testing still needs assessment seed data |
| 3.5 | Build pipeline assignment logic — Educational Pathway or Direct Development Track based on assessment result | Done locally — assessment route scores responses and assigns `educational_pathway`, `borderline`, or `direct_development_track` |
| 3.6 | Build borderline result flagging — routes to screening team manual review | Done locally — score 5 sets `pipelineTrack = borderline` and `isBorderline = true` |
| 3.7 | Build application submission — sets status to submitted, locks `pipelineTrack` field | Done locally — submit route sets submitted status, writes audit log and notification, and step/assessment routes reject submitted applications |
| 3.8 | Build `POST /api/applications` — creates or updates application record | Done locally — route creates or returns the user's draft application for the active cohort |
| 3.9 | Build `GET /api/applications/[id]` — retrieves application for resuming | Done locally with spec route — Feature Spec 03 defines `GET /api/applications/me`; confirm no separate `[id]` resume route is required |
| 3.10 | Build applicant-facing submission confirmation state | Done locally — applicant dashboard shows start, resume, submitted, success, and unread notification states |

---

## Phase 4 — Screening Workflow

**Goal:** The screening team can review submitted applications, cast consensus votes, and unresolved decisions escalate automatically after 48 hours.

| Unit | Description | Status |
|---|---|---|
| 4.1 | Add `ScreeningVote`, `EscalationRecord` Prisma models and migrate | Not started |
| 4.2 | Build `POST /api/screening/vote` — validates role, writes vote, checks consensus | Not started |
| 4.3 | Build `GET /api/screening/votes/[applicationId]` — returns all votes for an application | Not started |
| 4.4 | Build escalation logic in `lib/escalation.ts` — 48-hour check, Program Director routing, Deputy fallback | Not started |
| 4.5 | Build `POST /api/cron/escalation-check` — cron endpoint, protected by `CRON_SECRET` | Not started |
| 4.6 | Build `POST /api/cron/deputy-escalation` — 24-hour deputy fallback cron endpoint | Not started |
| 4.7 | Configure Vercel Cron Jobs for escalation-check and deputy-escalation | Not started |
| 4.8 | Build screening team dashboard — application queue, review interface | Not started |
| 4.9 | Build consensus vote UI component | Not started |
| 4.10 | Build shortlist management interface | Not started |
| 4.11 | Build `Notification` and `AuditLog` Prisma models and migrate | Not started |
| 4.12 | Build rejection notification dispatch — Resend email and in-platform notification | Not started |
| 4.13 | Build escalation notification dispatch — Resend email and in-platform notification to Program Director | Not started |

---

## Phase 5 — Interview Management

**Goal:** Shortlisted candidates receive an interview link and automated reminders. Outcomes are recorded and candidates are notified.

| Unit | Description | Status |
|---|---|---|
| 5.1 | Add `Interview`, `InterviewOutcome` Prisma models and migrate | Not started |
| 5.2 | Build `POST /api/interviews` — screening team inputs interview link and scheduled time | Not started |
| 5.3 | Build interview link distribution — sends Resend email and in-platform notification to all shortlisted candidates | Not started |
| 5.4 | Build `POST /api/cron/interview-reminders` — sends reminders 24 hours and 1 hour before interview | Not started |
| 5.5 | Configure Vercel Cron Job for interview-reminders | Not started |
| 5.6 | Build `POST /api/interviews/[id]/outcome` — records pass or fail per candidate | Not started |
| 5.7 | Build post-interview notification dispatch — Resend email and in-platform notification for pass and fail outcomes | Not started |
| 5.8 | Build interview management UI for screening team — link input, candidate list, outcome recording | Not started |

---

## Phase 6 — Candidate Dashboard

**Goal:** Accepted candidates can log in and view their pipeline track, current stage, milestones, documents, and notifications.

| Unit | Description | Status |
|---|---|---|
| 6.1 | Build role upgrade logic — sets Clerk `publicMetadata` role to `candidate` on interview acceptance | Not started |
| 6.2 | Build candidate dashboard layout and shell | Not started |
| 6.3 | Build pipeline track and current stage display | Not started |
| 6.4 | Build milestone tracking component | Not started |
| 6.5 | Build documents and resources section — signed URLs from Supabase Storage | Not started |
| 6.6 | Build notifications centre — reads from `Notification` table, marks as read | Not started |

---

## Phase 7 — Mentorship System

**Goal:** Accepted candidates are matched with mentors. Both parties can log sessions and track milestones on the platform.

| Unit | Description | Status |
|---|---|---|
| 7.1 | Add `MentorProfile`, `MentorMatch`, `MentorSession`, `MentorMilestone` Prisma models and migrate | Not started |
| 7.2 | Build mentor registration flow — creates MentorProfile, assigns `mentor` role via Clerk | Not started |
| 7.3 | Build mentor profile page — sector, background, availability | Not started |
| 7.4 | Build mentor-candidate matching interface for administrators and screening team | Not started |
| 7.5 | Build `POST /api/mentorship/match` — creates MentorMatch record | Not started |
| 7.6 | Build `POST /api/mentorship/sessions` — logs a session, accessible to mentor and candidate | Not started |
| 7.7 | Build milestone tracking — create, update, and complete milestones against a match | Not started |
| 7.8 | Build mentor dashboard — assigned candidates, session history, milestone status | Not started |
| 7.9 | Build candidate mentorship dashboard — mentor profile, session history, milestone status | Not started |

---

## Phase 8 — Donation and Funding

**Goal:** Local Nigerian donors can make Naira donations via Paystack and receive receipts. Finance Officer can manage grants and record expenditures.

| Unit | Description | Status |
|---|---|---|
| 8.1 | Add `Donation`, `Grant`, `GrantMilestone`, `Expenditure` Prisma models and migrate | Not started |
| 8.2 | Build `POST /api/donations/initiate` — creates Paystack transaction, stores pending reference | Not started |
| 8.3 | Build Paystack webhook handler at `app/api/webhooks/paystack/route.ts` — verifies signature, writes Donation record on `charge.success` | Not started |
| 8.4 | Build donation receipt dispatch — Resend email sent after webhook confirmation | Not started |
| 8.5 | Build donor dashboard — donation history, impact metrics | Not started |
| 8.6 | Build grant management interface for Finance Officer — create grant, add milestones, upload documentation to Supabase Storage | Not started |
| 8.7 | Build expenditure entry interface for Finance Officer — record expenditure, attach receipt via Supabase Storage | Not started |
| 8.8 | Build financial report generation for Finance Officer | Not started |
| 8.9 | Build public impact metrics on Donate and Impact pages — reads aggregate data from database | Not started |

---

## Phase 9 — Admin and Governance

**Goal:** Administrators can manage users, roles, cohorts, and audit trails. The platform is fully operational end to end.

| Unit | Description | Status |
|---|---|---|
| 9.1 | Build administrator dashboard shell | Not started |
| 9.2 | Build user management — list users, assign roles, revoke roles | Not started |
| 9.3 | Build Deputy Program Director assignment interface — Program Director assigns and reassigns the role | Not started |
| 9.4 | Build cohort management — create cohorts, open and close application windows, view cohort records | Not started |
| 9.5 | Build audit trail viewer — read-only log of all screening decisions, role changes, and financial entries | Not started |
| 9.6 | Build platform-wide settings interface | Not started |
| 9.7 | Run full end-to-end verification against all twelve success criteria in `project-overview.md` | Not started |
| 9.8 | Confirm `npm run build` passes with zero errors on production build | Not started |
| 9.9 | Confirm all environment variables are set correctly in Vercel production environment | Not started |

---

## Open Questions

Questions that surfaced during the build and require a decision before the relevant unit can be completed. Add questions here rather than making silent assumptions.

| # | Question | Phase/Unit Blocked | Raised | Resolved |
|---|---|---|---|---|
| 1 | Feature Spec 01 defines `grant_officer` as the ninth role, while `project-overview.md` and `architecture.md` define `donor` as the ninth role. Which role set should implementation use? | Phase 1 / Feature Spec 01 | 2026-07-12 | Yes — use ten roles: both `donor` and `grant_officer` are valid |
| 2 | Provide the live Supabase `DATABASE_URL`, confirm the five Storage buckets exist, and provide Vercel project access/environment values so Phase 1 external setup can be completed. | Phase 1 / Units 1.7, 1.10, 1.18 | 2026-07-12 | Partially — local Supabase environment values provided and Vercel deployment completed; Storage bucket confirmation still pending |
| 3 | Add a `DIRECT_URL` using Supabase direct connection or session pooler so Prisma Migrate does not run through the transaction pooler. | Phase 1 / Unit 1.10 | 2026-07-13 | Yes — `DIRECT_URL` is present locally |
| 4 | Confirm whether the live Supabase database has applied migration `20260713000029_init_identity_auth_rbac`, or replace `DIRECT_URL` with a Supabase direct non-pooler connection if the session pooler keeps failing. | Phase 1 / Unit 1.10 | 2026-07-13 | No |
| 5 | Feature Spec 02 says the agent starts after Feature Spec 01 verification checklist is fully passed, but the tracker still shows Phase 1 external setup pending. Should Phase 2 local implementation proceed before live migration and Storage bucket verification are complete? | Phase 2 / Feature Spec 02 start condition | 2026-07-13 | Yes — proceed with Phase 2 local implementation while Phase 1 external verification remains pending |
| 6 | `AGENTS.md` requires `ui-context.md` as the design-system source of truth, but no `ui-context.md` file exists in the repository. Should the missing file be provided before Phase 2 UI work starts? | Phase 2 / Public UI implementation | 2026-07-13 | Yes — treat all references to `ui-context.md` as `context/ui-rules.md` |
| 7 | Replace the current Prisma migration connection with a true direct non-pooler Supabase database URL so migrations `20260713000029_init_identity_auth_rbac`, `20260713010000_add_cohort_model`, `20260716092307_add_application_system`, and `20260716114222_add_application_user_relation` can be verified/applied. | Phase 1 / Unit 1.10, Phase 2 / Active Cohort API, and Phase 3 / Unit 3.1 | 2026-07-13 | Partially — `20260716092307_add_application_system` reported applied by Grace, but Prisma CLI still resolves to the Supabase pooler URL and local status verification fails; `20260716114222_add_application_user_relation` still needs applying |
| 8 | Feature Spec 03 says the agent starts after Feature Spec 02 verification checklist is fully passed, but the tracker still shows Phase 2 migration verification and visual breakpoint QA pending. Should Phase 3 implementation proceed before Phase 2 verification is complete? | Phase 3 / Feature Spec 03 start condition | 2026-07-16 | Yes — Grace instructed the tracker to mark Phase 2 as done and proceed to Phase 3 |
| 9 | Can the running Node process holding `node_modules/.prisma/client/query_engine-windows.dll.node` be stopped so `npx prisma generate` can update the generated Prisma client? | Phase 3 / Unit 3.1 | 2026-07-16 | No |
| 10 | Do you explicitly approve applying pending migrations `20260716114222_add_application_user_relation` and `20260717000000_add_notification_model` to the configured remote Supabase database with `npx prisma migrate deploy`? | Phase 3 / Unit 3.1 verification | 2026-07-17 | Yes — Grace explicitly approved on 2026-07-24; migrations applied successfully and status is up to date |
| 11 | Do you approve running `npx prisma db seed` against the configured database to create the 10 assessment questions? | Phase 3 / Assessment seed verification | 2026-07-17 | No — `ts-node` is installed; seed execution still needs approval because it writes to the configured database |
| 12 | Feature Spec 03 defines `GET /api/applications/me`, but this tracker listed Unit 3.9 as `GET /api/applications/[id]`. Is `/api/applications/me` the intended resume route for Phase 3, with no separate `[id]` route required? | Phase 3 / Unit 3.9 | 2026-07-17 | No |
| 13 | Feature Spec 03 dependencies say to create an open cohort manually via Prisma Studio or seed script before testing, but Unit 3.2 lists cohort management and Phase 9.4 also owns cohort management. Should Phase 3 cohort management be deferred to Phase 9.4/admin management, or built before Phase 4? | Phase 3 / Unit 3.2 | 2026-07-17 | No |
| 14 | Do you approve a targeted Next.js rendering fix for protected applicant pages so `/applicant/apply` is not prerendered statically during `next build`? | Phase 3 / Build verification | 2026-07-24 | No |

---

## Decisions Log

Decisions made during the build that are not captured in the main spec files. Record them here to avoid relitigating them in future sessions.

| # | Decision | Reason | Session |
|---|---|---|---|
| 1 | Implement identity/auth/RBAC with ten roles: `applicant`, `candidate`, `mentor`, `screening_team`, `program_director`, `deputy_program_director`, `finance_officer`, `administrator`, `grant_officer`, and `donor`. | Grace confirmed both `donor` and `grant_officer` are valid roles and updated the context files. | 2026-07-12 |
| 2 | Use `proxy.ts` rather than `middleware.ts` for Clerk route protection. | The project is on Next.js 16, and the Next.js docs rename Middleware to Proxy while preserving this route-protection use case. | 2026-07-12 |
| 3 | Enforce `AuditLog` append-only behavior with a Prisma query extension rather than `$use` middleware. | The generated Prisma 6.19.3 client in this project does not expose `$use`; the query extension rejects `update`, `updateMany`, `upsert`, `delete`, and `deleteMany` for `AuditLog`. | 2026-07-12 |
| 4 | Add `prisma.config.ts` to load `.env.local` before Prisma CLI commands. | Prisma CLI does not load Next.js `.env.local` by default, which caused `DATABASE_URL` to be missing during schema validation. | 2026-07-13 |
| 5 | Configure Prisma CLI to prefer `DIRECT_URL` for migrations while keeping `DATABASE_URL` for runtime traffic. | Prisma Migrate cannot run reliably through Supabase transaction pooling and failed with prepared statement `s1` already exists. | 2026-07-13 |
| 6 | Treat all project references to `ui-context.md` as references to `context/ui-rules.md`. | The design-system file exists as `context/ui-rules.md`; Grace confirmed this is the canonical UI context for the project. | 2026-07-13 |
| 7 | Proceed with Feature Spec 02 local implementation before Phase 1 external migration and Storage verification are complete. | Grace explicitly confirmed to proceed; unresolved Phase 1 external checks remain tracked separately. | 2026-07-13 |
| 8 | Use root-level role routes such as `/applicant`, `/screening`, `/finance`, and `/admin`; `app/(dashboard)` remains a route group only. | Grace confirmed the compiled root-level route shape is intentional, so proxy and Clerk redirects must not point to `/dashboard/*`. | 2026-07-13 |
| 9 | Run `prisma generate` before `next build`. | Vercel build failed because the generated Prisma Client did not include the new `Cohort` delegate, causing `prisma.cohort` to fail TypeScript checks. | 2026-07-13 |
| 10 | Mark Phase 2 Public Facing Pages as Done and move active work to Phase 3 Application System. | Grace instructed the tracker to update the phase as done after the Phase 3 gate question was raised. | 2026-07-16 |
| 11 | Configure Prisma seed through `prisma.config.ts` rather than `package.json#prisma`. | This repo uses Prisma config, and Prisma warns that package.json Prisma configuration is ignored when `prisma.config.ts` is present. | 2026-07-17 |
| 12 | Keep `AssessmentQuestion.order` non-unique and make the seed idempotent with find/update-or-create logic. | Feature Spec 03 does not define `order` as unique, so Prisma cannot upsert directly by `order` without changing the schema beyond the spec. | 2026-07-17 |
| 13 | Use actual root-level role routes `/applicant` and `/applicant/apply` for the applicant dashboard and form. | Existing Decision 8 says `app/(dashboard)` is a route group only, so Feature Spec 03 references to `/dashboard/applicant` map to the compiled `/applicant` route shape in this repo. | 2026-07-17 |
| 14 | Let the client application form call the Phase 3 internal API routes directly. | Feature Spec 03 explicitly requires the form to call `GET /api/applications/me`, `POST /api/applications`, step PATCH routes, assessment submit, and final submit from the page flow. | 2026-07-17 |
| 15 | Let `requireRole` fall back to Clerk `currentUser().publicMetadata.role` when the session claims do not include a valid role. | Clerk role metadata remains the authority, but session claims may be stale or missing the role claim; the fallback prevents valid applicant users from being treated as unauthorised. | 2026-07-17 |
| 16 | Self-heal missing or malformed public applicant metadata only for auth checks that allow the `applicant` role. | In local/dev flows the Clerk webhook may not populate a new public user's role before they visit `/applicant`; the helper now sets Clerk `publicMetadata.role = applicant`, creates or reconnects the mirrored `User` row, and leaves valid non-applicant Clerk roles protected. | 2026-07-17 |

---

## Notes for Next Session

_Update this section at the end of every session. Describe exactly where you stopped, what was left incomplete, and what the next action is._

Phase 3 Application System is implemented locally against Feature Spec 03. Added schema fixes, `Notification`, migration `20260717000000_add_notification_model`, `prisma/seed.ts`, application APIs, assessment questions API, notifications API, the applicant form at `/applicant/apply`, the applicant dashboard states at `/applicant`, confirmation email helper, architecture notes, and UI registry entries. `ts-node` is installed for Prisma seed execution. Fixed the applicant page runtime `UNAUTHORISED` error by making `requireRole` fall back to Clerk user `publicMetadata.role` when session claims do not include the role; if a public applicant has no valid role metadata because the Clerk webhook has not populated it yet or metadata is malformed, the helper now sets Clerk `publicMetadata.role = applicant` and creates or reconnects the mirrored `User` row before allowing applicant-only pages/routes. Applicant pages redirect cleanly for unauthenticated or genuinely wrong-role users. On 2026-07-24, verified `npx prisma validate`, `npx prisma generate --no-engine`, `npx tsc --noEmit`, and `npm run lint` pass; lint still reports one warning in `app/(public)/impact/page.tsx` for an unused `FeatureCard` import. Grace explicitly approved `npx prisma migrate deploy`; migrations `20260716114222_add_application_user_relation` and `20260717000000_add_notification_model` were applied successfully, and `npx prisma migrate status` reports the database schema is up to date. Full `npm run build` still fails at Prisma generate because a Windows Node process is holding `node_modules/.prisma/client/query_engine-windows.dll.node`. Running `npx next build` directly with network access gets past compilation and TypeScript but fails prerendering `/applicant/apply` because the protected page uses Clerk request headers while Next attempts static rendering. `npx prisma db seed` has not run because seeding would write to the configured database. Next action: Grace should decide open questions 11-14, explicitly approve seed if desired, decide `/api/applications/me` versus `[id]`, decide Phase 3 cohort management ownership, approve the protected route prerender fix, clear the Prisma DLL lock, and run the full Feature Spec 03 verification checklist before starting Phase 4.
