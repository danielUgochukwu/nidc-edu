<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Agent Briefing — NIDC Platform

Read this file first. Every session. Before opening any other file. Before writing any code. Before asking any questions.

This file tells you what you are building, what files govern your behaviour, how to orient yourself at the start of every session, and how to operate throughout.

---

## What You Are Building

You are building the NIDC (Nigeria Innovation Community Foundation) platform — a structured talent development and pipeline management system. It identifies, develops, and deploys capable Nigerians into three sectors: Energy, Manufacturing & Industrial Systems, and Digital Infrastructure.

The platform manages candidate journeys across two pipeline tracks, screening workflows, mentorship matching, donor contributions, grant management, and multi-role operations. It is a non-trivial system with nine distinct user roles, complex access control, financial governance requirements, and a phased nine-phase build sequence.

This is not a prototype. You are building a production system that real candidates, donors, mentors, and administrators will use.

---

## Your Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js — latest stable, App Router |
| Authentication | Clerk |
| Database | PostgreSQL hosted on Supabase |
| ORM | Prisma |
| File Storage | Supabase Storage |
| Payments | Paystack — Naira only |
| Email | Resend |
| Styling | Tailwind CSS v4 — configured via `globals.css` `@theme` block only. No `tailwind.config.ts`. |
| Hosting | Vercel |
| Background Jobs | Vercel Cron Jobs |

---

## Your Context Files

These files define everything about the project. Read them. Follow them. Never contradict them.

| File | What It Contains |
|---|---|
| `project-overview.md` | What is being built, goals, core user flow, features, in-scope, out-of-scope, success criteria |
| `architecture.md` | Stack table, folder structure, storage model, auth and access model, background tasks, invariants |
| `ai-workflow-rules.md` | How to scope work, how to handle ambiguity, which files are protected, how to keep docs in sync |
| `code-standards.md` | Every coding rule — TypeScript, Next.js, Tailwind, API routes, data, auth, notifications, file organisation |
| `progress-tracker.md` | Current build phase, unit-by-unit progress, open questions, decisions log, notes for next session |
| `ui-context.md` | Design system — the single source of truth for all UI decisions. Contains raw palette, semantic colour tokens (light and dark mode), typography scale, spacing and sizing, border radius, shadows, component conventions (buttons, inputs, badges, cards, tables, modals, toasts), layout patterns (sidebar, topbar, page header, content grid), icon assignments, motion tokens, and accessibility baseline. An agent must never invent a colour, spacing value, or type style not defined here. |
| `feature-spec-[nn]-[name].md` | Phase implementation specs — provided by the project owner at the start of each phase. Do not look for these files yourself. Wait for the project owner to hand you the relevant spec before starting any phase. |

**Canonical authority order:** If there is ever a conflict between files, resolve it in this order:
1. `architecture.md` and `project-overview.md` — highest authority
2. Feature spec for the current phase
3. `code-standards.md` and `ai-workflow-rules.md`
4. `progress-tracker.md`

Never resolve a conflict silently. Flag it, state which files conflict, and ask for a decision before proceeding.

---

## How to Start Every Session

Do this at the start of every session without exception. Do not skip steps.

**Step 1 — Read `progress-tracker.md`**
Find the Current Status block at the top. Identify:
- Which phase is active
- Which unit is in progress or up next
- Any open questions that are blocking work
- The Notes for Next Session from the previous session

**Step 2 — Read the feature spec provided by the project owner**
The project owner will hand you the feature spec for the current phase. Do not look for it yourself. When it is provided, read the Goal, Design, and the specific Implementation unit you are about to work on. Do not read ahead into units you are not yet building. If no spec has been provided, tell the project owner which phase is next and wait.

**Step 3 — State your orientation**
Before writing a single line of code, tell the project owner:
- What phase and unit you are starting
- What the unit will produce
- What the unit depends on
- Any open question that must be resolved before you can begin

Only proceed when the project owner confirms.

---

## How to Operate During a Session

### One unit at a time
A unit is one API route, one form component, one migration, one email template, one cron job, or one page. Complete it fully before starting the next. Never combine units unless the feature spec explicitly groups them.

### Follow the spec exactly
The feature spec tells you what to build. Build that. Not a variation. Not an improvement. Not a superset. Exactly what the spec says. If the spec is wrong or incomplete, stop and flag it — do not work around it.

### Check invariants before every write
Before committing any implementation, verify it does not violate the eight invariants in `architecture.md`. The most critical ones:
- Roles are read from Clerk `publicMetadata` — never from the database
- Every API route that writes data performs a server-side role check before executing
- `AuditLog` is append-only — no updates or deletes ever
- Donation records are only written after Paystack webhook confirmation
- `deputy_program_director` is always a role on a user — never a hardcoded ID
- `administrator` has no write access to financial tables
- `pipelineTrack` on `Application` is locked after submission
- Files are never stored in the database — only Supabase Storage URLs

### Use named colour tokens only
Every colour in every className must use a named Tailwind token from the `@theme` block in `globals.css`. These tokens must correspond to semantic tokens defined in `ui-context.md`. Never write a raw hex value, an arbitrary Tailwind value like `bg-[#1F2937]`, or a colour that is not in the token set. If a colour is needed that does not exist, it must first be added to `ui-context.md` as a named token, then added to `globals.css` — never the other way around.

### Handle errors explicitly
Every API route must be wrapped in try/catch. Every Prisma query that writes data must be inside a try/catch. Never let an error propagate silently. Log errors server-side. Return structured error responses to the client — never raw error messages or stack traces.

### Validate at every boundary
Use `zod` to validate every API route request body before any logic runs. Never pass unvalidated input to a Prisma query or a third-party API call.

---

## How to Handle Problems

### Missing requirement
Stop immediately. Do not guess. State exactly what is missing, quote the relevant spec section, and ask one specific question that resolves the gap. Add the question to the Open Questions table in `progress-tracker.md`.

### Ambiguous requirement
Stop. State what is ambiguous. Present two or three concrete interpretations. Ask the project owner to choose one. Do not proceed until a choice is made and logged in `progress-tracker.md`.

### Conflict between spec files
Stop. Name both files. Quote both conflicting statements. Ask which takes precedence. Do not resolve it yourself.

### Mid-implementation discovery
If you discover a gap or conflict after you have already started writing code, stop at the nearest safe point. Do not finish the implementation with an assumption baked in. State what you found, where you stopped, and what decision is needed before you can continue.

### Assumption you could not avoid
If you made a judgment call because stopping mid-task was not possible, label it explicitly: state what you assumed, why, what the alternative interpretations were, and ask for confirmation before the next unit begins. Never present an assumed decision as a confirmed one.

---

## How to End Every Session

Before closing the session, complete all of the following:

**1. Verify the unit is complete**
- Every path through the feature works end to end
- `npm run build` passes with zero TypeScript errors
- `npx prisma validate` passes if schema was touched
- No TODO comments, stubs, or placeholder logic that does not work

**2. Check all invariants**
Run through the eight invariants listed above. Confirm none were violated by anything written in this session.

**3. Update `progress-tracker.md`**
- Mark completed units as done
- Log any new open questions in the Open Questions table
- Log any decisions made in the Decisions Log table
- Update the Notes for Next Session — describe exactly where you stopped, what was left incomplete, and what the next action is
- Update the Current Status block — active phase, current unit, last updated date, build status

**4. Update architecture or other context files if needed**
If this session added a new API route, database model, environment variable, role permission, or background job — update the relevant section of `architecture.md` before closing. Do not defer documentation updates to the next session.

---

## What You Must Never Do

- Never modify `prisma/migrations/*` files that have already been applied
- Never modify `middleware.ts` unless the current unit explicitly requires it
- Never modify `components/ui/*` internal logic for a specific feature
- Never modify `app/api/webhooks/clerk/route.ts` or `app/api/webhooks/paystack/route.ts` without explicit instruction
- Never install a new dependency without explicit approval
- Never write a raw hex colour value in any className string
- Never store binary file content in the database
- Never write a donation record before Paystack webhook confirmation
- Never read a user's role from the database to make an access control decision
- Never add `update` or `delete` operations on the `AuditLog` table
- Never hardcode a user ID anywhere in the codebase
- Never invent a colour, spacing value, type style, or component pattern not defined in `ui-context.md` — if it is not in the design system, add a token to `ui-context.md` first and wait for approval
- Never build features that are listed as out of scope in `project-overview.md`
- Never proceed when a requirement is missing or ambiguous — always stop and ask

---

## Out of Scope — Do Not Build

These features are explicitly deferred. Do not build them, reference them in code, or add placeholder logic for them unless explicitly instructed:

- Hub construction tracking or hub-to-candidate assignment
- Board Member role or governance dashboard
- Native in-platform messaging between mentors and candidates
- Zoom or Google Meet API integration
- Diaspora or international donation flows
- Multi-currency payment support
- Mobile native application

---

## The Project Owner

The project owner is Grace — the technical founder and sole builder of NIDC. She is building this with Next.js and is hands-on with the codebase. She has made all product and architecture decisions documented in the context files. When you need a decision, ask her directly and wait for her answer. Do not proceed on assumptions. Do not make product decisions on her behalf.

---

## One Rule Above All Others

If you are ever uncertain whether an action is permitted — by these rules, by the spec, by the invariants, or by anything else — stop and ask. The cost of asking is one message. The cost of proceeding incorrectly is broken code, a corrupted schema, a security gap, or a product decision made without the project owner's knowledge. Always choose to ask.