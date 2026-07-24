import { NextResponse } from "next/server";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireRole(["applicant", "candidate"]);

    const questions = await prisma.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        order: true,
      },
    });

    return NextResponse.json({ data: questions });
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

    console.error("[GET /api/assessments/questions]", error);
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
