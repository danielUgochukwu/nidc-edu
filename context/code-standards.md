# NIDC Platform — Code Standards

These standards apply to every file in this codebase. The AI agent building this project must follow them without exception. They are not style preferences — they are the rules this codebase is built on.

---

## General

- Keep every module small and single-purpose. A file that does more than one thing must be split.
- Fix root causes. Do not layer workarounds over broken logic. If something does not work correctly, find why and fix it there.
- Do not mix unrelated concerns in one component or route. A component that fetches data, formats it, and handles user interaction is three things — separate them.
- Write code that can be read and understood without comments. If a comment is needed to explain what the code does, rewrite the code. Comments are only acceptable to explain why a non-obvious decision was made.
- Delete dead code immediately. Do not comment it out. Do not leave it "just in case." Version control handles history.
- Do not repeat logic. If the same logic appears in more than one place, extract it into a shared function in `lib/` and import it.
- Every function must do one thing. If a function name includes "and," it does too much.
- Handle errors explicitly at every layer. Never silently swallow an error or log it and continue as if nothing happened.

---

## TypeScript

- Strict mode is required. `tsconfig.json` must have `"strict": true`. Never disable it or add exceptions.
- Never use `any`. Use explicit interfaces, type aliases, or narrowly scoped generics. If the shape of data is unknown at compile time, type it as `unknown` and narrow it explicitly before use.
- Define an explicit interface or type for every object that crosses a function or module boundary — API request bodies, API response shapes, database query results, component props.
- Validate all external input at system boundaries before trusting it. Data arriving from HTTP requests, Clerk webhooks, Paystack webhooks, and Supabase Storage responses must be parsed and validated before being used. Use `zod` for runtime validation at every API route entry point.
- Never use type assertions (`as SomeType`) to silence a TypeScript error. If a type assertion is required, it is a signal that the types are wrong — fix the types.
- Export types and interfaces from the file where they are defined. Do not redeclare the same type in multiple files.
- Use `enum` only for values that are stable and will not change. For role names, pipeline stages, application statuses, and notification types — define them as `const` objects and derive the type with `typeof` and `keyof`.
- Never use non-null assertion (`!`) on values that could genuinely be null or undefined at runtime. Narrow the type explicitly first.

---

## Next.js

- Default to server components. Add `"use client"` only when the component requires browser-only APIs, event handlers, or React state.
- Never fetch data inside a client component by calling an internal API route. Fetch data server-side in a server component or a server action and pass it down as props.
- Keep route handlers in `app/api/` focused on a single responsibility. One route handler handles one operation — do not build a multi-action handler that switches behaviour based on a query parameter or request body field.
- Use server actions for form mutations where no complex pre-processing is required. Use API routes for operations triggered by webhooks, cron jobs, or third-party callbacks.
- Never expose internal server logic, Prisma queries, or environment variables in client components.
- Use Next.js `loading.tsx` and `error.tsx` files for every dashboard route group. Do not leave loading and error states unhandled.
- Use the `metadata` export in every public page for SEO. Title and description are required on every page in `(public)/`.
- Dynamic routes must handle the case where the requested resource does not exist. Return a `notFound()` response — never render a broken page.
- Environment variables accessed on the server must be prefixed appropriately. Variables prefixed with `NEXT_PUBLIC_` are exposed to the client — never put secrets there.

---

## Styling

- Use Tailwind utility classes exclusively. Do not write custom CSS files unless Tailwind cannot produce the required output, and document why when you do.
- Never hardcode colour values. Use only the semantic colour tokens defined in `ui-context.md` and implemented in the `@theme` block in `globals.css`. If a colour is needed that does not exist, add it to `ui-context.md` first as a named semantic token, then add it to the `@theme` block — do not write `text-[#4A90E2]` inline and do not add tokens to `globals.css` that are not defined in `ui-context.md`.
- Never hardcode spacing, font size, border radius, or shadow values inline. Use Tailwind's scale — `p-4`, `text-sm`, `rounded-md`, `shadow-sm`. If the design requires a custom value, add it to the `@theme` block in `globals.css` — do not use arbitrary inline values.
- Do not use arbitrary Tailwind values (`w-[347px]`, `mt-[13px]`) unless there is a specific, documented reason. Pixel-perfect arbitrary values are a maintenance problem.
- Keep component class strings readable. If a component's className exceeds 5 utility classes, extract the combination into a `cva` variant or a named Tailwind component using `@apply` in a dedicated CSS module.
- Responsive design is required on all public pages and all dashboard pages. Every layout must be tested at mobile (375px), tablet (768px), and desktop (1280px) breakpoints.
- Dark mode is not in scope for the initial build. Do not add `dark:` variants.

---

## API Routes

- Parse and validate the request body using `zod` before any other logic runs. If validation fails, return a `400` response immediately with a clear error message. Never pass unvalidated input to a Prisma query.
- Perform the role check before any database read or write. The order is: parse input → check auth and role → execute logic. Never reverse this order.
- Return consistent response shapes across all routes. Success responses return `{ data: ... }`. Error responses return `{ error: { message: string, code: string } }`. Never return raw Prisma objects or stack traces to the client.
- Return the correct HTTP status code for every response. `200` for success, `201` for created, `400` for validation failure, `401` for unauthenticated, `403` for unauthorised, `404` for not found, `500` for unexpected server errors. Never return `200` for an error.
- Never expose Prisma errors, database constraint messages, or internal stack traces in API responses. Log the full error server-side and return a generic message to the client.
- Webhook endpoints must verify the request signature before processing anything. The Clerk webhook handler must verify using the `svix` library. The Paystack webhook handler must verify using the `x-paystack-signature` header against the Paystack secret key. Reject unverified requests with `401` immediately.
- Cron job endpoints must verify the `CRON_SECRET` header before executing. Reject requests without the correct secret with `401` immediately.
- Every API route must handle the case where a required database record does not exist. Return `404` — never let a `null` Prisma result reach downstream logic unguarded.

---

## Data and Storage

- All relational data — users, applications, votes, sessions, milestones, donations, grants, notifications, audit logs — belongs in PostgreSQL via Prisma.
- All binary files — documents, images, receipts, attachments — belong in Supabase Storage. The database stores only the Supabase Storage URL. Never store file content, base64 data, or raw bytes in any database column.
- Never query the database in a loop. If multiple records are needed, use a single Prisma query with `where: { id: { in: [...] } }` or a relation include. N+1 queries are not acceptable.
- Never select all fields with `findMany` or `findFirst` when only specific fields are needed. Use `select` to retrieve only what the operation requires.
- Every Prisma query that writes data must be wrapped in a `try/catch`. Database errors must be logged server-side and must not propagate unhandled to the API response.
- Use Prisma transactions (`prisma.$transaction`) when two or more writes must succeed or fail together. Never write two dependent records in separate queries without a transaction.
- The `AuditLog` table is append-only. Never call `prisma.auditLog.update()` or `prisma.auditLog.delete()` anywhere in the codebase. Enforce this via the Prisma middleware hook defined in `lib/prisma.ts`.
- Do not cache database query results in the initial build. Retrieve fresh data on each request. Caching is a future-phase concern.
- Supabase Storage uploads must complete before any database write. Never write a URL to the database speculatively before the upload has succeeded. For private files, always generate a signed URL at request time — never store signed URLs in the database, as they expire.

---

## Authentication and Authorisation

- Read the user's role exclusively from Clerk `publicMetadata`. Never read role from the database to make an access control decision.
- Call `auth()` from `@clerk/nextjs/server` at the top of every API route handler that reads or writes protected data. Extract `userId` and `sessionClaims` and check the role before proceeding.
- Never trust the request body or query parameters to identify the acting user. Always derive the user identity from the verified Clerk session.
- Role checks must be explicit. Do not use a catch-all `isAdmin` check when a more specific role is required. Check for the exact role the operation demands.
- Do not write helper functions that return a boolean and silently allow access if the check fails. Throw or return a `403` response when a role check fails — never allow the function to continue.
- The `middleware.ts` file protects pages. It does not protect API routes. Every API route must perform its own role check independently.

---

## Notifications and Email

- Every transactional email is sent via Resend using a function defined in `lib/resend.ts`. Do not call the Resend API directly from an API route or component.
- Every in-platform notification is created via `prisma.notification.create()` inside the relevant API route or server action. Notifications are never created from client components.
- Email and in-platform notification must be sent together for every event that requires both. They are not interchangeable — sending one without the other is incomplete.
- Email templates are defined as React components in `lib/resend.ts` or a dedicated `emails/` directory. Do not build email content with string concatenation.
- Never send an email before the database write it depends on has succeeded. Write first, then send. If the email fails, log the failure — do not roll back the database write.

---

## File Organisation

- `app/(public)/` — Public-facing pages that require no authentication. Every page here must have a `metadata` export.
- `app/(auth)/` — Clerk sign-in and sign-up pages only. No business logic lives here.
- `app/(dashboard)/` — Protected pages, one subfolder per role. Each subfolder contains only the pages relevant to that role.
- `app/api/` — All API route handlers, organised by domain. One folder per domain, one `route.ts` file per endpoint. No shared logic lives here — shared logic belongs in `lib/`.
- `components/ui/` — Base, stateless, reusable UI primitives. No data fetching. No business logic. No role-specific behaviour. Composed from, never modified for specific features.
- `components/forms/` — Multi-step form components, field groups, and form wrappers specific to NIDC's application, assessment, and session logging flows.
- `components/dashboard/` — Layout components and role-specific dashboard shells. One subfolder per role where needed.
- `components/public/` — Page sections, navigation, footer, and hero components used exclusively on public-facing pages.
- `lib/` — All shared server-side logic. Third-party client singletons (`prisma.ts`, `clerk.ts`, `resend.ts`, `storage.ts`, `paystack.ts`) and domain logic (`escalation.ts`) live here. Nothing in `lib/` may import from `app/` or `components/`.
- `prisma/` — Schema and migrations only. No seed scripts, no utility functions, no test fixtures live here in production.
- `types/` — Shared TypeScript interfaces and type aliases used across more than one module. Do not define shared types inside component or route files.
- `.env.example` — Every environment variable used anywhere in the codebase must appear here with a comment. No variable may be used in code without a corresponding entry here.