import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  id: z.string().min(1),
  step: z.coerce.number().int().min(1).max(5),
});

const personalInfoSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1)
    .refine((value) => !Number.isNaN(Date.parse(value))),
  gender: z.string().min(1),
  stateOfOrigin: z.string().min(1),
  stateOfResidence: z.string().min(1),
  phoneNumber: z.string().min(1),
});

const educationInfoSchema = z.object({
  educationLevel: z.enum([
    "no_formal_education",
    "primary",
    "secondary",
    "vocational_trade",
    "undergraduate",
    "postgraduate",
  ]),
  fieldOfStudy: z.string().optional(),
  institutionName: z.string().optional(),
  yearCompleted: z.number().int().optional(),
});

const experienceInfoSchema = z.object({
  employmentStatus: z.enum([
    "unemployed",
    "self_employed",
    "employed",
    "student",
  ]),
  currentRole: z.string().optional(),
  experienceYears: z.enum([
    "none",
    "less_than_1",
    "one_to_3",
    "three_to_5",
    "five_plus",
  ]),
  experienceDescription: z.string().max(1000).optional(),
});

const sectorInfoSchema = z.object({
  sectorPreference: z.enum([
    "energy_systems",
    "manufacturing_industrial_systems",
    "digital_infrastructure",
  ]),
  sectorReason: z.string().min(1).max(750),
});

const motivationInfoSchema = z.object({
  whyApplying: z.string().min(1).max(1250),
  longTermCommitment: z.string().min(1).max(750),
  howHeard: z.enum([
    "social_media",
    "word_of_mouth",
    "online_search",
    "event",
    "referred",
    "other",
  ]),
});

function validationError(details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details,
      },
    },
    { status: 400 },
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; step: string }> },
) {
  try {
    const user = await requireRole("applicant");
    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid step",
            code: "INVALID_STEP",
          },
        },
        { status: 400 },
      );
    }

    const { id: applicationId, step: stepNumber } = parsedParams.data;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        {
          error: {
            message: "Application not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    if (application.userId !== user.userId) {
      return NextResponse.json(
        {
          error: {
            message: "Unauthorised",
            code: "UNAUTHORISED",
          },
        },
        { status: 403 },
      );
    }

    if (application.status !== "draft") {
      return NextResponse.json(
        {
          error: {
            message: "Application already submitted",
            code: "ALREADY_SUBMITTED",
          },
        },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return validationError();
    }

    try {
      if (stepNumber === 1) {
        const parsed = personalInfoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error.flatten());
        const data = parsed.data;
        const dateOfBirth = new Date(data.dateOfBirth);

        await prisma.$transaction(async (tx) => {
          await tx.applicationPersonalInfo.upsert({
            where: { applicationId },
            update: { ...data, dateOfBirth },
            create: { applicationId, ...data, dateOfBirth },
          });

          const currentApplication = await tx.application.findUnique({
            where: { id: applicationId },
            select: { currentStep: true },
          });

          if (!currentApplication) {
            throw new Error("APPLICATION_NOT_FOUND_DURING_STEP_SAVE");
          }

          await tx.application.update({
            where: { id: applicationId },
            data: { currentStep: Math.max(currentApplication.currentStep, 2) },
          });
        });
      } else if (stepNumber === 2) {
        const parsed = educationInfoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error.flatten());
        const data = parsed.data;

        await prisma.$transaction(async (tx) => {
          await tx.applicationEducationInfo.upsert({
            where: { applicationId },
            update: data,
            create: { applicationId, ...data },
          });

          const currentApplication = await tx.application.findUnique({
            where: { id: applicationId },
            select: { currentStep: true },
          });

          if (!currentApplication) {
            throw new Error("APPLICATION_NOT_FOUND_DURING_STEP_SAVE");
          }

          await tx.application.update({
            where: { id: applicationId },
            data: { currentStep: Math.max(currentApplication.currentStep, 3) },
          });
        });
      } else if (stepNumber === 3) {
        const parsed = experienceInfoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error.flatten());
        const data = parsed.data;

        await prisma.$transaction(async (tx) => {
          await tx.applicationExperienceInfo.upsert({
            where: { applicationId },
            update: data,
            create: { applicationId, ...data },
          });

          const currentApplication = await tx.application.findUnique({
            where: { id: applicationId },
            select: { currentStep: true },
          });

          if (!currentApplication) {
            throw new Error("APPLICATION_NOT_FOUND_DURING_STEP_SAVE");
          }

          await tx.application.update({
            where: { id: applicationId },
            data: { currentStep: Math.max(currentApplication.currentStep, 4) },
          });
        });
      } else if (stepNumber === 4) {
        const parsed = sectorInfoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error.flatten());
        const data = parsed.data;

        await prisma.$transaction(async (tx) => {
          await tx.applicationSectorInfo.upsert({
            where: { applicationId },
            update: data,
            create: { applicationId, ...data },
          });

          const currentApplication = await tx.application.findUnique({
            where: { id: applicationId },
            select: { currentStep: true },
          });

          if (!currentApplication) {
            throw new Error("APPLICATION_NOT_FOUND_DURING_STEP_SAVE");
          }

          await tx.application.update({
            where: { id: applicationId },
            data: { currentStep: Math.max(currentApplication.currentStep, 5) },
          });
        });
      } else {
        const parsed = motivationInfoSchema.safeParse(body);
        if (!parsed.success) return validationError(parsed.error.flatten());
        const data = parsed.data;

        await prisma.$transaction(async (tx) => {
          await tx.applicationMotivationInfo.upsert({
            where: { applicationId },
            update: data,
            create: { applicationId, ...data },
          });

          const currentApplication = await tx.application.findUnique({
            where: { id: applicationId },
            select: { currentStep: true },
          });

          if (!currentApplication) {
            throw new Error("APPLICATION_NOT_FOUND_DURING_STEP_SAVE");
          }

          await tx.application.update({
            where: { id: applicationId },
            data: { currentStep: Math.max(currentApplication.currentStep, 6) },
          });
        });
      }
    } catch (writeError) {
      console.error(
        "[PATCH /api/applications/[id]/step/[step]] database write failed",
        writeError,
      );
      return NextResponse.json(
        {
          error: {
            message: "Internal server error",
            code: "INTERNAL_ERROR",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: { success: true, nextStep: stepNumber + 1 },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json(
          {
            error: {
              message: "Unauthenticated",
              code: "UNAUTHENTICATED",
            },
          },
          { status: 401 },
        );
      }

      if (error.message === "UNAUTHORISED") {
        return NextResponse.json(
          {
            error: {
              message: "Unauthorised",
              code: "UNAUTHORISED",
            },
          },
          { status: 403 },
        );
      }
    }

    console.error("[PATCH /api/applications/[id]/step/[step]]", error);
    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 },
    );
  }
}
