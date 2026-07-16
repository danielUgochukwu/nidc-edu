import {
  FeatureCard,
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Impact — NIDC",
  description:
    "Tracking the real-world impact of the NIDC talent development system.",
};

const metrics = [
  {
    value: "0",
    label: "Candidates in Pipeline",
    description: "The number of candidates actively moving through the system.",
  },
  {
    value: "0",
    label: "Cohorts Completed",
    description: "The number of cohorts that have completed structured development.",
  },
  {
    value: "0",
    label: "Sectors Active",
    description: "The number of sectors with active cohort deployment.",
  },
  {
    value: "0",
    label: "Mentors Engaged",
    description: "The number of mentors supporting candidate development.",
  },
];

const trackingItems = [
  "Candidates identified and developed",
  "Cohorts completed per sector",
  "Mentorship sessions conducted",
  "Individuals deployed into real systems",
];

export default function ImpactPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <div className="max-w-3xl">
          <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
            Building Toward Measurable Impact
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-secondary">
            NIDC is in its early phase. The system is being built
            deliberately and incrementally. This page will track real
            outcomes as the first cohort progresses.
          </p>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <p className="max-w-3xl text-base leading-relaxed text-text-secondary">
          These metrics will update as the first cohort begins. We do not
          manufacture numbers.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-md border border-surface-elevated bg-surface-secondary p-6"
            >
              <p className="font-heading text-5xl font-bold text-text-accent">
                {metric.value}
              </p>
              <h2 className="mt-4 font-heading text-xl font-semibold text-text-primary">
                {metric.label}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {metric.description}
              </p>
            </article>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader title="What We Will Track" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {trackingItems.map((item) => (
            <article
              key={item}
              className="rounded-md border border-surface-elevated bg-surface-secondary p-6"
            >
              <p className="text-base leading-relaxed text-text-secondary">
                {item}
              </p>
            </article>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <SectionHeader
          title="Where We Are Now"
          body="The first cohort is being selected. Infrastructure is being established. Development is underway. Impact reporting begins when real work begins."
        />
      </PublicSection>
    </>
  );
}
