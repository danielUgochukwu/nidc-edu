# Feature Spec 04 — Screening Workflow

**Phase:** 4 — Screening Workflow  
**Depends on:** Feature Spec 01, 02, and 03 complete. Application system working. Prisma models for Application, Notification, and AuditLog in place.  
**Agent starts here:** After Feature Spec 03 verification checklist is fully passed.

---

## Goal

Build the complete screening workflow. By the end of this spec, the screening team can log in, view submitted applications, cast consensus votes, resolve borderline pipeline track assignments, and the system automatically escalates unresolved decisions to the Program Director after 48 hours, and to the Deputy Program Director after a further 24 hours. Rejected candidates are notified automatically via email and in-platform notification. Approved candidates are shortlisted and move to the interview stage.

---

## Design

### Consensus Voting Rules

Every submitted application requires exactly 2 reviewers from the screening team to reach consensus before a decision is made.

| Scenario | Outcome |
|---|---|
| Both reviewers approve | Application moves to `shortlisted` |
| Both reviewers reject | Application moves to `rejected` |
| Reviewers disagree after 48 hours | Escalates to Program Director |
| Program Director does not act after 24 hours | Escalates to Deputy Program Director |
| Deputy Program Director does not act | Application remains escalated — logged in open questions |

### Borderline Review Rules

Applications with `isBorderline: true` require an additional step before entering the consensus voting flow.

| Screening Team Decision | Outcome |
|---|---|
| Assign to Educational Pathway | `pipelineTrack` updated, `isBorderline` cleared, application enters normal consensus voting |
| Assign to Direct Development Track | `pipelineTrack` updated, `isBorderline` cleared, application enters normal consensus voting |
| Reject entirely | Application moves to `rejected`, candidate notified |

### Escalation Chain

```
Reviewers disagree → 48 hours → Program Director notified
Program Director does not act → 24 hours → Deputy Program Director notified
```

Escalation is triggered by a Vercel Cron Job running hourly. It checks all applications in `under_review` status where:
- Two votes exist and they conflict
- The oldest vote is more than 48 hours old
- No escalation record exists yet

### Rejection Notifications

When an application is rejected at any point — screening vote, borderline review, or escalation decision — the system:
1. Updates `Application.status` to `rejected`
2. Creates an in-platform `Notification` for the candidate
3. Sends a rejection email via Resend

---

## Implementation

### 1. Update Prisma Schema

Add the following models to `prisma/schema.prisma` and run a single migration after all models are added.

```prisma
enum VoteDecision {
  approve
  reject
}

enum EscalationStatus {
  pending
  resolved
}

enum EscalationTarget {
  program_director
  deputy_program_director
}

model ScreeningVote {
  id            String       @id @default(cuid())
  applicationId String
  reviewerId    String
  decision      VoteDecision
  notes         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  application   Application  @relation(fields: [applicationId], references: [id])

  @@unique([applicationId, reviewerId])
  @@map("screening_votes")
}

model EscalationRecord {
  id            String           @id @default(cuid())
  applicationId String           @unique
  target        EscalationTarget
  status        EscalationStatus @default(pending)
  escalatedAt   DateTime         @default(now())
  resolvedAt    DateTime?
  resolvedById  String?
  decision      VoteDecision?
  notes         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  application   Application      @relation(fields: [applicationId], references: [id])

  @@map("escalation_records")
}
```

Update the `Application` model to add the new relations:

```prisma
model Application {
  // ... existing fields ...
  screeningVotes    ScreeningVote[]
  escalationRecord  EscalationRecord?
}
```

Run the migration:

```bash
npx prisma migrate dev --name add_screening_workflow
```

### 2. Build Screening API Routes

**2.1 — `GET /api/screening/applications`**

Returns all submitted applications for the screening team to review. Includes vote counts and borderline flags.

Create `app/api/screening/applications/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    await requireRole(['screening_team', 'program_director', 'deputy_program_director', 'administrator'])

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'submitted'
    const borderlineOnly = searchParams.get('borderline') === 'true'

    const applications = await prisma.application.findMany({
      where: {
        status: status as never,
        ...(borderlineOnly && { isBorderline: true }),
      },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
        screeningVotes: true,
        escalationRecord: true,
      },
      orderBy: { submittedAt: 'asc' },
    })

    return NextResponse.json({ data: applications })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[GET /api/screening/applications]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**2.2 — `GET /api/screening/applications/[id]`**

Returns a single application with full details including all votes, assessment responses, and escalation record.

Create `app/api/screening/applications/[id]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(['screening_team', 'program_director', 'deputy_program_director', 'administrator'])

    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
        responses: {
          include: { question: true },
        },
        screeningVotes: true,
        escalationRecord: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    return NextResponse.json({ data: application })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[GET /api/screening/applications/[id]]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**2.3 — `POST /api/screening/vote`**

Casts a screening vote on an application. Checks for consensus after every vote and automatically resolves the application if both reviewers agree.

Create `app/api/screening/vote/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { sendRejectionEmail, sendShortlistEmail } from '@/lib/resend'

const voteSchema = z.object({
  applicationId: z.string(),
  decision: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const reviewer = await requireRole('screening_team')

    const body = await req.json()
    const parsed = voteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    const { applicationId, decision, notes } = parsed.data

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { screeningVotes: true },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    if (!['submitted', 'under_review'].includes(application.status)) {
      return NextResponse.json(
        { error: { message: 'Application is not available for review', code: 'INVALID_STATUS' } },
        { status: 400 }
      )
    }

    if (application.isBorderline && !application.pipelineTrack) {
      return NextResponse.json(
        { error: { message: 'Borderline application must be assigned a pipeline track before voting', code: 'BORDERLINE_UNRESOLVED' } },
        { status: 400 }
      )
    }

    // Upsert the vote
    await prisma.screeningVote.upsert({
      where: {
        applicationId_reviewerId: {
          applicationId,
          reviewerId: reviewer.userId,
        },
      },
      update: { decision, notes },
      create: {
        applicationId,
        reviewerId: reviewer.userId,
        decision,
        notes,
      },
    })

    // Update status to under_review if first vote
    if (application.status === 'submitted') {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'under_review' },
      })
    }

    // Check for consensus — fetch updated votes
    const updatedVotes = await prisma.screeningVote.findMany({
      where: { applicationId },
    })

    const allApprove = updatedVotes.length === 2 && updatedVotes.every(v => v.decision === 'approve')
    const allReject = updatedVotes.length === 2 && updatedVotes.every(v => v.decision === 'reject')

    if (allApprove) {
      await resolveApplication(applicationId, 'shortlisted', reviewer.userId)
    } else if (allReject) {
      await resolveApplication(applicationId, 'rejected', reviewer.userId)
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorId: reviewer.userId,
        action: 'screening.vote_cast',
        targetType: 'Application',
        targetId: applicationId,
        metadata: { decision, consensus: allApprove ? 'approved' : allReject ? 'rejected' : 'pending' },
      },
    })

    return NextResponse.json({
      data: {
        success: true,
        consensus: allApprove ? 'approved' : allReject ? 'rejected' : 'pending',
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/screening/vote]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}

async function resolveApplication(
  applicationId: string,
  outcome: 'shortlisted' | 'rejected',
  actorId: string
) {
  const application = await prisma.application.update({
    where: { id: applicationId },
    data: { status: outcome },
  })

  const userRecord = await prisma.user.findFirst({
    where: { clerkId: application.userId },
    select: { email: true, firstName: true },
  })

  if (!userRecord) return

  if (outcome === 'rejected') {
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'application_rejected',
        message: 'Thank you for applying to NIDC. After careful review, we are unable to move your application forward at this time.',
      },
    })
    await sendRejectionEmail({ to: userRecord.email, firstName: userRecord.firstName ?? 'Applicant' })
  }

  if (outcome === 'shortlisted') {
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'application_shortlisted',
        message: 'Congratulations — your application has been shortlisted. You will receive interview details shortly.',
      },
    })
    await sendShortlistEmail({ to: userRecord.email, firstName: userRecord.firstName ?? 'Applicant' })
  }

  await prisma.auditLog.create({
    data: {
      actorId,
      action: `application.${outcome}`,
      targetType: 'Application',
      targetId: applicationId,
      metadata: { outcome },
    },
  })
}
```

**2.4 — `POST /api/screening/borderline`**

Resolves a borderline application — assigns a pipeline track or rejects it entirely.

Create `app/api/screening/borderline/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { sendRejectionEmail } from '@/lib/resend'

const borderlineSchema = z.object({
  applicationId: z.string(),
  decision: z.enum(['educational_pathway', 'direct_development_track', 'reject']),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const reviewer = await requireRole(['screening_team', 'program_director', 'deputy_program_director'])

    const body = await req.json()
    const parsed = borderlineSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    const { applicationId, decision, notes } = parsed.data

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    if (!application.isBorderline) {
      return NextResponse.json(
        { error: { message: 'Application is not borderline', code: 'NOT_BORDERLINE' } },
        { status: 400 }
      )
    }

    if (decision === 'reject') {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'rejected' },
      })

      const userRecord = await prisma.user.findFirst({
        where: { clerkId: application.userId },
        select: { email: true, firstName: true },
      })

      if (userRecord) {
        await prisma.notification.create({
          data: {
            userId: application.userId,
            type: 'application_rejected',
            message: 'Thank you for applying to NIDC. After careful review, we are unable to move your application forward at this time.',
          },
        })
        await sendRejectionEmail({ to: userRecord.email, firstName: userRecord.firstName ?? 'Applicant' })
      }
    } else {
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          pipelineTrack: decision,
          isBorderline: false,
          status: 'submitted',
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        actorId: reviewer.userId,
        action: 'screening.borderline_resolved',
        targetType: 'Application',
        targetId: applicationId,
        metadata: { decision, notes },
      },
    })

    return NextResponse.json({ data: { success: true, decision } })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/screening/borderline]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**2.5 — `POST /api/screening/escalation/resolve`**

Allows the Program Director or Deputy Program Director to resolve an escalated application.

Create `app/api/screening/escalation/resolve/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { sendRejectionEmail, sendShortlistEmail } from '@/lib/resend'

const resolveSchema = z.object({
  applicationId: z.string(),
  decision: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const actor = await requireRole(['program_director', 'deputy_program_director'])

    const body = await req.json()
    const parsed = resolveSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      )
    }

    const { applicationId, decision, notes } = parsed.data

    const escalation = await prisma.escalationRecord.findUnique({
      where: { applicationId },
    })

    if (!escalation || escalation.status !== 'pending') {
      return NextResponse.json(
        { error: { message: 'No pending escalation found', code: 'NOT_FOUND' } },
        { status: 404 }
      )
    }

    const outcome = decision === 'approve' ? 'shortlisted' : 'rejected'

    await prisma.$transaction(async (tx) => {
      await tx.escalationRecord.update({
        where: { applicationId },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
          resolvedById: actor.userId,
          decision,
          notes,
        },
      })

      await tx.application.update({
        where: { id: applicationId },
        data: { status: outcome },
      })
    })

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (application) {
      const userRecord = await prisma.user.findFirst({
        where: { clerkId: application.userId },
        select: { email: true, firstName: true },
      })

      if (userRecord) {
        if (outcome === 'rejected') {
          await prisma.notification.create({
            data: {
              userId: application.userId,
              type: 'application_rejected',
              message: 'Thank you for applying to NIDC. After careful review, we are unable to move your application forward at this time.',
            },
          })
          await sendRejectionEmail({ to: userRecord.email, firstName: userRecord.firstName ?? 'Applicant' })
        } else {
          await prisma.notification.create({
            data: {
              userId: application.userId,
              type: 'application_shortlisted',
              message: 'Congratulations — your application has been shortlisted. You will receive interview details shortly.',
            },
          })
          await sendShortlistEmail({ to: userRecord.email, firstName: userRecord.firstName ?? 'Applicant' })
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        actorId: actor.userId,
        action: 'escalation.resolved',
        targetType: 'Application',
        targetId: applicationId,
        metadata: { decision, outcome },
      },
    })

    return NextResponse.json({ data: { success: true, outcome } })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/screening/escalation/resolve]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

### 3. Build Escalation Logic

Update `lib/escalation.ts` with the full escalation logic:

```ts
import { prisma } from '@/lib/prisma'
import { sendEscalationEmail } from '@/lib/resend'

export async function runEscalationCheck() {
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  // Find applications under review with conflicting votes older than 48 hours
  const applicationsToEscalate = await prisma.application.findMany({
    where: {
      status: 'under_review',
      escalationRecord: null,
      screeningVotes: {
        some: { createdAt: { lte: fortyEightHoursAgo } },
      },
    },
    include: { screeningVotes: true },
  })

  for (const application of applicationsToEscalate) {
    const votes = application.screeningVotes
    const hasConflict =
      votes.length === 2 &&
      votes.some(v => v.decision === 'approve') &&
      votes.some(v => v.decision === 'reject')

    if (!hasConflict) continue

    // Find Program Director
    const programDirector = await prisma.user.findFirst({
      where: { role: 'program_director' },
    })

    if (!programDirector) continue

    await prisma.escalationRecord.create({
      data: {
        applicationId: application.id,
        target: 'program_director',
        escalatedAt: new Date(),
      },
    })

    await sendEscalationEmail({
      to: programDirector.email,
      firstName: programDirector.firstName ?? 'Program Director',
      applicationId: application.id,
      target: 'program_director',
    })

    await prisma.auditLog.create({
      data: {
        actorId: 'system',
        action: 'escalation.created',
        targetType: 'Application',
        targetId: application.id,
        metadata: { target: 'program_director', reason: '48_hour_conflict' },
      },
    })
  }

  // Find pending escalations assigned to Program Director older than 24 hours
  const escalationsToReassign = await prisma.escalationRecord.findMany({
    where: {
      status: 'pending',
      target: 'program_director',
      escalatedAt: { lte: twentyFourHoursAgo },
    },
  })

  for (const escalation of escalationsToReassign) {
    const deputy = await prisma.user.findFirst({
      where: { role: 'deputy_program_director' },
    })

    if (!deputy) continue

    await prisma.escalationRecord.update({
      where: { id: escalation.id },
      data: { target: 'deputy_program_director', escalatedAt: new Date() },
    })

    await sendEscalationEmail({
      to: deputy.email,
      firstName: deputy.firstName ?? 'Deputy Program Director',
      applicationId: escalation.applicationId,
      target: 'deputy_program_director',
    })

    await prisma.auditLog.create({
      data: {
        actorId: 'system',
        action: 'escalation.reassigned',
        targetType: 'EscalationRecord',
        targetId: escalation.id,
        metadata: { target: 'deputy_program_director', reason: '24_hour_no_response' },
      },
    })
  }
}
```

### 4. Build Cron Endpoints

**4.1 — `POST /api/cron/escalation-check`**

Create `app/api/cron/escalation-check/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { runEscalationCheck } from '@/lib/escalation'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  try {
    await runEscalationCheck()
    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    console.error('[POST /api/cron/escalation-check]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**4.2 — Configure Vercel Cron Jobs**

Create `vercel.json` at the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/escalation-check",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs the escalation check every hour.

Add `CRON_SECRET` to `.env.local` and Vercel environment variables — generate a random string:

```bash
openssl rand -base64 32
```

### 5. Update Resend Email Functions

Add the following email functions to `lib/resend.ts`:

```ts
export async function sendRejectionEmail({
  to,
  firstName,
}: {
  to: string
  firstName: string
}) {
  await resend.emails.send({
    from: 'NIDC <no-reply@nidc.org>',
    to,
    subject: 'Update on your NIDC application',
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for taking the time to apply to NIDC.</p>
      <p>After careful review of your application, we are unable to move forward with your application at this time.</p>
      <p>We appreciate your interest in NIDC and encourage you to continue developing yourself.</p>
      <p>The NIDC Team</p>
    `,
  })
}

export async function sendShortlistEmail({
  to,
  firstName,
}: {
  to: string
  firstName: string
}) {
  await resend.emails.send({
    from: 'NIDC <no-reply@nidc.org>',
    to,
    subject: 'You have been shortlisted — NIDC',
    html: `
      <p>Hi ${firstName},</p>
      <p>Congratulations — your NIDC application has been reviewed and you have been shortlisted.</p>
      <p>You will receive further details about the interview process shortly. Please log in to your dashboard to stay updated.</p>
      <p>The NIDC Team</p>
    `,
  })
}

export async function sendEscalationEmail({
  to,
  firstName,
  applicationId,
  target,
}: {
  to: string
  firstName: string
  applicationId: string
  target: string
}) {
  await resend.emails.send({
    from: 'NIDC <no-reply@nidc.org>',
    to,
    subject: 'Action required — Application escalation',
    html: `
      <p>Hi ${firstName},</p>
      <p>An application requires your decision. The screening team was unable to reach consensus within the required timeframe.</p>
      <p>Application ID: ${applicationId}</p>
      <p>Please log in to your dashboard to review and resolve this application.</p>
      <p>The NIDC System</p>
    `,
  })
}
```

### 6. Build Screening Dashboard UI

**6.1 — Screening team dashboard `app/(dashboard)/screening/page.tsx`**

The screening dashboard shows three tabs:

- **To Review** — applications in `submitted` or `under_review` status that are not borderline. Shows applicant name, sector preference, pipeline track, submission date, and current vote count.
- **Borderline** — applications with `isBorderline: true` requiring pipeline track assignment or rejection.
- **Escalated** — applications with a pending `EscalationRecord`.

Each application row links to `/dashboard/screening/[id]` for the full review view.

**6.2 — Application review page `app/(dashboard)/screening/[id]/page.tsx`**

Shows the full application including:
- Personal information
- Educational background
- Work and experience
- Sector interest and motivation
- Assessment responses with scores
- Pipeline track assignment
- Current votes from both reviewers
- Vote form — approve or reject with optional notes
- If borderline — pipeline track assignment form instead of vote form
- If escalated — shows escalation status, no vote form available

**6.3 — Program Director escalation view `app/(dashboard)/program-director/page.tsx`**

Shows all pending escalations assigned to the Program Director. Each escalation links to the full application review with an approve/reject decision form that calls `POST /api/screening/escalation/resolve`.

### 7. Build Shortlist Management

**7.1 — `GET /api/screening/shortlist`**

Returns all shortlisted applications.

Create `app/api/screening/shortlist/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole(['screening_team', 'program_director', 'deputy_program_director', 'administrator'])

    const shortlisted = await prisma.application.findMany({
      where: { status: 'shortlisted' },
      include: { personalInfo: true, sectorInfo: true },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ data: shortlisted })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[GET /api/screening/shortlist]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

---

## Dependencies

- Feature Spec 01, 02, and 03 fully complete
- `Notification` model in place from Feature Spec 03
- `AuditLog` model in place from Feature Spec 01
- `lib/resend.ts` initialised from Feature Spec 01
- `CRON_SECRET` environment variable added to `.env.local` and Vercel
- At least one user with `screening_team` role exists — create via admin invite flow
- At least one user with `program_director` role exists — create via admin invite flow
- At least one submitted application exists for testing — complete an application as an applicant first

---

## Verification Checklist

Before marking this spec complete and moving to Feature Spec 05, verify every item:

### Database
- [ ] Migration `add_screening_workflow` applied cleanly
- [ ] `npx prisma validate` passes with no errors
- [ ] `ScreeningVote` and `EscalationRecord` tables exist in Supabase

### Consensus Voting
- [ ] A screening team member can cast an approve vote on a submitted application
- [ ] A screening team member can cast a reject vote on a submitted application
- [ ] Casting a second vote that agrees with the first resolves the application automatically
- [ ] Two approve votes → application status changes to `shortlisted`
- [ ] Two reject votes → application status changes to `rejected`
- [ ] A rejected candidate receives an in-platform notification and a rejection email
- [ ] A shortlisted candidate receives an in-platform notification and a shortlist email
- [ ] A screening team member cannot vote on an application not in `submitted` or `under_review` status

### Borderline Review
- [ ] A borderline application cannot be voted on until the pipeline track is resolved
- [ ] Assigning Educational Pathway clears `isBorderline` and sets the correct `pipelineTrack`
- [ ] Assigning Direct Development Track clears `isBorderline` and sets the correct `pipelineTrack`
- [ ] Rejecting a borderline application sets status to `rejected` and notifies the candidate

### Escalation
- [ ] The escalation cron endpoint returns `401` without the correct `CRON_SECRET` header
- [ ] Applications with conflicting votes older than 48 hours get an `EscalationRecord` created
- [ ] The Program Director receives an escalation email when an application is escalated
- [ ] Escalations older than 24 hours are reassigned to the Deputy Program Director
- [ ] The Deputy Program Director receives an escalation email on reassignment
- [ ] The Program Director or Deputy Program Director can resolve an escalation with approve or reject
- [ ] Resolving an escalation updates both the `EscalationRecord` and the `Application` status

### Screening Dashboard
- [ ] Screening team dashboard shows three tabs — To Review, Borderline, Escalated
- [ ] Each tab shows the correct applications
- [ ] Clicking an application opens the full review page
- [ ] The vote form is only shown for non-borderline, non-escalated applications
- [ ] The borderline form is only shown for borderline applications
- [ ] The Program Director dashboard shows all pending escalations

### Invariants
- [ ] No `AuditLog` update or delete operations in any code added in this spec
- [ ] No hardcoded user ID for Program Director or Deputy Program Director — always queried by role
- [ ] All API routes return `401` for unauthenticated requests
- [ ] All API routes return `403` for wrong role

### Code Quality
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] All API route request bodies validated with Zod
- [ ] No raw hex colour values in any className
- [ ] `vercel.json` created with cron job configuration

### Documentation
- [ ] `architecture.md` updated — all new API routes, models, and background tasks added
- [ ] `progress-tracker.md` updated — Phase 4 units marked as done

---

## Open Questions

None. All decisions required for this spec were resolved before writing.