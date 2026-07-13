import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const activeCohort = await prisma.cohort.findFirst({
      where: {
        status: "open",
        OR: [
          { applicationWindowOpen: null },
          { applicationWindowOpen: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { applicationWindowClose: null },
              { applicationWindowClose: { gte: now } },
            ],
          },
        ],
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
