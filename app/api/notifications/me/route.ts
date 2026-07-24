import { NextResponse } from "next/server";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireRole([
      "applicant",
      "candidate",
      "mentor",
      "screening_team",
      "program_director",
      "deputy_program_director",
      "finance_officer",
      "administrator",
      "grant_officer",
      "donor",
    ]);

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ data: notifications });
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

    console.error("[GET /api/notifications/me]", error);
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
