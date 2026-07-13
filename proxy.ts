import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  /^\/api\/webhooks(?:\/.*)?$/,
];

const roleRouteMap: Record<string, string> = {
  applicant: "/dashboard/applicant",
  candidate: "/dashboard/candidate",
  mentor: "/dashboard/mentor",
  screening_team: "/dashboard/screening",
  program_director: "/dashboard/program-director",
  deputy_program_director: "/dashboard/program-director",
  finance_officer: "/dashboard/finance",
  administrator: "/dashboard/admin",
  grant_officer: "/dashboard/finance",
  donor: "/dashboard/donor",
};

const rolePermittedPrefixes: Record<string, string[]> = {
  applicant: ["/dashboard/applicant"],
  candidate: ["/dashboard/candidate"],
  mentor: ["/dashboard/mentor"],
  screening_team: ["/dashboard/screening"],
  program_director: ["/dashboard/program-director", "/dashboard/screening"],
  deputy_program_director: [
    "/dashboard/program-director",
    "/dashboard/screening",
  ],
  finance_officer: ["/dashboard/finance"],
  administrator: ["/dashboard/admin"],
  grant_officer: ["/dashboard/finance"],
  donor: ["/dashboard/donor"],
};

function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => route.test(pathname));
}

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req.nextUrl.pathname)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/unauthorised", req.url));
  }

  const pathname = req.nextUrl.pathname;
  const permitted = rolePermittedPrefixes[role] ?? [];
  const isPermitted = permitted.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  );

  if (!isPermitted && pathname.startsWith("/dashboard")) {
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
