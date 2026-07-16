# Feature Spec 03 — Application System

**Phase:** 3 — Application System  
**Depends on:** Feature Spec 01 and 02 complete. Clerk, Prisma, Supabase, and all lib files in place. Ten-role system working. Public pages live.  
**Agent starts here:** After Feature Spec 02 verification checklist is fully passed.

---

## Goal

Build the complete application system. By the end of this spec, a candidate can land on the platform, create an account, complete a saveable and resumable multi-step application form including a 10-question diagnostic assessment, submit their application, and receive confirmation. The system automatically assigns the candidate to a pipeline track based on their assessment score. Borderline scores are flagged for manual review by the screening team. Administrators can open and close application windows via cohort management.

---

## Design

### Application Form Structure

The form is divided into six sections delivered as a multi-step flow. Progress is saved to the database after every section is completed so the candidate can leave and return at any point before submission.

| Step | Section | Fields |
|---|---|---|
| 1 | Personal Information | Date of birth, gender, state of origin, state of residence, phone number |
| 2 | Educational Background | Highest level of education, field of study, institution name, year completed |
| 3 | Work and Experience | Employment status, current or most recent role, years of relevant experience, brief description of relevant experience |
| 4 | Sector Interest | Sector preference, why this sector |
| 5 | Motivation and Intent | Why applying to NIDC, what long-term commitment means, how they heard about NIDC |
| 6 | Diagnostic Assessment | 10 universal multiple choice questions, 4 options each |

Name and email are pre-filled from Clerk and stored on the User record — they are not re-collected in the form.

### Pipeline Assignment Logic

After the candidate submits the diagnostic assessment in Step 6, the system scores their responses:

- Each question has one correct answer worth 1 point
- Score 0–4 → **Educational Pathway**
- Score 5 → **Borderline** — flagged for screening team manual review, pipeline track pending
- Score 6–10 → **Direct Development Track**

Pipeline track is written to the `Application` record and locked immediately on submission. It cannot be changed after the application is submitted.

### Pipeline Stage Definitions

Once accepted, candidates progress through stages. These are stored on the `Application` record and updated by the screening team or program director as the candidate advances.

**Educational Pathway:**
1. Enrolled
2. Foundation Learning
3. University Integration
4. Mentorship
5. Deployment

**Direct Development Track:**
1. Enrolled
2. Skill Development
3. Applied Practice
4. Mentorship
5. Deployment

### Cohort Management

Applications are only open during an active cohort window. A cohort has an open and close date. The administrator opens and closes cohort windows. When no cohort is open, the application form is not accessible — the apply page shows a closed state.

### Form Save Behaviour

- The form auto-saves after each completed section when the candidate clicks Next
- A candidate can close the browser and return — the form resumes from their last saved section
- Incomplete applications are never submitted — only a candidate clicking the final Submit button submits the application
- After submission, the form becomes read-only — the candidate can view their application but cannot edit it

---

## Implementation

### 1. Update Prisma Schema

Add the following models to `prisma/schema.prisma`. Run a single migration after all models are added.

```prisma
enum PipelineTrack {
  educational_pathway
  direct_development_track
  borderline
}

enum ApplicationStatus {
  draft
  submitted
  under_review
  shortlisted
  rejected
  accepted
}

enum EducationLevel {
  no_formal_education
  primary
  secondary
  vocational_trade
  undergraduate
  postgraduate
}

enum EmploymentStatus {
  unemployed
  self_employed
  employed
  student
}

enum ExperienceYears {
  none
  less_than_1
  one_to_3
  three_to_5
  five_plus
}

enum SectorPreference {
  energy_systems
  manufacturing_industrial_systems
  digital_infrastructure
}

enum HowHeard {
  social_media
  word_of_mouth
  online_search
  event
  referred
  other
}

enum PipelineStage {
  enrolled
  foundation_learning
  university_integration
  skill_development
  applied_practice
  mentorship
  deployment
}

model Application {
  id             String            @id @default(cuid())
  userId         String            @unique
  cohortId       String
  status         ApplicationStatus @default(draft)
  currentStep    Int               @default(1)
  pipelineTrack  PipelineTrack?
  pipelineStage  PipelineStage?
  assessmentScore Int?
  isBorderline   Boolean           @default(false)
  submittedAt    DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  cohort         Cohort            @relation(fields: [cohortId], references: [id])
  personalInfo   ApplicationPersonalInfo?
  educationInfo  ApplicationEducationInfo?
  experienceInfo ApplicationExperienceInfo?
  sectorInfo     ApplicationSectorInfo?
  motivationInfo ApplicationMotivationInfo?
  responses      AssessmentResponse[]

  @@map("applications")
}

model ApplicationPersonalInfo {
  id            String      @id @default(cuid())
  applicationId String      @unique
  dateOfBirth   DateTime
  gender        String
  stateOfOrigin String
  stateOfResidence String
  phoneNumber   String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  application   Application @relation(fields: [applicationId], references: [id])

  @@map("application_personal_info")
}

model ApplicationEducationInfo {
  id              String         @id @default(cuid())
  applicationId   String         @unique
  educationLevel  EducationLevel
  fieldOfStudy    String?
  institutionName String?
  yearCompleted   Int?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  application     Application    @relation(fields: [applicationId], references: [id])

  @@map("application_education_info")
}

model ApplicationExperienceInfo {
  id               String          @id @default(cuid())
  applicationId    String          @unique
  employmentStatus EmploymentStatus
  currentRole      String?
  experienceYears  ExperienceYears
  experienceDescription String?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  application      Application     @relation(fields: [applicationId], references: [id])

  @@map("application_experience_info")
}

model ApplicationSectorInfo {
  id              String          @id @default(cuid())
  applicationId   String          @unique
  sectorPreference SectorPreference
  sectorReason    String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  application     Application     @relation(fields: [applicationId], references: [id])

  @@map("application_sector_info")
}

model ApplicationMotivationInfo {
  id                  String      @id @default(cuid())
  applicationId       String      @unique
  whyApplying         String
  longTermCommitment  String
  howHeard            HowHeard
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  application         Application @relation(fields: [applicationId], references: [id])

  @@map("application_motivation_info")
}

model AssessmentQuestion {
  id            String               @id @default(cuid())
  question      String
  optionA       String
  optionB       String
  optionC       String
  optionD       String
  correctOption String
  order         Int
  isActive      Boolean              @default(true)
  createdAt     DateTime             @default(now())
  updatedAt     DateTime             @updatedAt

  responses     AssessmentResponse[]

  @@map("assessment_questions")
}

model AssessmentResponse {
  id            String             @id @default(cuid())
  applicationId String
  questionId    String
  selectedOption String
  isCorrect     Boolean
  createdAt     DateTime           @default(now())

  application   Application        @relation(fields: [applicationId], references: [id])
  question      AssessmentQuestion @relation(fields: [questionId], references: [id])

  @@unique([applicationId, questionId])
  @@map("assessment_responses")
}
```

Also update the `Cohort` model to add the relation back to applications:

```prisma
model Cohort {
  id                     String       @id @default(cuid())
  name                   String
  status                 CohortStatus @default(draft)
  applicationWindowOpen  DateTime?
  applicationWindowClose DateTime?
  createdAt              DateTime     @default(now())
  updatedAt              DateTime     @updatedAt

  applications           Application[]

  @@map("cohorts")
}
```

Run the migration:

```bash
npx prisma migrate dev --name add_application_system
```

### 2. Seed Assessment Questions

Create `prisma/seed.ts` to seed the initial 10 diagnostic assessment questions. The administrator owns these questions — the screening team will manage them via UI in Phase 9. For now they are seeded directly.

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const questions = [
    {
      order: 1,
      question: 'You are given a task you have never done before with no instructions. What do you do first?',
      optionA: 'Wait for someone to guide you',
      optionB: 'Break it into smaller parts and try to understand each one',
      optionC: 'Skip it and move to something you know',
      optionD: 'Ask someone else to do it',
      correctOption: 'B',
    },
    {
      order: 2,
      question: 'How do you respond when you make a mistake on something important?',
      optionA: 'Ignore it and hope no one notices',
      optionB: 'Blame the circumstances',
      optionC: 'Acknowledge it, understand what went wrong, and correct it',
      optionD: 'Give up on the task',
      correctOption: 'C',
    },
    {
      order: 3,
      question: 'You are part of a team and someone disagrees with your approach. What do you do?',
      optionA: 'Insist your approach is correct',
      optionB: 'Listen to their reasoning and evaluate it objectively',
      optionC: 'Give in immediately to avoid conflict',
      optionD: 'Ignore their input',
      correctOption: 'B',
    },
    {
      order: 4,
      question: 'A project you are working on is taking longer than expected. What is your response?',
      optionA: 'Abandon it for something easier',
      optionB: 'Complain about the timeline',
      optionC: 'Reassess your approach and keep going',
      optionD: 'Wait for someone to tell you what to do',
      correctOption: 'C',
    },
    {
      order: 5,
      question: 'Which of the following best describes how you prefer to learn something new?',
      optionA: 'By watching others and copying exactly',
      optionB: 'By understanding the principle and applying it yourself',
      optionC: 'By memorising steps without understanding why',
      optionD: 'By avoiding new things until you feel ready',
      correctOption: 'B',
    },
    {
      order: 6,
      question: 'You receive feedback that your work needs significant improvement. How do you feel?',
      optionA: 'Defensive — you believe your work was fine',
      optionB: 'Discouraged — you consider quitting',
      optionC: 'Grateful — feedback helps you improve',
      optionD: 'Indifferent — you do not take it seriously',
      correctOption: 'C',
    },
    {
      order: 7,
      question: 'What does long-term commitment mean to you?',
      optionA: 'Staying involved as long as it is convenient',
      optionB: 'Completing something only when rewards are guaranteed',
      optionC: 'Staying consistent through difficulty because the goal matters',
      optionD: 'Committing until something better comes along',
      correctOption: 'C',
    },
    {
      order: 8,
      question: 'You are asked to contribute to something where your role is small and unglamorous. What do you do?',
      optionA: 'Decline — you want a more visible role',
      optionB: 'Do it poorly since it does not matter much',
      optionC: 'Do it well because contribution is contribution',
      optionD: 'Agree but do nothing',
      correctOption: 'C',
    },
    {
      order: 9,
      question: 'How do you handle a situation where you do not have enough information to proceed?',
      optionA: 'Guess and hope for the best',
      optionB: 'Stop completely until someone provides all the information',
      optionC: 'Identify what you know, what you need, and find a way to get it',
      optionD: 'Proceed as if the missing information does not matter',
      correctOption: 'C',
    },
    {
      order: 10,
      question: 'What is your primary reason for wanting to develop yourself in a structured system like NIDC?',
      optionA: 'To get a certificate to add to my CV',
      optionB: 'To build real capability and contribute to something meaningful',
      optionC: 'Because I have nothing else to do right now',
      optionD: 'To network with people who can give me a job quickly',
      correctOption: 'B',
    },
  ]

  for (const q of questions) {
    await prisma.assessmentQuestion.upsert({
      where: { order: q.order } as never,
      update: q,
      create: q,
    })
  }

  console.log('Assessment questions seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Add the seed script to `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

Install `ts-node` if not already installed:

```bash
npm install -D ts-node
```

Run the seed:

```bash
npx prisma db seed
```

### 3. Build Application API Routes

**3.1 — `GET /api/applications/me`**

Returns the current user's application for the active cohort. Used to resume a draft application.

Create `app/api/applications/me/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireRole(['applicant', 'candidate'])

    const application = await prisma.application.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
        responses: { include: { question: true } },
      },
    })

    return NextResponse.json({ data: application })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[GET /api/applications/me]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**3.2 — `POST /api/applications`**

Creates a new draft application for the active cohort. Called when a user starts the form for the first time.

Create `app/api/applications/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const user = await requireRole('applicant')

    const activeCohort = await prisma.cohort.findFirst({
      where: {
        status: 'open',
        applicationWindowOpen: { lte: new Date() },
        applicationWindowClose: { gte: new Date() },
      },
    })

    if (!activeCohort) {
      return NextResponse.json(
        { error: { message: 'No active cohort', code: 'NO_ACTIVE_COHORT' } },
        { status: 400 }
      )
    }

    const existing = await prisma.application.findFirst({
      where: { userId: user.userId, cohortId: activeCohort.id },
    })

    if (existing) {
      return NextResponse.json({ data: existing }, { status: 200 })
    }

    const application = await prisma.application.create({
      data: {
        userId: user.userId,
        cohortId: activeCohort.id,
        currentStep: 1,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        action: 'application.created',
        targetType: 'Application',
        targetId: application.id,
        metadata: { cohortId: activeCohort.id },
      },
    })

    return NextResponse.json({ data: application }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/applications]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**3.3 — `PATCH /api/applications/[id]/step/[step]`**

Saves a single form step. Called when the candidate clicks Next on each section.

Create `app/api/applications/[id]/step/[step]/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

const stepSchemas: Record<number, z.ZodTypeAny> = {
  1: z.object({
    dateOfBirth: z.string().min(1),
    gender: z.string().min(1),
    stateOfOrigin: z.string().min(1),
    stateOfResidence: z.string().min(1),
    phoneNumber: z.string().min(1),
  }),
  2: z.object({
    educationLevel: z.enum(['no_formal_education', 'primary', 'secondary', 'vocational_trade', 'undergraduate', 'postgraduate']),
    fieldOfStudy: z.string().optional(),
    institutionName: z.string().optional(),
    yearCompleted: z.number().optional(),
  }),
  3: z.object({
    employmentStatus: z.enum(['unemployed', 'self_employed', 'employed', 'student']),
    currentRole: z.string().optional(),
    experienceYears: z.enum(['none', 'less_than_1', 'one_to_3', 'three_to_5', 'five_plus']),
    experienceDescription: z.string().max(1000).optional(),
  }),
  4: z.object({
    sectorPreference: z.enum(['energy_systems', 'manufacturing_industrial_systems', 'digital_infrastructure']),
    sectorReason: z.string().min(1).max(750),
  }),
  5: z.object({
    whyApplying: z.string().min(1).max(1250),
    longTermCommitment: z.string().min(1).max(750),
    howHeard: z.enum(['social_media', 'word_of_mouth', 'online_search', 'event', 'referred', 'other']),
  }),
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; step: string } }
) {
  try {
    const user = await requireRole('applicant')
    const stepNumber = parseInt(params.step)
    const applicationId = params.id

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    if (application.userId !== user.userId) {
      return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }

    if (application.status === 'submitted') {
      return NextResponse.json({ error: { message: 'Application already submitted', code: 'ALREADY_SUBMITTED' } }, { status: 400 })
    }

    const schema = stepSchemas[stepNumber]
    if (!schema) {
      return NextResponse.json({ error: { message: 'Invalid step', code: 'INVALID_STEP' } }, { status: 400 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() } }, { status: 400 })
    }

    const data = parsed.data

    await prisma.$transaction(async (tx) => {
      if (stepNumber === 1) {
        await tx.applicationPersonalInfo.upsert({
          where: { applicationId },
          update: { ...data, dateOfBirth: new Date(data.dateOfBirth as string) },
          create: { applicationId, ...data, dateOfBirth: new Date(data.dateOfBirth as string) },
        })
      } else if (stepNumber === 2) {
        await tx.applicationEducationInfo.upsert({
          where: { applicationId },
          update: data,
          create: { applicationId, ...data },
        })
      } else if (stepNumber === 3) {
        await tx.applicationExperienceInfo.upsert({
          where: { applicationId },
          update: data,
          create: { applicationId, ...data },
        })
      } else if (stepNumber === 4) {
        await tx.applicationSectorInfo.upsert({
          where: { applicationId },
          update: data,
          create: { applicationId, ...data },
        })
      } else if (stepNumber === 5) {
        await tx.applicationMotivationInfo.upsert({
          where: { applicationId },
          update: data,
          create: { applicationId, ...data },
        })
      }

      await tx.application.update({
        where: { id: applicationId },
        data: { currentStep: Math.max(application.currentStep, stepNumber + 1) },
      })
    })

    return NextResponse.json({ data: { success: true, nextStep: stepNumber + 1 } })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[PATCH /api/applications/[id]/step/[step]]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**3.4 — `POST /api/applications/[id]/assessment`**

Saves assessment responses, scores them, assigns pipeline track, and marks the application ready for submission.

Create `app/api/applications/[id]/assessment/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

const assessmentSchema = z.object({
  responses: z.array(z.object({
    questionId: z.string(),
    selectedOption: z.enum(['A', 'B', 'C', 'D']),
  })).length(10),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole('applicant')
    const applicationId = params.id

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    if (application.userId !== user.userId) {
      return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }

    if (application.status === 'submitted') {
      return NextResponse.json({ error: { message: 'Application already submitted', code: 'ALREADY_SUBMITTED' } }, { status: 400 })
    }

    const body = await req.json()
    const parsed = assessmentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } }, { status: 400 })
    }

    const { responses } = parsed.data

    const questions = await prisma.assessmentQuestion.findMany({
      where: { id: { in: responses.map(r => r.questionId) }, isActive: true },
    })

    if (questions.length !== 10) {
      return NextResponse.json({ error: { message: 'Invalid assessment questions', code: 'INVALID_QUESTIONS' } }, { status: 400 })
    }

    // Score responses
    let score = 0
    const scoredResponses = responses.map(response => {
      const question = questions.find(q => q.id === response.questionId)!
      const isCorrect = response.selectedOption === question.correctOption
      if (isCorrect) score++
      return { questionId: response.questionId, selectedOption: response.selectedOption, isCorrect }
    })

    // Determine pipeline track
    let pipelineTrack: 'educational_pathway' | 'direct_development_track' | 'borderline'
    let isBorderline = false

    if (score <= 4) {
      pipelineTrack = 'educational_pathway'
    } else if (score === 5) {
      pipelineTrack = 'borderline'
      isBorderline = true
    } else {
      pipelineTrack = 'direct_development_track'
    }

    await prisma.$transaction(async (tx) => {
      // Delete any existing responses for this application
      await tx.assessmentResponse.deleteMany({
        where: { applicationId },
      })

      // Write new responses
      await tx.assessmentResponse.createMany({
        data: scoredResponses.map(r => ({ ...r, applicationId })),
      })

      // Update application with score and pipeline track
      await tx.application.update({
        where: { id: applicationId },
        data: {
          assessmentScore: score,
          pipelineTrack,
          isBorderline,
          currentStep: 7,
        },
      })
    })

    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        action: 'assessment.completed',
        targetType: 'Application',
        targetId: applicationId,
        metadata: { score, pipelineTrack, isBorderline },
      },
    })

    return NextResponse.json({
      data: { score, pipelineTrack, isBorderline },
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/applications/[id]/assessment]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

**3.5 — `POST /api/applications/[id]/submit`**

Final submission. Locks the application, writes the audit log, and sends a confirmation notification.

Create `app/api/applications/[id]/submit/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole('applicant')
    const applicationId = params.id

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
      },
    })

    if (!application) {
      return NextResponse.json({ error: { message: 'Application not found', code: 'NOT_FOUND' } }, { status: 404 })
    }

    if (application.userId !== user.userId) {
      return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }

    if (application.status === 'submitted') {
      return NextResponse.json({ error: { message: 'Application already submitted', code: 'ALREADY_SUBMITTED' } }, { status: 400 })
    }

    // Verify all steps are complete
    if (
      !application.personalInfo ||
      !application.educationInfo ||
      !application.experienceInfo ||
      !application.sectorInfo ||
      !application.motivationInfo ||
      application.assessmentScore === null
    ) {
      return NextResponse.json(
        { error: { message: 'Application is incomplete', code: 'INCOMPLETE' } },
        { status: 400 }
      )
    }

    // Lock the application
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
      },
    })

    // Write audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.userId,
        action: 'application.submitted',
        targetType: 'Application',
        targetId: applicationId,
        metadata: {
          pipelineTrack: application.pipelineTrack,
          assessmentScore: application.assessmentScore,
          isBorderline: application.isBorderline,
        },
      },
    })

    // Create in-platform notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        type: 'application_submitted',
        message: 'Your application has been received. We will be in touch with next steps.',
      },
    })

    // Send confirmation email
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.userId },
      select: { email: true, firstName: true },
    })

    if (userRecord) {
      await resend.emails.send({
        from: 'NIDC <no-reply@nidc.org>',
        to: userRecord.email,
        subject: 'Your NIDC application has been received',
        html: `
          <p>Hi ${userRecord.firstName ?? 'there'},</p>
          <p>Thank you for applying to NIDC. Your application has been received and is now under review.</p>
          <p>We will contact you with the outcome of your application. This process may take some time as we review all applications carefully.</p>
          <p>In the meantime, you can log in to your dashboard to view your application status.</p>
          <p>The NIDC Team</p>
        `,
      })
    }

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[POST /api/applications/[id]/submit]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

### 4. Add Notification Model

The submission route writes a `Notification` record. Add this model to `prisma/schema.prisma` and run a new migration:

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("notifications")
}
```

```bash
npx prisma migrate dev --name add_notification_model
```

### 5. Build the Application Form UI

Create `app/(dashboard)/applicant/apply/page.tsx` — the multi-step application form.

**Structure:**
- A step indicator at the top showing steps 1–6 with the current step highlighted in `bg-brand-lime`
- Each step renders its own form section
- A Next button saves the current step via `PATCH /api/applications/[id]/step/[step]` and advances to the next step
- A Back button returns to the previous step without saving
- Step 6 renders the assessment questions fetched from `GET /api/assessments/questions`
- After Step 6 is submitted via `POST /api/applications/[id]/assessment`, a review screen shows the candidate their pipeline assignment
- A final Submit button calls `POST /api/applications/[id]/submit`
- After submission, redirect to `/dashboard/applicant` with a success state

**Form behaviour:**
- On page load, call `GET /api/applications/me` — if a draft exists, resume from `application.currentStep`
- If no draft exists, call `POST /api/applications` to create one, then start at step 1
- If the application status is `submitted`, show a read-only confirmation state — do not render the form
- Show a loading state while API calls are in progress
- Show inline validation errors per field before allowing the candidate to proceed to the next step

### 6. Build Assessment Questions API Route

Create `app/api/assessments/questions/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await requireRole(['applicant', 'candidate'])

    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        order: true,
      },
    })

    return NextResponse.json({ data: questions })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHENTICATED') return NextResponse.json({ error: { message: 'Unauthenticated', code: 'UNAUTHENTICATED' } }, { status: 401 })
      if (error.message === 'UNAUTHORISED') return NextResponse.json({ error: { message: 'Unauthorised', code: 'UNAUTHORISED' } }, { status: 403 })
    }
    console.error('[GET /api/assessments/questions]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

Note: The `correctOption` field is never returned to the client. Only the question text and options are exposed.

### 7. Update the Applicant Dashboard

Update `app/(dashboard)/applicant/page.tsx` to show:

- If no application exists: a CTA card — "Start Your Application" linking to `/dashboard/applicant/apply`
- If application status is `draft`: a resume card — "Continue Your Application" showing current step progress and a link to `/dashboard/applicant/apply`
- If application status is `submitted`: a status card — "Application Submitted" with the submission date and a message that the team will be in touch
- In all states: a notifications panel showing unread notifications from `GET /api/notifications/me`

### 8. Build Notifications API Route

Create `app/api/notifications/me/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await requireRole([
      'applicant', 'candidate', 'mentor', 'screening_team',
      'program_director', 'deputy_program_director',
      'finance_officer', 'administrator', 'grant_officer', 'donor'
    ])

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ data: notifications })
  } catch (error) {
    console.error('[GET /api/notifications/me]', error)
    return NextResponse.json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } }, { status: 500 })
  }
}
```

---

## Dependencies

- Feature Spec 01 and 02 fully complete and verified
- Prisma client available in `lib/prisma.ts`
- Clerk role helpers available in `lib/clerk.ts`
- Resend client available in `lib/resend.ts`
- `Cohort` model already exists from Feature Spec 02
- At least one open cohort must exist in the database for the application flow to work — create one manually via Prisma Studio or seed script before testing:

```bash
npx prisma studio
```

Create a `Cohort` record with `status: open`, `applicationWindowOpen` set to today, and `applicationWindowClose` set to a future date.

---

## Verification Checklist

Before marking this spec complete and moving to Feature Spec 04, verify every item:

### Database
- [ ] Migration `add_application_system` applied cleanly
- [ ] Migration `add_notification_model` applied cleanly
- [ ] `npx prisma validate` passes with no errors
- [ ] 10 assessment questions exist in the database after running `npx prisma db seed`
- [ ] At least one open cohort exists for testing

### Application Flow
- [ ] A signed-in applicant visiting `/dashboard/applicant` with no application sees the Start Application CTA
- [ ] Clicking Start Application creates a draft application and renders Step 1
- [ ] Completing Step 1 and clicking Next saves the data and advances to Step 2
- [ ] Closing the browser and returning resumes from the last completed step
- [ ] All six steps can be completed in sequence
- [ ] Step 6 renders all 10 assessment questions with 4 options each
- [ ] Correct options are never exposed to the client
- [ ] Submitting the assessment scores the responses and assigns a pipeline track
- [ ] Score 0–4 assigns Educational Pathway
- [ ] Score 5 assigns borderline and sets `isBorderline: true`
- [ ] Score 6–10 assigns Direct Development Track
- [ ] The review screen shows the candidate their pipeline assignment before final submission
- [ ] Clicking Submit calls the submit route and locks the application
- [ ] After submission the form is read-only
- [ ] A confirmation email is sent to the candidate after submission
- [ ] An in-platform notification is created after submission

### API Routes
- [ ] `GET /api/applications/me` returns `null` for a user with no application
- [ ] `POST /api/applications` returns `400` when no active cohort exists
- [ ] `PATCH /api/applications/[id]/step/[step]` returns `400` for a submitted application
- [ ] `POST /api/applications/[id]/submit` returns `400` if any step is incomplete
- [ ] `GET /api/assessments/questions` does not include `correctOption` in the response
- [ ] All routes return `401` for unauthenticated requests
- [ ] All routes return `403` for wrong role

### Invariants
- [ ] `pipelineTrack` on `Application` cannot be updated after `status = submitted` — verify no route allows this
- [ ] `AuditLog` entries are written for application created, assessment completed, and application submitted
- [ ] No `AuditLog` update or delete operations exist in any code added in this spec

### Code Quality
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No raw hex colour values in any className
- [ ] All API route request bodies validated with Zod before any logic runs

### Documentation
- [ ] `architecture.md` updated — all new API routes and models added
- [ ] `progress-tracker.md` updated — Phase 3 units marked as done

---

## Open Questions

None. All decisions required for this spec were resolved before writing.