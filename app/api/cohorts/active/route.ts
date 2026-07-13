import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeCohort = await prisma.cohort.findFirst({
      where: {
        status: "open",
        applicationWindowOpen: { lte: new Date() },
        applicationWindowClose: { gte: new Date() },
      },
      select: { id: true, name: true, applicationWindowClose: true },
    });

    return NextResponse.json({
      data: {
        isOpen: !!activeCohort,
        cohort: activeCohort ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/cohorts/active]", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 },
    );
  }
}
