import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { sendApplicationSubmittedEmail } from "@/lib/resend";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole("applicant");
    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
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

    const applicationId = parsedParams.data.id;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
      },
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

    if (
      !application.personalInfo ||
      !application.educationInfo ||
      !application.experienceInfo ||
      !application.sectorInfo ||
      !application.motivationInfo ||
      application.assessmentScore === null ||
      application.pipelineTrack === null
    ) {
      return NextResponse.json(
        {
          error: {
            message: "Application is incomplete",
            code: "INCOMPLETE",
          },
        },
        { status: 400 },
      );
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.application.update({
          where: { id: applicationId },
          data: {
            status: "submitted",
            submittedAt: new Date(),
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: user.userId,
            action: "application.submitted",
            targetType: "Application",
            targetId: applicationId,
            metadata: {
              pipelineTrack: application.pipelineTrack,
              assessmentScore: application.assessmentScore,
              isBorderline: application.isBorderline,
            },
          },
        });

        await tx.notification.create({
          data: {
            userId: user.userId,
            type: "application_submitted",
            message:
              "Your application has been received. We will be in touch with next steps.",
          },
        });
      });
    } catch (writeError) {
      console.error(
        "[POST /api/applications/[id]/submit] database write failed",
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

    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.userId },
      select: { email: true, firstName: true },
    });

    if (userRecord) {
      try {
        await sendApplicationSubmittedEmail({
          to: userRecord.email,
          firstName: userRecord.firstName ?? "there",
        });
      } catch (emailError) {
        console.error(
          "[POST /api/applications/[id]/submit] failed to send confirmation email",
          emailError,
        );
      }
    }

    return NextResponse.json({ data: { success: true } });
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

    console.error("[POST /api/applications/[id]/submit]", error);
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
