# Memory — Phase 3 Application System Handoff

Last updated: 2026-07-16 12:15 +01:00

## What was built

- Phase 3 Unit 3.1 local Prisma schema work is in place.
- Added the application-system enums and models in `prisma/schema.prisma`, including `Application`, the application detail tables, `AssessmentQuestion`, and `AssessmentResponse`.
- Added `Cohort.applications` for the cohort-to-application back-relation.
- Added `User.application` and `Application.user`, with `Application.userId` referencing `User.clerkId`.
- Created migration folder `prisma/migrations/20260716092307_add_application_system`.
- Created migration folder `prisma/migrations/20260716114222_add_application_user_relation`.
- Updated `context/progress-tracker.md` to keep Phase 3 active and record the current blockers.
- Phase 2 public pages and visual QA are marked Done.

## Decisions made

- Because Grace reported `20260716092307_add_application_system` has already been applied, the user/application foreign-key correction was added as a new migration instead of editing the applied migration.
- `Application.userId` intentionally links to `User.clerkId`, matching the Clerk-derived user identity used throughout auth and API access checks.

## Problems solved

- Fixed the missing explicit Prisma relation between `Application` and `User`, enabling referential integrity and relational queries.
- `npx prisma validate` passes after adding the relation.

## Current state

- Active phase: Phase 3 — Application System.
- Current unit: Unit 3.1 — Add `Application`, `AssessmentQuestion`, `AssessmentResponse` Prisma models and migrate.
- Grace reported migration `20260716092307_add_application_system` has been applied.
- Migration `20260716114222_add_application_user_relation` still needs applying.
- Local migration status verification is still blocked because Prisma CLI resolves to the Supabase pooler URL and `npx prisma migrate status` fails with a schema engine error.
- Prisma generation is still blocked by a Windows `EPERM` file lock on `node_modules/.prisma/client/query_engine-windows.dll.node`.
- Latest validation: `npx prisma validate` passes; `npm run lint` passes with the existing unrelated `FeatureCard` warning in `app/(public)/impact/page.tsx`; `git diff --check` passes; conflict-marker scan is clean.
- Phase 1 external verification remains pending for migration status and Supabase Storage bucket confirmation.

## Next session starts with

1. Run `/remember restore`.
2. Apply `20260716114222_add_application_user_relation`.
3. Replace `DIRECT_URL` with a true direct non-pooler Supabase database URL for local migration/status verification.
4. Stop the Node process locking Prisma Client if needed, then rerun `npx prisma generate`.
5. Verify migrations: `20260713000029_init_identity_auth_rbac`, `20260713010000_add_cohort_model`, `20260716092307_add_application_system`, and `20260716114222_add_application_user_relation`.
6. Recheck `GET /api/cohorts/active`; expected closed-state response with no open cohort is `{ data: { isOpen: false, cohort: null } }`.
7. Resume Phase 3 Unit 3.1 verification after database and Prisma generation blockers are cleared.

## Open questions

- What is the correct true direct non-pooler Supabase URL for Prisma migration/status commands?
- Which Node process can be stopped to release the Prisma Client query-engine file lock?
- Are all five Supabase Storage buckets provisioned?
- Has the initial Phase 1 migration already been applied cleanly in Supabase?
- Should a real contact-form email be sent during verification, or should Resend be verified through test/mocked delivery?
