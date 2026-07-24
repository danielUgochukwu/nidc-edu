# Memory — Phase 3 Application System Verification

Last updated: 2026-07-24 12:25 +01:00

## What was built

- Phase 3 Application System is locally implemented against `context/features-specs/03-application-system.md`.
- Added/updated the Phase 3 Prisma schema surface: application models, assessment models, `Notification`, `Application.user` relation, and related migrations.
- Added `prisma/seed.ts` and configured Prisma seeding through `prisma.config.ts`.
- Added Phase 3 API routes under `app/api/applications`, `app/api/assessments/questions`, and `app/api/notifications/me`.
- Added applicant-facing application UI at `/applicant/apply` via `components/forms/ApplicationForm.tsx`.
- Updated applicant dashboard states at `/applicant`, including start/resume/submitted states and unread notifications.
- Added confirmation email helper in `lib/resend.ts`.
- Updated `context/progress-tracker.md` with current verification status.

## Decisions made

- Use compiled root-level dashboard routes such as `/applicant` and `/applicant/apply`; `app/(dashboard)` is only a route group.
- Use `GET /api/applications/me` as the Phase 3 resume route per Feature Spec 03, though the tracker still has an unresolved confirmation question about whether a separate `[id]` route is needed.
- Keep `AssessmentQuestion.order` non-unique and make the seed idempotent without changing the schema beyond the spec.
- Let the Phase 3 client form call the internal application API routes directly because the feature spec explicitly requires that flow.
- `requireRole` now falls back to Clerk `currentUser().publicMetadata.role` when session claims do not include a valid role, and self-heals missing public applicant metadata only for applicant-allowed checks.

## Problems solved

- Fixed the applicant dashboard runtime error caused by the missing `public.notifications` table.
- Grace explicitly approved `npx prisma migrate deploy` against the configured Supabase database.
- Applied migrations `20260716114222_add_application_user_relation` and `20260717000000_add_notification_model`.
- Confirmed `npx prisma migrate status` now reports the database schema is up to date.
- Verified `npx prisma validate`, `npx prisma generate --no-engine`, `npx tsc --noEmit`, and `npm run lint` pass. Lint still has one unrelated warning for unused `FeatureCard` in `app/(public)/impact/page.tsx`.

## Current state

- Active phase: Phase 3 — Application System.
- Current unit: Phase 3 verification.
- Remote migrations are applied and no longer blocking.
- `npx prisma db seed` has not run because it writes assessment questions to the configured database and still needs explicit approval.
- At least one open cohort still needs to exist for end-to-end application testing.
- Full `npm run build` still fails during `prisma generate` because Windows is holding `node_modules/.prisma/client/query_engine-windows.dll.node`.
- Direct `npx next build` with network access compiles and type-checks, but fails prerendering `/applicant/apply` because the protected page uses Clerk request headers while Next attempts static rendering.
- `context/progress-tracker.md` open questions 11-14 remain unresolved: seed approval, `/api/applications/me` vs `[id]`, Phase 3 cohort management ownership, and approval for the protected route prerender fix.

## Next session starts with

1. Run `/remember restore`.
2. Ask Grace to explicitly approve `npx prisma db seed` if she wants the 10 assessment questions inserted into the configured database.
3. Decide whether `/api/applications/me` is the only Phase 3 resume route or whether `GET /api/applications/[id]` is still required.
4. Decide whether Phase 3 cohort management is deferred to Phase 9 admin/cohort management or must be built before Phase 4.
5. Apply the protected route rendering fix for `/applicant/apply` once approved, likely by marking the protected applicant pages dynamic.
6. Clear the Prisma DLL lock or stop the Node process holding it, then rerun full `npm run build`.
7. Run the full Feature Spec 03 verification checklist, including seed data, one open cohort, application flow, assessment scoring, notifications, and confirmation email.

## Open questions

- Do you approve running `npx prisma db seed` against the configured database to create the 10 assessment questions?
- Is `/api/applications/me` the intended resume route for Phase 3, with no separate `[id]` route required?
- Should Phase 3 cohort management be deferred to Phase 9.4, or built before Phase 4?
- Do you approve the targeted Next.js rendering fix so `/applicant/apply` is not prerendered statically during `next build`?
- Which Node process can be stopped to release the Prisma Client query-engine DLL lock?
- Are all five Supabase Storage buckets provisioned?
