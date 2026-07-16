# Memory — Merge Conflict Cleanup Handoff

Last updated: 2026-07-16 08:07 +01:00

## What was built

- Resolved all remaining merge conflict markers in:
  - `app/(auth)/sign-in/page.tsx`
  - `app/(auth)/sign-up/page.tsx`
  - `lib/resend.ts`
  - `lib/storage.ts`
  - `context/progress-tracker.md`
- Auth pages now consistently use `forceRedirectUrl="/applicant"`.
- `lib/resend.ts` retains the lazy `resend` proxy export required by `app/api/contact/route.ts`.
- `lib/storage.ts` retains the lazy `supabase` proxy export and removed duplicated proxy-target/marker debris.
- `context/progress-tracker.md` now reconciles Phase 2 as the active phase while preserving pending Phase 1 Supabase migration/storage verification.

## Decisions made

- Chose `/applicant` over `/dashboard` for Clerk sign-in/sign-up redirects because Grace previously confirmed `app/(dashboard)` is a route group and role dashboards compile as root-level routes.
- Kept the lazy Resend and Supabase proxy exports because current code and specs import the clients directly while still needing environment variables to be read lazily.
- Did not fix the existing unused `FeatureCard` lint warning in `app/(public)/impact/page.tsx`; it is unrelated to the merge-conflict findings.

## Problems solved

- Removed repository-wide conflict markers; a final `rg -n "^(<<<<<<<|=======|>>>>>>>)" .` scan found none.
- Fixed trailing whitespace introduced in `context/progress-tracker.md`; `git diff --check` now passes.
- Confirmed production build may fail in the restricted sandbox because `next/font/google` needs network access for Inter and Poppins. Rerunning `npm run build` with approved network access passed.

## Current state

- Modified files: `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`, `lib/resend.ts`, `lib/storage.ts`, and `context/progress-tracker.md`.
- Validation results from 2026-07-16:
  - `npx prisma validate` passes.
  - `npm run lint` passes with one unrelated warning in `app/(public)/impact/page.tsx` for unused `FeatureCard`.
  - `npm run build` passes with network access approved for Google Fonts.
  - Conflict marker scan is clean.
  - `git diff --check` passes.
- Phase 2 public pages remain locally implemented.
- Live Supabase migration verification is still unresolved; `GET /api/cohorts/active` is still expected to return 500 until the Cohort migration is applied.
- Phase 1 external verification remains pending for migration status and Supabase Storage bucket confirmation.

## Next session starts with

1. Run `/remember restore`.
2. Replace `DIRECT_URL` with a true direct non-pooler Supabase database URL.
3. Apply or verify both migrations: `20260713000029_init_identity_auth_rbac` and `20260713010000_add_cohort_model`.
4. Recheck `GET /api/cohorts/active`; expected closed-state response with no open cohort is `{ data: { isOpen: false, cohort: null } }`.
5. Complete browser visual QA at 375px, 768px, and 1280px.
6. After database and visual QA pass, update `context/progress-tracker.md` to mark Phase 2 verification complete.

## Open questions

- What is the correct true direct non-pooler Supabase URL for Prisma migration/schema-engine commands?
- Are all five Supabase Storage buckets provisioned?
- Has the initial Phase 1 migration already been applied cleanly in Supabase?
- Should a real contact-form email be sent during verification, or should Resend be verified through test/mocked delivery?
