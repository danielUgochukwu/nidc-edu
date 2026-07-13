import { WebhookEvent } from "@clerk/nextjs/server";
import type { Role } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { setUserRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

type ClerkUnsafeMetadata = {
  inviteToken?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 401 });
    }

    const body = await req.text();
    const wh = new Webhook(webhookSecret);

    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch {
      return new Response("Invalid webhook signature", { status: 401 });
    }

    if (event.type !== "user.created") {
      return new Response("Event type not handled", { status: 200 });
    }

    const {
      id: clerkId,
      email_addresses: emailAddresses,
      first_name: firstName,
      last_name: lastName,
      unsafe_metadata: unsafeMetadata,
    } = event.data;
    const email = emailAddresses?.[0]?.email_address;

    if (!clerkId || !email) {
      return new Response("Missing required user data", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
    });
    if (existingUser) {
      return new Response("User already processed", { status: 200 });
    }

    let resolvedRole: Role = "applicant";
    const inviteToken = (unsafeMetadata as ClerkUnsafeMetadata | undefined)
      ?.inviteToken;
    const now = new Date();

    const invite = inviteToken
      ? await prisma.invite.findUnique({
          where: { token: inviteToken },
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            expiresAt: true,
          },
        })
      : null;

    try {
      resolvedRole = await prisma.$transaction(async (tx) => {
        let transactionRole: Role = "applicant";
        let inviteAccepted = false;
        const inviteEmailMatches =
          invite && normalizeEmail(invite.email) === normalizeEmail(email);

        if (invite && inviteEmailMatches) {
          const consumedInvite = await tx.invite.updateMany({
            where: {
              id: invite.id,
              status: "pending",
              expiresAt: { gt: now },
            },
            data: { status: "accepted" },
          });

          if (consumedInvite.count === 1) {
            transactionRole = invite.role;
            inviteAccepted = true;
          }
        }

        await tx.user.create({
          data: {
            clerkId,
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            role: transactionRole,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: clerkId,
            action: "user.created",
            targetType: "User",
            targetId: clerkId,
            metadata: {
              role: transactionRole,
              source: inviteAccepted ? "invite" : "public_registration",
            },
          },
        });

        return transactionRole;
      });
    } catch (error) {
      console.error("[POST /api/webhooks/clerk] database write failed", error);
      return new Response("Internal server error", { status: 500 });
    }

    await setUserRole(clerkId, resolvedRole);

    return new Response("User created successfully", { status: 200 });
  } catch (error) {
    console.error("[POST /api/webhooks/clerk]", error);
    return new Response("Internal server error", { status: 500 });
  }
}
