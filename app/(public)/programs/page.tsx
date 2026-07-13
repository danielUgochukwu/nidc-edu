import Image from "next/image";
import PublicLinkButton from "@/components/public/PublicLinkButton";
import {
  FeatureCard,
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Programs — NIDC Talent Pipeline",
  description:
    "A structured pathway designed to develop individuals and position them for real-world impact.",
};

const phases = [
  {
    title: "Phase 1 — Selection",
    body: "A limited number of individuals are identified based on: Seriousness and discipline, Long-term intent, Willingness to take responsibility for their growth. This is not mass participation. It is structured entry.",
  },
  {
    title: "Phase 2 — Development",
    body: "Participants enter a guided development pathway: Structured learning direction, Skill-building aligned with real sectors, Continuous progress tracking. Development will take place locally and internationally.",
  },
  {
    title: "Phase 3 — Parallel Growth",
    body: "While individuals are developing: System-level work continues, Early-stage hubs and projects evolve, Real-world environments begin taking shape. Participants are not disconnected from this process — their development is aligned with it.",
  },
  {
    title: "Phase 4 — Integration & Contribution",
    body: "As individuals grow: They are integrated into active systems, They contribute to ongoing projects, They take on increasing responsibility. They are not starting something new. They are strengthening what already exists.",
  },
];

const receiveItems = [
  "Clear development direction",
  "Structured pathway for growth",
  "Access to aligned opportunities",
  "Integration into a growing system",
];

const expectedItems = [
  "Consistency in effort",
  "Personal accountability",
  "Willingness to grow over time",
  "Commitment to contribution not just participation",
];

export default function ProgramsPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
              The Talent Pipeline
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              This is not a traditional program. It is a structured pathway
              designed to develop individuals and position them for real-world
              impact — a structured pathway into a system that is actively being
              developed, where development and real-world contribution happen
              together.
            </p>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              Participants are not prepared in isolation. They are developed to
              engage with systems that are actively being built.
            </p>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-md border border-surface-elevated">
            <Image
              src="/images/collaboration.png"
              alt="Collaborative NIDC pipeline planning"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Development Is Not Separate From Contribution"
          body="Growth within NIDC is aligned with real work. While individuals are developing locally or internationally, system-level execution continues. As capability increases, individuals are integrated into environments where their skills are applied, tested, and expanded."
        />
      </PublicSection>

      <PublicSection id="how-pipeline-works" className="bg-surface-secondary">
        <SectionHeader title="How the Pipeline Works" />
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {phases.map((phase) => (
            <FeatureCard
              key={phase.title}
              title={phase.title}
              body={phase.body}
            />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              What You Receive
            </h2>
            <div className="mt-6 grid gap-4">
              {receiveItems.map((item) => (
                <p key={item} className="text-base text-text-secondary">
                  {item}
                </p>
              ))}
            </div>
          </article>
          <article className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              What Is Expected
            </h2>
            <div className="mt-6 grid gap-4">
              {expectedItems.map((item) => (
                <p key={item} className="text-base text-text-secondary">
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <p className="max-w-4xl text-base leading-relaxed text-text-secondary">
          The system is currently in its early phase. Initial structures are
          being established while the first cohort is being identified. Growth
          will be gradual, intentional, and structured.
        </p>
      </PublicSection>

      <PublicSection className="bg-brand-charcoal">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            title="Enter the System"
            body="If you are serious about becoming capable and applying that capability where it matters, you can apply to be part of the first cohort."
          />
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <PublicLinkButton href="/apply">Apply to Join</PublicLinkButton>
            <PublicLinkButton href="#how-pipeline-works" variant="secondary">
              Learn How It Works
            </PublicLinkButton>
          </div>
        </div>
      </PublicSection>
    </>
  );
}
