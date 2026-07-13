"use client";

import { useUser } from "@clerk/nextjs";
import PublicLinkButton from "./PublicLinkButton";

export default function ApplyCta() {
  const { isLoaded, isSignedIn } = useUser();
  const href = isLoaded && isSignedIn ? "/dashboard/applicant" : "/sign-up";

  return <PublicLinkButton href={href}>Apply Now</PublicLinkButton>;
}
