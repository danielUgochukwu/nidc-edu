import { NextResponse } from "next/server";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireRole(["applicant", "candidate"]);

    const application = await prisma.application.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        personalInfo: true,
        educationInfo: true,
        experienceInfo: true,
        sectorInfo: true,
        motivationInfo: true,
        responses: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                order: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: application });
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

    console.error("[GET /api/applications/me]", error);
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
