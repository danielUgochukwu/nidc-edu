import type { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/resend";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum([
    "mentor",
    "screening_team",
    "program_director",
    "deputy_program_director",
    "finance_officer",
    "administrator",
    "grant_officer",
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = inviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid request body",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 },
      );
    }

    const actor = await requireRole("administrator");
    const { email, role } = parsed.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      return NextResponse.json(
        {
          error: {
            message: "Application URL is not configured",
            code: "CONFIGURATION_ERROR",
          },
        },
        { status: 500 },
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    let inviteId: string;
    let inviteUrl: string;

       try {
         const result = await prisma.$transaction(async (tx) => {
           const invite = await tx.invite.create({
             data: {
               email,
               role: role as Role,
               createdById: actor.userId,
               expiresAt,
             },
             select: {
               id: true,
               token: true,
             },
           });

           await tx.auditLog.create({
             data: {
               actorId: actor.userId,
               action: "invite.created",
               targetType: "Invite",
               targetId: invite.id,
               metadata: { email, role },
             },
           });

           return invite;
         });

         inviteId = result.id;
         inviteUrl = `${appUrl}/sign-up?inviteToken=${result.token}`;
       } catch (error) {
         console.error("[POST /api/invites] database write failed", error);
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

       try {
         await sendInviteEmail({
           to: email,
           role,
           inviteUrl,
           invitedBy: "NIDC Administrator",
         });
       } catch (emailError) {
         console.error(
           "[POST /api/invites] failed to send invite email",
           emailError,
         );
       }

    return NextResponse.json({ data: { inviteId } }, { status: 201 });
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

    console.error("[POST /api/invites]", error);
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
