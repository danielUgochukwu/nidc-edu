# Memory — Phase 1 Identity/Auth/RBAC Handoff

Last updated: 2026-07-13 01:04 +01:00

## What was built

- Phase 1 identity/auth/RBAC implementation is in place for ten roles: `applicant`, `candidate`, `mentor`, `screening_team`, `program_director`, `deputy_program_director`, `finance_officer`, `administrator`, `grant_officer`, and `donor`.
- Added Clerk auth pages, `ClerkProvider`, Next 16 `proxy.ts` dashboard route protection, role dashboard shell pages, `/unauthorised`, Clerk webhook route, and administrator invite API route.
- Added Prisma schema models/enums for `User`, `Organization`, `OrganizationMember`, `Invite`, `AuditLog`, `Role`, and `InviteStatus`.
- Added helper modules: `lib/prisma.ts`, `lib/clerk.ts`, `lib/storage.ts`, `lib/resend.ts`, `lib/paystack.ts`, and `lib/escalation.ts`.
- Added `prisma.config.ts` so Prisma CLI commands load `.env.local` and prefer `DIRECT_URL` for migration commands.
- Added migration files at `prisma/migrations/20260713000029_init_identity_auth_rbac/` plus `migration_lock.toml`.

## Decisions made

- Use all ten roles; both `donor` and `grant_officer` are valid.
- Use `proxy.ts` instead of `middleware.ts` because this project is on Next.js 16.
- Enforce `AuditLog` append-only behavior with a Prisma query extension rather than `$use`.
- Keep `DATABASE_URL` for runtime/serverless pooled traffic and use `DIRECT_URL` for Prisma CLI migration traffic.

## Problems solved

- Prisma CLI did not load Next.js `.env.local`; fixed by adding `prisma.config.ts`.
- Prisma Migrate failed through Supabase transaction pooling with prepared statement errors; config now prefers `DIRECT_URL` to bypass the transaction pooler.

## Current state

- `npx prisma validate` has passed.
- `npm run lint` has passed.
- `npm run build` previously passed with required environment variables and network access for Google Fonts.
- `.env.local` contains real local service values, including `DIRECT_URL`; do not copy secrets from it.
- A migration folder exists, but live database migration status is not confirmed: `npx prisma migrate status` returned a schema engine error when checking through `DIRECT_URL`.
- `context/progress-tracker.md` records Phase 1 as locally implemented, with migration verification, Supabase Storage bucket confirmation, Vercel deployment, Vercel env setup, and Clerk webhook registration still pending.

## Next session starts with

1. Run `/remember restore`.
2. Verify whether migration `20260713000029_init_identity_auth_rbac` is applied in Supabase.
3. If Prisma status still fails through the session pooler, replace `DIRECT_URL` with a true Supabase direct non-pooler database URL and rerun `npx prisma migrate status` or `npx prisma migrate dev --name init_identity_auth_rbac`.
4. After migration verification, confirm the five Supabase Storage buckets, then proceed to Vercel env/deploy and Clerk webhook registration.

## Open questions

- Is migration `20260713000029_init_identity_auth_rbac` already applied cleanly to the live Supabase database?
- Does the current `DIRECT_URL` need to be replaced with a true direct non-pooler URL for Prisma schema engine commands?
- Are all five Supabase Storage buckets provisioned?
- Is Vercel project access/environment configuration ready?
