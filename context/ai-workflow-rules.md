# AI Workflow Rules

## Approach

Build this project incrementally using a spec-driven workflow. The context files — `project-overview.md`, `architecture.md`, and `code-standards.md` — define what to build, how to build it, and the rules that govern every implementation decision. Always implement against these specs. Do not infer behaviour from patterns you recognise. Do not invent features that seem logical but are not explicitly defined. If it is not in the specs, it does not get built.

Every session begins by reading `progress-tracker.md` to understand what has been completed, what is in progress, and what comes next. Every session ends by updating `progress-tracker.md` to reflect exactly what changed.

## Scoping Rules

- Work on one feature unit at a time. A unit is one API route, one form, one migration, one email, one cron job, or one dashboard page — not a combination.
- Prefer small, verifiable increments over large speculative changes. If a change cannot be tested end to end within the current session, it is too large — split it.
- Do not combine unrelated system boundaries in a single implementation step. Screening logic and donation logic do not belong in the same step. Public pages and API routes do not belong in the same step.
- Do not add database fields, routes, components, or configuration that are not required by the current unit. Speculative additions contaminate the schema and create untested surface area.
- Do not install a new dependency without explicit instruction. If a package is genuinely needed, state what it is and why, then wait for approval before adding it.
- One Prisma migration per logical schema change. Name every migration explicitly — `add_screening_vote_table`, not `update1`.

## When to Split Work

Split an implementation step if it combines:

- UI changes and API route changes — build and verify the route first, then build the UI against it
- Multiple unrelated API routes — one route per step
- A database migration and application logic — apply and verify the migration before writing code that depends on it
- Third-party integration and internal logic — isolate the integration (Clerk, Paystack, Resend, Supabase Storage) into its own step before wiring it to application behaviour
- A background job and the feature it supports — build the feature logic first, then the cron endpoint that invokes it
- Any behaviour not clearly and completely defined in the context files — resolve the ambiguity first, then implement

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behaviour not defined in the context files. If it is not specified, it does not exist yet.
- If a requirement is ambiguous, resolve it by updating the relevant context file before writing any code. An ambiguous spec produces wrong code — fix the spec first.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing. Do not work around it or make a silent assumption.
- If you made a judgment call mid-implementation because stopping was not possible, label it explicitly in your response: state what you assumed, why, and ask for confirmation before the next step begins.
- Never present an assumed decision as a confirmed one.

## Protected Files

Do not modify the following unless explicitly instructed:

- `prisma/migrations/*` — migration files are immutable after they have been applied. Create a new migration instead of editing an existing one.
- `proxy.ts` — controls all route protection and role-based routing for the entire platform. Changes here affect every protected page.
- `lib/prisma.ts` — the Prisma client singleton. Do not modify client configuration without a documented reason.
- `lib/clerk.ts` — role-check helpers. Do not add shortcuts or convenience wrappers that bypass the role verification logic in `architecture.md`.
- `components/ui/*` — base UI primitives. Compose from them. Do not modify their props interface, internal logic, or styling for a specific feature.
- `app/api/webhooks/clerk/route.ts` — Clerk webhook handler. Security-critical. Do not add logic or alter signature verification without explicit instruction.
- `app/api/webhooks/paystack/route.ts` — Paystack webhook handler. Security-critical. Do not add logic or alter signature verification without explicit instruction.
- `.env.example` — do not remove existing entries. Only add a new entry when the current task introduces a new environment variable.

## Keeping Docs in Sync

Update the relevant context file whenever implementation changes any of the following:

- **System architecture or boundaries** — new folders, new API routes, or changes to the folder responsibility model defined in `architecture.md`
- **Storage model decisions** — new database tables or fields, new Supabase Storage buckets, or changes to what lives where
- **Auth and access model** — new roles, changed permissions, or new role assignment logic
- **Background tasks** — new or modified cron jobs, schedules, or endpoint paths
- **Code conventions or standards** — any deviation from `code-standards.md` that becomes an accepted pattern
- **Feature scope** — anything added to or removed from the in-scope or out-of-scope lists in `project-overview.md`

Do not rewrite documentation. Make surgical updates to the specific entries affected by the current task. If an update would touch more than three lines across the context files, stop and flag it — scope drift is the likely cause.

## Before Moving to the Next Unit

1. The current unit works end to end within its defined scope — every path through the feature has been exercised manually or by test.
2. No invariant defined in `architecture.md` was violated — role checks, AuditLog append-only rule, no hardcoded user IDs, no files stored in the database, no donation records written before Paystack webhook confirmation.
3. `progress-tracker.md` reflects the completed work — the finished unit is marked done, any open questions raised during the work are logged, and the next unit is clearly identified.
4. `npm run build` passes with zero TypeScript errors and zero Prisma validation errors.