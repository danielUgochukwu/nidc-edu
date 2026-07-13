import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Role } from "@prisma/client";

export async function getAuthenticatedUser() {
  const { userId, sessionClaims } = await auth();

  if (!userId) return null;

  const role =
    (sessionClaims?.metadata as { role?: Role } | undefined)?.role ?? null;

  return { userId, role };
}

export async function requireRole(requiredRole: Role | Role[]) {
  const user = await getAuthenticatedUser();

  if (!user) throw new Error("UNAUTHENTICATED");

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!user.role || !roles.includes(user.role)) {
    throw new Error("UNAUTHORISED");
  }

  return user;
}

export async function setUserRole(clerkUserId: string, role: Role) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: { role },
  });
}
