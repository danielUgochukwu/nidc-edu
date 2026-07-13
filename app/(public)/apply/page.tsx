import ApplyCta from "@/components/public/ApplyCta";
import CohortStatusBanner from "@/components/public/CohortStatusBanner";
import PublicLinkButton from "@/components/public/PublicLinkButton";
import {
  FeatureCard,
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Apply — Enter the NIDC System",
  description:
    "Apply to join the first NIDC cohort. Application is selective. Participation is intentional.",
};

const forItems = [
  "Take responsibility for their growth",
  "Are willing to commit long-term",
  "Want to build real capability not just gain access",
  "Are ready to contribute not just participate",
];

const notForItems = [
  "Are looking for quick opportunities",
  "Want passive support without effort",
  "Are not ready for structured development",
];

const entrySteps = [
  {
    title: "Step 1 — Application",
    body: "You submit your details, background, and intent. This is not about perfect qualifications. It is about clarity, seriousness, and direction.",
  },
  {
    title: "Step 2 — Review",
    body: "Applications are reviewed based on: Alignment with the system, Evidence of discipline and consistency, Long-term intent.",
  },
  {
    title: "Step 3 — Selection",
    body: "A limited number of individuals are selected into the initial cohort. This is not mass entry.",
  },
  {
    title: "Step 4 — Integration",
    body: "Selected individuals are placed within a structured development pathway, aligned with real system activity, and integrated progressively as they grow.",
  },
];

const afterEntryItems = [
  "You receive structured guidance",
  "Your development is tracked",
  "You gain access to aligned opportunities",
  "You are gradually integrated into real systems",
];

const expectationItems = [
  "Consistency over time",
  "Accountability for your progress",
  "Willingness to grow through structured effort",
  "Commitment to contribution",
];

export default function ApplyPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <div className="max-w-4xl">
          <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
            Enter the System
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            This is not an open-access program. It is a structured entry point
            into a system designed to develop and deploy individuals toward
            real-world contribution. Application is selective. Participation is
            intentional.
          </p>
          <div className="mt-8">
            <CohortStatusBanner />
          </div>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              This is for individuals who:
            </h2>
            <div className="mt-6 grid gap-4">
              {forItems.map((item) => (
                <p key={item} className="text-base text-text-secondary">
                  {item}
                </p>
              ))}
            </div>
          </article>
          <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              This is not for individuals who:
            </h2>
            <div className="mt-6 grid gap-4">
              {notForItems.map((item) => (
                <p key={item} className="text-base text-text-secondary">
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader title="How Entry Works" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {entrySteps.map((step) => (
            <FeatureCard key={step.title} title={step.title} body={step.body} />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <p className="max-w-4xl text-base leading-relaxed text-text-secondary">
          You are not applying to be &apos;prepared&apos; for something in the
          future. You are applying to enter a system that is already being
          built, where your development will align with real work over time.
        </p>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader title="What Happens After Entry" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {afterEntryItems.map((item) => (
            <FeatureCard key={item} title={item} body={item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader title="Expectations" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {expectationItems.map((item) => (
            <FeatureCard key={item} title={item} body={item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <p className="max-w-4xl text-base leading-relaxed text-text-secondary">
          We are currently selecting a small initial cohort. The focus is on
          building the system properly — not scaling prematurely.
        </p>
      </PublicSection>

      <PublicSection className="bg-brand-charcoal">
        <div className="max-w-4xl">
          <SectionHeader
            title="If this aligns with how you think — apply."
            body="Supporting documents such as academic records or certificates are not required at this stage. They will only be requested from shortlisted applicants during the review process."
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ApplyCta />
            <PublicLinkButton href="/programs" variant="secondary">
              Learn More
            </PublicLinkButton>
          </div>
        </div>
      </PublicSection>
    </>
  );
}
