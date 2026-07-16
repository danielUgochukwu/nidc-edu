import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRoleFromSessionClaims } from "@/lib/auth-claims";

const publicRoutes = [
  /^\/$/,
  /^\/about$/,
  /^\/programs$/,
  /^\/sectors$/,
  /^\/apply$/,
  /^\/donate$/,
  /^\/impact$/,
  /^\/contact$/,
  /^\/faqs$/,
  /^\/blog(?:\/.*)?$/,
  /^\/sign-in(?:\/.*)?$/,
  /^\/sign-up(?:\/.*)?$/,
  /^\/unauthorised$/,
  /^\/api\/contact$/,
  /^\/api\/cohorts\/active$/,
  /^\/api\/webhooks(?:\/.*)?$/,
];

const roleRouteMap: Record<string, string> = {
  applicant: "/applicant",
  candidate: "/candidate",
  mentor: "/mentor",
  screening_team: "/screening",
  program_director: "/program-director",
  deputy_program_director: "/program-director",
  finance_officer: "/finance",
  administrator: "/admin",
  grant_officer: "/finance",
  donor: "/donor",
};

const rolePermittedPrefixes: Record<string, string[]> = {
  applicant: ["/applicant"],
  candidate: ["/candidate"],
  mentor: ["/mentor"],
  screening_team: ["/screening"],
  program_director: ["/program-director", "/screening"],
  deputy_program_director: ["/program-director", "/screening"],
  finance_officer: ["/finance"],
  administrator: ["/admin"],
  grant_officer: ["/finance"],
  donor: ["/donor"],
};

const protectedRolePrefixes = Array.from(
  new Set(Object.values(rolePermittedPrefixes).flat()),
);

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => route.test(pathname));
}

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isProtectedRoleRoute(pathname: string) {
  return protectedRolePrefixes.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  );
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req.nextUrl.pathname)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = getRoleFromSessionClaims(sessionClaims);

  if (!role) {
    if (matchesRoutePrefix(req.nextUrl.pathname, "/applicant")) {
      return NextResponse.next();
    }
    if (isProtectedRoleRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/applicant", req.url));
    }
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;
  const permitted = rolePermittedPrefixes[role] ?? [];
  const isPermitted = permitted.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  );

  if (!isPermitted && isProtectedRoleRoute(pathname)) {
    const defaultRoute = roleRouteMap[role] ?? "/unauthorised";
    return NextResponse.redirect(new URL(defaultRoute, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
