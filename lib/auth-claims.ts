import type { Role } from "@prisma/client";

const validRoles = [
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
] satisfies Role[];

const validRoleSet = new Set<string>(validRoles);

type RoleClaims = {
  metadata?: { role?: unknown };
  publicMetadata?: { role?: unknown };
  public_metadata?: { role?: unknown };
  role?: unknown;
};

export function getRoleFromSessionClaims(
  sessionClaims: unknown,
): Role | null {
  const claims = sessionClaims as RoleClaims | null | undefined;
  const role =
    claims?.publicMetadata?.role ??
    claims?.public_metadata?.role ??
    claims?.metadata?.role ??
    claims?.role;

  if (typeof role !== "string" || !validRoleSet.has(role)) return null;

  return role as Role;
}
