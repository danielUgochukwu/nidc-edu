# Memory — Phase 2 Public Pages Handoff

Last updated: 2026-07-13 07:55 +01:00

## What was built

- Phase 2 public-facing pages are locally implemented under `app/(public)`: `/`, `/about`, `/programs`, `/sectors`, `/apply`, `/donate`, `/impact`, `/contact`, `/faqs`, `/blog`, and `/blog/[slug]`.
- Added shared public UI components in `components/public/`: `PublicNav`, `PublicFooter`, `PublicLinkButton`, `PublicSection`, `CohortStatusBanner`, `ApplyCta`, `ContactForm`, and `FAQAccordion`.
- Public nav and footer use the official NIDC logo asset at `public/images/logo.png`.
- Added `POST /api/contact` for the contact form and `GET /api/cohorts/active` for the Apply page cohort-status banner.
- Added Prisma `CohortStatus` enum and `Cohort` model in `prisma/schema.prisma`.
- Added migration folder `prisma/migrations/20260713010000_add_cohort_model/`.
- Updated `proxy.ts` to allow unauthenticated public access to `/api/contact` and `/api/cohorts/active`.
- Updated `context/architecture.md`, `context/progress-tracker.md`, and created `ui-registry.md` with the public UI patterns.
- Removed the old root `app/page.tsx` because `/` now lives at `app/(public)/page.tsx`.

## Decisions made

- Grace confirmed Feature Spec 02 local implementation should proceed even though Phase 1 external Supabase verification remains pending.
- Grace confirmed all references to `ui-context.md` should be treated as `context/ui-rules.md`.
- The public brand mark is the official `/public/images/logo.png`, not a text-only NIDC wordmark.
- Favicon/icon workspace state belongs to Grace; do not treat `app/favicon.ico` deletion or `public/images/icon.png` as unexpected agent changes.

## Problems solved

- Replaced text-only public nav/footer branding with the official logo asset.
- Removed explicit `any` usage from the lazy Resend and Supabase client proxies so lint passes.
- Escaped JSX apostrophes that caused `react/no-unescaped-entities` lint failures.
- Production build fails without network access because `next/font/google` fetches Inter and Poppins; rerunning `npm run build` with approved network access passes.

## Current state

- `npx prisma validate` passes.
- `npm run lint` passes.
- `npm run build` passes when network access is allowed for Google Fonts.
- Local route checks returned HTTP 200 for all public pages, including `/blog/example-post`.
- `POST /api/contact` validation path returns 400 as expected for invalid input; live Resend sending was not exercised to avoid sending a real email.
- `npx prisma migrate dev --name add_cohort_model` still fails with a bare Prisma schema engine error through the configured Supabase pooler.
- Because the Cohort migration is not applied, `GET /api/cohorts/active` returns 500 locally until the database has the `cohorts` table.
- Visual breakpoint QA at 375px, 768px, and 1280px is still pending.
- Phase 1 external verification is still pending: initial migration status, Supabase Storage buckets, and related external setup checks.

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
