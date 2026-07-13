import { WebhookEvent } from "@clerk/nextjs/server";
import type { Role } from "@prisma/client";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { setUserRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

type ClerkUnsafeMetadata = {
  inviteToken?: string;
};

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

    let resolvedRole: Role = "applicant";
    const inviteToken = (unsafeMetadata as ClerkUnsafeMetadata | undefined)
      ?.inviteToken;
    const now = new Date();

    const invite = inviteToken
      ? await prisma.invite.findUnique({
          where: { token: inviteToken },
          select: {
            id: true,
            role: true,
            status: true,
            expiresAt: true,
          },
        })
      : null;

    if (invite && invite.status === "pending" && invite.expiresAt > now) {
      resolvedRole = invite.role;
    }

    await setUserRole(clerkId, resolvedRole);

    try {
      await prisma.$transaction(async (tx) => {
        if (invite && invite.status === "pending" && invite.expiresAt > now) {
          await tx.invite.update({
            where: { id: invite.id },
            data: { status: "accepted" },
          });
        }

        await tx.user.create({
          data: {
            clerkId,
            email,
            firstName: firstName ?? null,
            lastName: lastName ?? null,
            role: resolvedRole,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: clerkId,
            action: "user.created",
            targetType: "User",
            targetId: clerkId,
            metadata: {
              role: resolvedRole,
              source: inviteToken ? "invite" : "public_registration",
            },
          },
        });
      });
    } catch (error) {
      console.error("[POST /api/webhooks/clerk] database write failed", error);
      return new Response("Internal server error", { status: 500 });
    }

    return new Response("User created successfully", { status: 200 });
  } catch (error) {
    console.error("[POST /api/webhooks/clerk]", error);
    return new Response("Internal server error", { status: 500 });
  }
}
