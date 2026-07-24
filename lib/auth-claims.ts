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

function normalizeRole(role: unknown): Role | null {
  if (typeof role !== "string" || !validRoleSet.has(role)) return null;

  return role as Role;
}

export function getRoleFromMetadata(metadata: unknown): Role | null {
  if (!metadata || typeof metadata !== "object") return null;

  const record = metadata as { role?: unknown };
  return normalizeRole(record.role);
}

export function getRoleFromSessionClaims(
  sessionClaims: unknown,
): Role | null {
  const claims = sessionClaims as RoleClaims | null | undefined;

  return (
    getRoleFromMetadata(claims?.publicMetadata) ??
    getRoleFromMetadata(claims?.public_metadata) ??
    getRoleFromMetadata(claims?.metadata) ??
    normalizeRole(claims?.role)
  );
}
