# Feature Spec 02 — Public Facing Pages

**Phase:** 2 — Public Facing Pages  
**Depends on:** Feature Spec 01 complete. Clerk, Prisma, Supabase, and Tailwind configured. `app/layout.tsx` with `ClerkProvider` and font setup in place.  
**Agent starts here:** After Feature Spec 01 verification checklist is fully passed.

---

## Goal

Build all public-facing pages of the NIDC platform. Every page in this spec is accessible without authentication. By the end of this spec, a visitor can land on the platform, understand NIDC's mission, read about the programs and sectors, navigate to apply, learn about donating, and contact the organisation. The shared navigation and footer are built once and used across all pages.

---

## Design

### Page List

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home | No |
| `/about` | About | No |
| `/programs` | Programs (Talent Pipeline) | No |
| `/sectors` | Sectors | No |
| `/apply` | Apply | No |
| `/donate` | Donate / Support | No |
| `/impact` | Impact | No |
| `/contact` | Contact | No |
| `/faqs` | FAQs | No |
| `/blog` | Blog Index | No |

### Layout Convention

All public pages share:
- A top navigation bar with the NIDC logo, nav links, and a primary CTA button
- A footer with links and contact information
- Charcoal `surface-primary` as the base background
- Poppins for all headings, Inter for all body text
- No authentication UI except the sign-in and apply CTA buttons

### Content Source

All copy in this spec is sourced directly from NIDC's brand content document. Do not alter the meaning, tone, or structure of any copy. Implement it as written.

---

## Implementation

### 1. Create Shared Layout for Public Pages

Create `app/(public)/layout.tsx`:

```tsx
import PublicNav from '@/components/public/PublicNav'
import PublicFooter from '@/components/public/PublicFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}
```

### 2. Build PublicNav Component

Create `components/public/PublicNav.tsx`:

Navigation contains:
- NIDC wordmark on the left in `text-text-accent` (lime) using `font-heading font-bold`
- Nav links: Home, About, Programs, Sectors, Apply, Donate — in `text-text-secondary` with `hover:text-text-primary`
- Primary CTA button: "Join the First Cohort" — `bg-brand-lime text-text-on-light` linking to `/apply`
- Mobile: hamburger menu toggling a full-width dropdown with all nav links
- Background: `bg-surface-secondary` with a bottom border in `border-surface-elevated`

### 3. Build PublicFooter Component

Create `components/public/PublicFooter.tsx`:

Footer contains:
- NIDC wordmark and one-line description: "Building Systems. Developing the People Who Run Them."
- Four column groups: Platform (Home, About, Programs, Sectors), Get Involved (Apply, Donate, Partner), Resources (FAQs, Blog, Contact), Legal (Governance)
- Contact email: `partnerships@nidcfoundation.org`
- Copyright line: "© NIDC Foundation. All rights reserved."
- Background: `bg-surface-secondary`, text in `text-text-secondary`

### 4. Build Home Page

`app/(public)/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'NIDC — Building Systems. Developing the People Who Run Them.',
  description: 'NIDC is building a system that develops people and builds real systems at the same time, across Energy, Manufacturing, and Digital Infrastructure.',
}
```

**Sections — implement in order:**

**Hero Section**
- Background: `bg-surface-secondary`
- Headline: "Building Systems. Developing the People Who Run Them." — `font-heading text-4xl md:text-6xl font-bold text-text-primary`
- Sub-headline: "NIDC is building a system that develops people and builds real systems at the same time, across Energy, Manufacturing, and Digital Infrastructure."
- Support line: "This goes beyond scholarships. It is a long-term system for building real capability and real-world impact. Development and execution are happening at the same time."
- Two CTA buttons: Primary "Join the First Cohort" (`bg-brand-lime text-text-on-light`) linking to `/apply`, Secondary "Learn How It Works" (ghost button with `border-brand-lime text-brand-lime`) linking to `/programs`

**The Problem Section**
- Background: `bg-surface-primary`
- Title: "Nigeria Has Talent. But No System."
- Body: "Across the country, capable individuals emerge every year yet many are unable to translate their ability into meaningful contribution. Not because they lack potential, but because there is no clear structure connecting talent to real-world systems. Talent is scattered. Opportunity is disconnected. The result is a country rich in potential, yet limited in coordinated capacity and output."

**The Solution Section**
- Background: `bg-surface-elevated`
- Title: "A System for Turning Potential Into Capability"
- Body: "NIDC is designed as a long-term system for developing people into areas that matter. We do not simply provide access or support. We build a structured pathway that connects growth to real-world contribution. This is not about participation. It is about becoming capable — and applying that capability where it creates impact."

**How It Works Section**
- Background: `bg-surface-primary`
- Title: "How the System Works"
- Four steps displayed as a numbered sequence:
  - Step 1 — Selection: "We identify a limited number of individuals who demonstrate seriousness, discipline, and willingness to grow."
  - Step 2 — Development: "Participants go through a structured process focused on building real skills, direction, and accountability."
  - Step 3 — Parallel Development: "While individuals are developing, the broader system — including hubs and projects — is built progressively. Development is aligned with real-world environments, not separated from them."
  - Step 4 — Contribution: "Participants apply their capabilities within real systems — contributing to projects, supporting others, and becoming part of a growing network."
- Closing line: "This is a system designed to connect individual growth to real-world impact."

**Ecosystem / Hubs Section**
- Background: `bg-surface-secondary`
- Title: "From Talent to Real-World Systems"
- Intro: "NIDC operates as an interconnected system — where talent is not only developed, but supported, integrated, and deployed into environments where real work happens."
- Subtitle: "Applied Development Hubs"
- Body: "We are building structured environments that bridge the gap between learning and real-world contribution. These are not future plans. They are environments being developed progressively in parallel with the growth of talent."
- Three hub cards:
  - Energy Systems — "Focused on the development and deployment of scalable energy solutions." — badge in `bg-sector-energy text-text-on-light`
  - Manufacturing & Industrial Systems — "Environments where ideas translate into physical output through applied engineering and production." — badge in `bg-sector-manufacturing text-text-on-light`
  - Digital Infrastructure — "Systems that enable coordination, data, and technology development across the ecosystem." — badge in `bg-surface-elevated text-sector-digital`
- Closing: "These hubs operate as part of a coordinated system — where talent, infrastructure, and real-world challenges intersect."

**Why It Matters Section**
- Background: `bg-surface-primary`
- Title: "Building the People Who Will Build Nigeria"
- Body: "Long-term development requires more than resources — it requires coordinated human capacity. This system exists to ensure that individuals are not just trained, but positioned where their skills can create real impact. The goal is not just personal success, but meaningful contribution at scale."

**Structure / Credibility Section**
- Background: `bg-surface-elevated`
- Title: "Built for Transparency and Long-Term Impact"
- Body: "NIDC is being established as a Company Limited by Guarantee, ensuring strong governance, accountability, and sustainability. The system is designed to operate with clarity, clear processes, accountability and long-term stability."

**Final CTA Section**
- Background: `bg-brand-charcoal`
- Title: "Be Part of What We're Building"
- Body: "If you are serious about developing yourself and contributing to something meaningful, there is a place for you in this system."
- Two CTA buttons: Primary "Join the First Cohort" linking to `/apply`, Secondary "Learn How It Works" linking to `/programs`

### 5. Build About Page

`app/(public)/about/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'About — NIDC',
  description: 'NIDC is a structured system designed to move individuals from potential to real capability.',
}
```

**Sections:**

**Hero**
- Title: "Why This Exists"
- Opening: "Nigeria is not short of capable people. What is missing is structure — a system that helps individuals grow, become capable, and contribute to real-world systems."

**The Problem**
- Title: "The Problem"
- Body: "Many individuals have potential but lack Direction, Access, and Consistent support. As a result, growth is unstructured, and capability is never fully developed."
- Display as three simple feature items, not a bulleted list

**What This Is**
- Title: "What This Is"
- Body: "NIDC is a structured system designed to move individuals from potential to real capability. Not just through learning — but through continuous development, application, and contribution."

**How It Thinks**
- Title: "How It Thinks"
- Body: "The focus is not just education. The focus is Outcome. Developing individuals who can Learn effectively, Apply what they learn, Contribute to real systems."

**What Makes It Different**
- Title: "What Makes It Different"
- Body: "This is not built for mass participation. It is designed for individuals who are willing to take responsibility for their growth and commit to a structured process."

**Long-Term Vision**
- Title: "Long-Term Vision"
- Body: "To build a system where individuals are continuously developed, connected, and positioned to contribute over time."

**Governance Sub-section**
- Title: "Governance & Transparency"
- Three columns: Directors (Responsible for oversight and direction), Core Team (Handles operations and coordination), Advisors (Provide strategic guidance)
- Use of Funds: "Allocated toward program development, participant support, and operations"
- Legal Structure: "Structured as a non-profit entity to ensure accountability and continuity"
- Closing: "Built for long-term sustainability, not short-term activity"

### 6. Build Programs Page

`app/(public)/programs/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Programs — NIDC Talent Pipeline',
  description: 'A structured pathway designed to develop individuals and position them for real-world impact.',
}
```

**Sections:**

**Hero**
- Title: "The Talent Pipeline"
- Intro: "This is not a traditional program. It is a structured pathway designed to develop individuals and position them for real-world impact — a structured pathway into a system that is actively being developed, where development and real-world contribution happen together."
- Supporting note: "Participants are not prepared in isolation. They are developed to engage with systems that are actively being built."

**Core Idea**
- Title: "Development Is Not Separate From Contribution"
- Body: "Growth within NIDC is aligned with real work. While individuals are developing locally or internationally, system-level execution continues. As capability increases, individuals are integrated into environments where their skills are applied, tested, and expanded."

**How the Pipeline Works**
- Title: "How the Pipeline Works"
- Four phase cards displayed as a timeline:
  - Phase 1 — Selection: "A limited number of individuals are identified based on: Seriousness and discipline, Long-term intent, Willingness to take responsibility for their growth. This is not mass participation. It is structured entry."
  - Phase 2 — Development: "Participants enter a guided development pathway: Structured learning direction, Skill-building aligned with real sectors, Continuous progress tracking. Development will take place locally and internationally."
  - Phase 3 — Parallel Growth: "While individuals are developing: System-level work continues, Early-stage hubs and projects evolve, Real-world environments begin taking shape. Participants are not disconnected from this process — their development is aligned with it."
  - Phase 4 — Integration & Contribution: "As individuals grow: They are integrated into active systems, They contribute to ongoing projects, They take on increasing responsibility. They are not starting something new. They are strengthening what already exists."

**What You Receive / What Is Expected**
- Two columns side by side:
  - What You Receive: Clear development direction, Structured pathway for growth, Access to aligned opportunities, Integration into a growing system
  - What Is Expected: Consistency in effort, Personal accountability, Willingness to grow over time, Commitment to contribution not just participation

**Current Stage**
- Background: `bg-surface-elevated`
- Body: "The system is currently in its early phase. Initial structures are being established while the first cohort is being identified. Growth will be gradual, intentional, and structured."

**CTA**
- Title: "Enter the System"
- Body: "If you are serious about becoming capable and applying that capability where it matters, you can apply to be part of the first cohort."
- Two buttons: "Apply to Join" linking to `/apply`, "Learn How It Works" — smooth scroll to How the Pipeline Works section

### 7. Build Sectors Page

`app/(public)/sectors/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Sectors — NIDC',
  description: 'NIDC deploys talent into Energy Systems, Manufacturing & Industrial Systems, and Digital Infrastructure.',
}
```

**Sections:**

**Hero**
- Title: "Strategic Focus Areas"
- Body: "NIDC develops and deploys talent into three critical sectors. These are not theoretical domains — they are environments being actively built, where individuals will contribute to real systems."

**Three Sector Cards — full-width sections, one per sector:**

**Energy Systems**
- Badge colour: `bg-sector-energy`
- Focus label: "Industrialization & Energy Reform"
- Body: "Focused on the development and deployment of scalable energy solutions. Participants in this sector are developed to engage with real energy infrastructure — understanding, building, and improving the systems that power communities and industries."

**Manufacturing & Industrial Systems**
- Badge colour: `bg-sector-manufacturing`
- Focus label: "Industrialization"
- Body: "Environments where ideas translate into physical output through applied engineering and production. This sector is about turning capability into things that exist in the real world — built, manufactured, deployed."

**Digital Infrastructure**
- Badge colour: `bg-surface-elevated`, text `text-sector-digital`
- Focus label: "Digitalization"
- Body: "Systems that enable coordination, data, and technology development across the ecosystem. Digital Infrastructure participants build the connective tissue that makes modern systems function — from platforms to data pipelines to operational tooling."

**Future Expansion**
- Background: `bg-surface-elevated`
- Title: "Advanced Materials (Future Expansion)"
- Body: "Exploratory environments focused on next-generation industrial capabilities. This area is not yet open for participant entry — it represents the next phase of NIDC's sector development."

**Why These Sectors**
- Title: "Why These Sectors"
- Body: "These three areas represent the structural foundation of any industrialising nation. Energy powers everything. Manufacturing turns knowledge into output. Digital infrastructure enables coordination at scale. NIDC focuses here because this is where coordinated human capacity creates the most measurable, lasting impact."

### 8. Build Apply Page

`app/(public)/apply/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Apply — Enter the NIDC System',
  description: 'Apply to join the first NIDC cohort. Application is selective. Participation is intentional.',
}
```

**Sections:**

**Hero**
- Title: "Enter the System"
- Body: "This is not an open-access program. It is a structured entry point into a system designed to develop and deploy individuals toward real-world contribution. Application is selective. Participation is intentional."

**Who This Is For / Who This Is Not For**
- Two columns:
  - This is for individuals who: Take responsibility for their growth, Are willing to commit long-term, Want to build real capability not just gain access, Are ready to contribute not just participate
  - This is not for individuals who: Are looking for quick opportunities, Want passive support without effort, Are not ready for structured development

**How Entry Works**
- Four step sequence:
  - Step 1 — Application: "You submit your details, background, and intent. This is not about perfect qualifications. It is about clarity, seriousness, and direction."
  - Step 2 — Review: "Applications are reviewed based on: Alignment with the system, Evidence of discipline and consistency, Long-term intent."
  - Step 3 — Selection: "A limited number of individuals are selected into the initial cohort. This is not mass entry."
  - Step 4 — Integration: "Selected individuals are placed within a structured development pathway, aligned with real system activity, and integrated progressively as they grow."

**Important Note**
- Background: `bg-surface-elevated`
- Body: "You are not applying to be 'prepared' for something in the future. You are applying to enter a system that is already being built, where your development will align with real work over time."

**What Happens After Entry**
- Four items: You receive structured guidance, Your development is tracked, You gain access to aligned opportunities, You are gradually integrated into real systems

**Expectations**
- Four items: Consistency over time, Accountability for your progress, Willingness to grow through structured effort, Commitment to contribution

**Current Stage**
- Background: `bg-surface-elevated`
- Body: "We are currently selecting a small initial cohort. The focus is on building the system properly — not scaling prematurely."

**Application CTA**
- Title: "If this aligns with how you think — apply."
- Primary button: "Apply Now" — links to `/sign-up` if user is not authenticated, links to `/dashboard/applicant` if authenticated
- Secondary button: "Learn More" — links to `/programs`
- Note below buttons: "Supporting documents such as academic records or certificates are not required at this stage. They will only be requested from shortlisted applicants during the review process."

**Cohort Status Banner**
- If application window is open: green banner — "Applications are now open for the first cohort."
- If application window is closed: amber banner — "Applications are currently closed. Check back soon."
- This banner reads cohort status from a public API endpoint — `GET /api/cohorts/active` — which returns whether an active open cohort exists. If the endpoint returns no active cohort, show the closed state.

### 9. Build Donate Page

`app/(public)/donate/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Support NIDC — Capacity Building for Nigeria',
  description: 'Your support enables the development of talent, infrastructure, and systems required for Nigeria\'s long-term industrial growth.',
}
```

**Sections:**

**Hero**
- Title: "Support the System"
- Body: "Your support enables the development of talent, infrastructure, and systems required for Nigeria's long-term industrial growth."
- Two buttons: "Support Now" (scrolls to How to Support section), "Partner With Us" (links to `/contact`)

**Why Support NIDC**
- Title: "This Is Not Charity. It Is Capacity Building."
- Body: "The NIDC Foundation is not designed as a short-term intervention. It is a structured system focused on developing and deploying high-impact talent into critical sectors such as energy, manufacturing, and digital infrastructure. Your support contributes directly to building the human and physical systems required for national development."

**How Your Support Is Used**
- Title: "A Structured Allocation Model"
- Body: "All contributions are allocated through a defined internal framework to ensure impact, efficiency and sustainability."
- Four allocation items displayed as progress-bar style cards:
  - Programs 40–50%: "Talent development, training, and capacity-building initiatives."
  - Infrastructure 20–30%: "Development of hubs, equipment, and project environments."
  - Operations 20–30%: "Organizational systems and administrative support."
  - Reserves 5–10%: "Stability and long-term continuity."

**What Your Support Enables**
- Title: "Where It Goes"
- Four items: Development of energy and manufacturing hubs, Training and reintegration of skilled talent, Execution of industrial and innovation projects, Expansion of national capacity infrastructure

**How to Support**
- Title: "Ways to Contribute"
- Three cards:
  - Bank Transfer: "You can support directly via bank transfer. Account details will be provided upon full incorporation." — display as coming soon state
  - Online Contribution: "Secure online payments will be available via our payment platform." — display as coming soon state with note: "Paystack integration — Phase 8"
  - Institutional Support: "For partnerships, grants, and structured funding." — display email `partnerships@nidcfoundation.org` as a mailto link

**Transparency & Accountability**
- Title: "Built for Trust"
- Body: "The NIDC Foundation operates under a structured governance framework and is registered as a Company Limited by Guarantee. All funds are used solely to advance the objectives of the Foundation. Financial activities are recorded and managed in alignment with institutional standards."

**Final CTA**
- Title: "Be Part of the System"
- Body: "This is an opportunity to contribute to something larger than individual success. It is about building the systems that enable national progress."

**Sources of Funding**
- Title: "How the System is Funded"
- Three items: Individual Support ("Contributions from individuals who believe in building Nigeria's future capacity."), Institutional Partnerships ("Grants and funding from organizations aligned with long-term development."), Operational Revenue ("Income generated through projects and activities within our hubs, including energy, manufacturing, and digital infrastructure.")

**Sustainability Model**
- Body: "Unlike traditional models, the NIDC system is designed for continuity. Projects within our hubs are structured to generate value and, where applicable, revenue that is reintegrated into the system. This enables long-term operation beyond donations alone."

### 10. Build Impact Page

`app/(public)/impact/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Impact — NIDC',
  description: 'Tracking the real-world impact of the NIDC talent development system.',
}
```

**Design note:** No cohorts have run yet at launch. The impact page launches in a pre-launch state showing the system's intent and zeroed metrics with honest framing. Do not show fake numbers.

**Sections:**

**Hero**
- Title: "Building Toward Measurable Impact"
- Body: "NIDC is in its early phase. The system is being built deliberately and incrementally. This page will track real outcomes as the first cohort progresses."

**Metrics Grid — pre-launch state**
- Four metric cards, each showing `0` or `—` with a label:
  - Candidates in Pipeline
  - Cohorts Completed
  - Sectors Active
  - Mentors Engaged
- Below each metric: a short description of what it will measure
- Framing text above the grid: "These metrics will update as the first cohort begins. We do not manufacture numbers."

**What We Will Track**
- Four items: Candidates identified and developed, Cohorts completed per sector, Mentorship sessions conducted, Individuals deployed into real systems

**Current Stage**
- Background: `bg-surface-elevated`
- Title: "Where We Are Now"
- Body: "The first cohort is being selected. Infrastructure is being established. Development is underway. Impact reporting begins when real work begins."

### 11. Build Contact Page

`app/(public)/contact/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Contact — NIDC',
  description: 'Get in touch with the NIDC Foundation.',
}
```

**Sections:**

**Hero**
- Title: "Get In Touch"
- Body: "For partnerships, institutional support, and general inquiries."

**Contact Details**
- Partnership and institutional inquiries: `partnerships@nidcfoundation.org`
- Display as a mailto link

**Contact Form**
- Fields: Full Name, Email Address, Subject (dropdown: General Inquiry, Partnership, Institutional Funding, Media, Other), Message (textarea)
- Submit button: "Send Message" in `bg-brand-lime text-text-on-light`
- On submit: `POST /api/contact` — sends the message via Resend to `partnerships@nidcfoundation.org`, returns success or error state
- Success state: "Your message has been received. We will respond within 3–5 business days."
- Error state: "Something went wrong. Please email us directly at partnerships@nidcfoundation.org"

**Build `POST /api/contact` route:**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resend } from '@/lib/resend'

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.enum(['General Inquiry', 'Partnership', 'Institutional Funding', 'Media', 'Other']),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: 'Invalid request body', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = parsed.data

    await resend.emails.send({
      from: 'NIDC Contact Form <no-reply@nidc.org>',
      to: 'partnerships@nidcfoundation.org',
      replyTo: email,
      subject: `[${subject}] from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    })

    return NextResponse.json({ data: { success: true } }, { status: 200 })
  } catch (error) {
    console.error('[POST /api/contact]', error)
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
```

### 12. Build FAQs Page

`app/(public)/faqs/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'FAQs — NIDC',
  description: 'Frequently asked questions about NIDC and how the system works.',
}
```

Implement as an accordion — each question expands to reveal the answer on click. Use React state for open/close toggling. Active question border in `border-brand-lime`.

**FAQ items:**

**For Candidates:**
- Q: What is NIDC? / A: NIDC is a structured talent development system that identifies, develops, and deploys capable Nigerians into Energy, Manufacturing & Industrial Systems, and Digital Infrastructure. It is not a scholarship or a one-off program — it is a long-term system.
- Q: Who can apply? / A: Anyone who is serious about developing themselves and contributing to real-world systems. We evaluate seriousness, discipline, and long-term intent — not perfect qualifications.
- Q: Do I need academic qualifications to apply? / A: No. Supporting documents such as academic records are not required at the application stage. They are only requested from shortlisted applicants.
- Q: How long does the program last? / A: NIDC is a long-term system. Development timelines vary depending on your starting point and the pathway you enter. This is not a short course.
- Q: What sectors can I develop into? / A: Energy Systems, Manufacturing & Industrial Systems, and Digital Infrastructure.
- Q: What happens after I apply? / A: Applications are reviewed by the screening team. Shortlisted applicants are contacted for an interview. Selected individuals are integrated into a structured development pathway.
- Q: Is this free? / A: Details on participation costs and support structures will be communicated to shortlisted candidates.

**For Donors and Partners:**
- Q: How is NIDC funded? / A: Through individual contributions, institutional grants, and operational revenue from NIDC hubs.
- Q: How are funds allocated? / A: Programs (40–50%), Infrastructure (20–30%), Operations (20–30%), Reserves (5–10%).
- Q: Is NIDC a registered organisation? / A: NIDC is being established as a Company Limited by Guarantee, ensuring strong governance, accountability, and sustainability.
- Q: How can I partner with NIDC? / A: Contact us at partnerships@nidcfoundation.org or visit the Contact page.

### 13. Build Blog Page

`app/(public)/blog/page.tsx`

**Metadata:**
```tsx
export const metadata = {
  title: 'Blog — NIDC',
  description: 'Updates, announcements, and insights from the NIDC Foundation.',
}
```

**Design:** Blog launches empty with a holding state. No blog posts exist at launch. Do not seed fake content.

**Empty state:**
- Title: "Updates & Announcements"
- Body: "Cohort announcements, alumni stories, and NIDC updates will appear here. The first post will be published when the first cohort opens."
- Single CTA: "Get Notified" — links to `/apply`

**Blog index structure for future posts** (build the structure now, content comes later):
- Each post card shows: title, date, category badge, excerpt, "Read More" link
- Categories: Announcement, Cohort Update, Alumni Story, Sector Insight
- Route for individual posts: `/blog/[slug]` — build a placeholder dynamic route that returns a simple "Post not found" state for now

Create `app/(public)/blog/[slug]/page.tsx`:
```tsx
export default function BlogPostPage() {
  return (
    <main className="min-h-screen bg-surface-primary flex items-center justify-center">
      <p className="text-text-secondary">Post not found.</p>
    </main>
  )
}
```

### 14. Build Active Cohort API Endpoint

This endpoint is used by the Apply page to determine whether to show an open or closed application state.

Create `app/api/cohorts/active/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const activeCohort = await prisma.cohort.findFirst({
      where: {
        status: 'open',
        applicationWindowOpen: { lte: new Date() },
        applicationWindowClose: { gte: new Date() },
      },
      select: { id: true, name: true, applicationWindowClose: true },
    })

    return NextResponse.json({
      data: {
        isOpen: !!activeCohort,
        cohort: activeCohort ?? null,
      },
    })
  } catch (error) {
    console.error('[GET /api/cohorts/active]', error)
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } },
      { status: 500 }
    )
  }
}
```

This requires the `Cohort` model in Prisma. Add it to `schema.prisma` and run a new migration:

```prisma
enum CohortStatus {
  draft
  open
  closed
  completed
}

model Cohort {
  id                    String       @id @default(cuid())
  name                  String
  status                CohortStatus @default(draft)
  applicationWindowOpen DateTime?
  applicationWindowClose DateTime?
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  @@map("cohorts")
}
```

Run migration:
```bash
npx prisma migrate dev --name add_cohort_model
```

---

## Dependencies

- Feature Spec 01 fully complete and verified
- Poppins and Inter fonts loading correctly via `next/font/google` in `app/layout.tsx`
- Tailwind v4 colour tokens configured in `globals.css` `@theme` block
- Resend client initialised in `lib/resend.ts`
- Prisma client available in `lib/prisma.ts`

---

## Verification Checklist

Before marking this spec complete and moving to Feature Spec 03, verify every item:

### Pages and Content
- [ ] All ten public pages render without errors at `/`, `/about`, `/programs`, `/sectors`, `/apply`, `/donate`, `/impact`, `/contact`, `/faqs`, `/blog`
- [ ] Every page has a `metadata` export with a title and description
- [ ] All copy matches the NIDC brand content document exactly — no paraphrasing or alterations
- [ ] The PublicNav renders on every public page with correct links and CTA button
- [ ] The PublicFooter renders on every public page with correct links and contact email

### Functionality
- [ ] The Apply page cohort status banner shows "open" state when an active cohort exists in the database
- [ ] The Apply page cohort status banner shows "closed" state when no active cohort exists
- [ ] The Apply page CTA links to `/sign-up` for unauthenticated users
- [ ] The Contact form submits successfully and sends an email via Resend to `partnerships@nidcfoundation.org`
- [ ] The Contact form shows a success state after successful submission
- [ ] The Contact form shows an error state if the API call fails
- [ ] The FAQs accordion opens and closes each item correctly
- [ ] The Blog page shows the empty state — no fake posts
- [ ] `/blog/[slug]` returns the "Post not found" state for any slug

### Database
- [ ] `Cohort` model migration has been applied cleanly
- [ ] `GET /api/cohorts/active` returns `{ data: { isOpen: false, cohort: null } }` when no open cohort exists

### Responsiveness
- [ ] Every page is tested and renders correctly at 375px (mobile)
- [ ] Every page is tested and renders correctly at 768px (tablet)
- [ ] Every page is tested and renders correctly at 1280px (desktop)

### Code Quality
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No raw hex colour values appear in any className string — all colours use Tailwind tokens
- [ ] No hardcoded spacing or sizing values — all use Tailwind scale
- [ ] No `any` types introduced

### Documentation
- [ ] `architecture.md` updated — `GET /api/cohorts/active` and `POST /api/contact` added to API routes section, `Cohort` model added to Storage Model table
- [ ] `progress-tracker.md` updated — Phase 2 units 2.1 through 2.12 marked as done

---

## Open Questions

None. All content and design decisions for this spec were resolved from the NIDC brand content document and planning conversation.
