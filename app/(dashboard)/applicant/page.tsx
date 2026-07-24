import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

type ApplicantDashboardProps = {
  searchParams: Promise<{ submitted?: string }>;
};

function formatDate(value: Date | string | null) {
  if (!value) return "Not submitted yet";
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function trackLabel(track: string | null) {
  if (track === "educational_pathway") return "Educational Pathway";
  if (track === "direct_development_track") return "Direct Development Track";
  if (track === "borderline") return "Borderline review";
  return "Pending assessment";
}

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-brand-lime px-6 py-3 text-sm font-medium text-text-on-light transition-colors hover:bg-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime";

async function requireApplicantUser() {
  let authError: string | null = null;

  try {
    return await requireRole("applicant");
  } catch (error) {
    authError = error instanceof Error ? error.message : "AUTH_ERROR";
  }

  if (authError === "UNAUTHENTICATED") redirect("/sign-in");
  if (authError === "UNAUTHORISED") redirect("/unauthorised");

  throw new Error(authError);
}

export default async function ApplicantDashboardPage({
  searchParams,
}: ApplicantDashboardProps) {
  const user = await requireApplicantUser();
  const params = await searchParams;

  const [application, notifications] = await Promise.all([
    prisma.application.findFirst({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        currentStep: true,
        pipelineTrack: true,
        submittedAt: true,
      },
    }),
    prisma.notification.findMany({
      where: { userId: user.userId, read: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <main className="min-h-screen bg-surface-primary p-6 md:p-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          {params.submitted === "true" ? (
            <p className="mb-6 rounded-md border border-brand-lime bg-surface-secondary p-4 text-sm font-medium text-text-accent">
              Your application has been submitted successfully.
            </p>
          ) : null}

          <div className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
            <p className="text-sm font-medium uppercase text-text-accent">
              Applicant dashboard
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
              Your NIDC application
            </h1>

            {!application ? (
              <>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                  You have not started an application for the current cohort.
                </p>
                <Link className={`${buttonClass} mt-6`} href="/applicant/apply">
                  Start Your Application
                </Link>
              </>
            ) : null}

            {application?.status === "draft" ? (
              <>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                  Your application is saved as a draft. Continue from step{" "}
                  {Math.min(application.currentStep, 6)} of 6.
                </p>
                <div className="mt-6 rounded-md border border-surface-elevated bg-surface-primary p-5">
                  <p className="text-sm font-medium text-text-secondary">
                    Current progress
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold text-text-primary">
                    Step {Math.min(application.currentStep, 6)} of 6
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    Pipeline track: {trackLabel(application.pipelineTrack)}
                  </p>
                </div>
                <Link className={`${buttonClass} mt-6`} href="/applicant/apply">
                  Continue Your Application
                </Link>
              </>
            ) : null}

            {application?.status === "submitted" ? (
              <>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                  Your application has been received. The team will be in touch
                  with the next steps.
                </p>
                <div className="mt-6 rounded-md border border-brand-lime bg-surface-primary p-5">
                  <p className="text-sm font-medium uppercase text-text-accent">
                    Application Submitted
                  </p>
                  <p className="mt-3 text-base text-text-secondary">
                    Submitted on {formatDate(application.submittedAt)}
                  </p>
                  <p className="mt-2 text-base text-text-secondary">
                    Pipeline track: {trackLabel(application.pipelineTrack)}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </section>

        <aside className="rounded-md border border-surface-elevated bg-surface-secondary p-6 shadow-card">
          <p className="text-sm font-medium uppercase text-text-accent">
            Notifications
          </p>
          <h2 className="mt-3 font-heading text-xl font-semibold text-text-primary">
            Unread updates
          </h2>

          {notifications.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              No unread notifications yet.
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className="border-t border-surface-elevated pt-4"
                >
                  <p className="text-sm font-medium text-text-primary">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-text-secondary">
                    {formatDate(notification.createdAt)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
