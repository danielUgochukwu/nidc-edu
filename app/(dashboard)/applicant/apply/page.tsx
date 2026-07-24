import { redirect } from "next/navigation";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { requireRole } from "@/lib/clerk";

async function requireApplicantUser() {
  let authError: string | null = null;

  try {
    return await requireRole("applicant");
  } catch (error) {
    authError = error instanceof Error ? error.message : "AUTH_ERROR";
  }

  if (authError === "UNAUTHENTICATED") redirect("/sign-in");
  if (authError === "UNAUTHORIZED") redirect("/unauthorized");

  throw new Error(authError);
}

export default async function ApplicantApplyPage() {
  await requireApplicantUser();

  return <ApplicationForm />;
}
