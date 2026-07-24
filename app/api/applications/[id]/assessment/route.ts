import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  id: z.string().min(1),
});

const assessmentSchema = z.object({
  responses: z
    .array(
      z.object({
        questionId: z.string().min(1),
        selectedOption: z.enum(["A", "B", "C", "D"]),
      }),
    )
    .length(10),
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

export async function POST(
  req: NextRequest,
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

    const parsed = assessmentSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.flatten());
    }

    const { responses } = parsed.data;
    const questionIds = responses.map((response) => response.questionId);
    const uniqueQuestionIds = new Set(questionIds);

    if (uniqueQuestionIds.size !== 10) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid assessment questions",
            code: "INVALID_QUESTIONS",
          },
        },
        { status: 400 },
      );
    }

    const questions = await prisma.assessmentQuestion.findMany({
      where: { id: { in: questionIds }, isActive: true },
      select: { id: true, correctOption: true },
    });

    if (questions.length !== 10) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid assessment questions",
            code: "INVALID_QUESTIONS",
          },
        },
        { status: 400 },
      );
    }

    const questionsById = new Map(
      questions.map((question) => [question.id, question.correctOption]),
    );
    let score = 0;

    const scoredResponses = responses.map((response) => {
      const correctOption = questionsById.get(response.questionId);
      const isCorrect = response.selectedOption === correctOption;
      if (isCorrect) score += 1;

      return {
        questionId: response.questionId,
        selectedOption: response.selectedOption,
        isCorrect,
      };
    });

    const pipelineTrack =
      score <= 4
        ? "educational_pathway"
        : score === 5
          ? "borderline"
          : "direct_development_track";
    const isBorderline = score === 5;

    try {
      await prisma.$transaction(async (tx) => {
        await tx.assessmentResponse.deleteMany({
          where: { applicationId },
        });

        await tx.assessmentResponse.createMany({
          data: scoredResponses.map((response) => ({
            ...response,
            applicationId,
          })),
        });

        await tx.application.update({
          where: { id: applicationId },
          data: {
            assessmentScore: score,
            pipelineTrack,
            isBorderline,
            currentStep: 7,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: user.userId,
            action: "assessment.completed",
            targetType: "Application",
            targetId: applicationId,
            metadata: { score, pipelineTrack, isBorderline },
          },
        });
      });
    } catch (writeError) {
      console.error(
        "[POST /api/applications/[id]/assessment] database write failed",
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
      data: { score, pipelineTrack, isBorderline },
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

    console.error("[POST /api/applications/[id]/assessment]", error);
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
