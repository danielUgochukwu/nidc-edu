import type { Application } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await requireRole("applicant");

    const activeCohort = await prisma.cohort.findFirst({
      where: {
        status: "open",
        applicationWindowOpen: { lte: new Date() },
        applicationWindowClose: { gte: new Date() },
      },
    });

    if (!activeCohort) {
      return NextResponse.json(
        {
          error: {
            message: "No active cohort",
            code: "NO_ACTIVE_COHORT",
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.application.findFirst({
      where: { userId: user.userId, cohortId: activeCohort.id },
    });

    if (existing) {
      return NextResponse.json({ data: existing }, { status: 200 });
    }

    let application: Application;

    try {
      application = await prisma.$transaction(async (tx) => {
        const created = await tx.application.create({
          data: {
            userId: user.userId,
            cohortId: activeCohort.id,
            currentStep: 1,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: user.userId,
            action: "application.created",
            targetType: "Application",
            targetId: created.id,
            metadata: { cohortId: activeCohort.id },
          },
        });

        return created;
      });
    } catch (writeError) {
      console.error("[POST /api/applications] database write failed", writeError);
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

    return NextResponse.json({ data: application }, { status: 201 });
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

    console.error("[POST /api/applications]", error);
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
