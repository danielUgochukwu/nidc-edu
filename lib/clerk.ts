import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import type { Role } from "@prisma/client";
import {
  getRoleFromMetadata,
  getRoleFromSessionClaims,
} from "@/lib/auth-claims";
import { prisma } from "@/lib/prisma";

type AuthenticatedUser = {
  userId: string;
  role: Role | null;
  metadataChecked: boolean;
  hasInviteToken: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
};

function hasInviteToken(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return false;

  const record = metadata as { inviteToken?: unknown };
  return typeof record.inviteToken === "string" && record.inviteToken.length > 0;
}

async function ensureApplicantDefaults(user: AuthenticatedUser) {
  if (
    user.role ||
    !user.metadataChecked ||
    user.hasInviteToken
  ) {
    return null;
  }

  const email = user.email;

  try {
    if (email) {
      await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findFirst({
          where: {
            OR: [{ clerkId: user.userId }, { email }],
          },
          select: {
            id: true,
            clerkId: true,
            role: true,
          },
        });

        if (existingUser) {
          await tx.user.update({
            where: { id: existingUser.id },
            data: {
              clerkId: user.userId,
              email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: "applicant",
            },
          });
        } else {
          await tx.user.create({
            data: {
              clerkId: user.userId,
              email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: "applicant",
            },
          });
        }

        await tx.auditLog.create({
          data: {
            actorId: user.userId,
            action: "user.created",
            targetType: "User",
            targetId: user.userId,
            metadata: {
              role: "applicant",
              source: "applicant_route_self_heal",
              previousClerkId: existingUser?.clerkId,
              previousRole: existingUser?.role,
            },
          },
        });
      });
    }

    await setUserRole(user.userId, "applicant");
  } catch (error) {
    console.error("[requireRole] applicant self-heal failed", error);
    return null;
  }

  return "applicant" satisfies Role;
}

async function getClerkUserForAuth(userId: string) {
  const requestUser = await currentUser();
  if (requestUser?.id === userId) return requestUser;

  const client = await clerkClient();

  try {
    return await client.users.getUser(userId);
  } catch (error) {
    console.error("[getAuthenticatedUser] Clerk user lookup failed", error);
    return null;
  }
}

export async function getAuthenticatedUser() {
  const { userId, sessionClaims } = await auth();

  if (!userId) return null;

  let role = getRoleFromSessionClaims(sessionClaims);
  let metadataChecked = Boolean(role);
  let hasInviteTokenValue = false;
  let email: string | null = null;
  let firstName: string | null = null;
  let lastName: string | null = null;

  if (!role) {
    const clerkUser = await getClerkUserForAuth(userId);
    if (clerkUser) {
      metadataChecked = true;
      role = getRoleFromMetadata(clerkUser.publicMetadata);
      hasInviteTokenValue = hasInviteToken(clerkUser.unsafeMetadata);
      email =
        clerkUser.emailAddresses.find(
          (address) => address.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        null;
      firstName = clerkUser.firstName;
      lastName = clerkUser.lastName;
    }
  }

  return {
    userId,
    role,
    metadataChecked,
    hasInviteToken: hasInviteTokenValue,
    email,
    firstName,
    lastName,
  };
}

export async function requireRole(requiredRole: Role | Role[]) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const userRole =
    user.role ??
    (roles.includes("applicant") ? await ensureApplicantDefaults(user) : null);
  if (!userRole || !roles.includes(userRole)) {
    throw new Error("UNAUTHORISED");
  }
  return { userId: user.userId, role: userRole };
}

export async function setUserRole(clerkUserId: string, role: Role) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { role },
  });
}
