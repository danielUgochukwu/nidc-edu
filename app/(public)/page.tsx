import Image from "next/image";
import PublicLinkButton from "@/components/public/PublicLinkButton";
import {
  FeatureCard,
  PublicSection,
  SectionHeader,
  SectorBadge,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "NIDC — Building Systems. Developing the People Who Run Them.",
  description:
    "NIDC is building a system that develops people and builds real systems at the same time, across Energy, Manufacturing, and Digital Infrastructure.",
};

const steps = [
  {
    label: "Step 1",
    title: "Selection",
    body: "We identify a limited number of individuals who demonstrate seriousness, discipline, and willingness to grow.",
  },
  {
    label: "Step 2",
    title: "Development",
    body: "Participants go through a structured process focused on building real skills, direction, and accountability.",
  },
  {
    label: "Step 3",
    title: "Parallel Development",
    body: "While individuals are developing, the broader system — including hubs and projects — is built progressively. Development is aligned with real-world environments, not separated from them.",
  },
  {
    label: "Step 4",
    title: "Contribution",
    body: "Participants apply their capabilities within real systems — contributing to projects, supporting others, and becoming part of a growing network.",
  },
];

const hubs = [
  {
    title: "Energy Systems",
    body: "Focused on the development and deployment of scalable energy solutions.",
    badge: (
      <SectorBadge className="bg-sector-energy text-text-on-light">
        Energy Systems
      </SectorBadge>
    ),
  },
  {
    title: "Manufacturing & Industrial Systems",
    body: "Environments where ideas translate into physical output through applied engineering and production.",
    badge: (
      <SectorBadge className="bg-sector-manufacturing text-text-on-light">
        Manufacturing
      </SectorBadge>
    ),
  },
  {
    title: "Digital Infrastructure",
    body: "Systems that enable coordination, data, and technology development across the ecosystem.",
    badge: (
      <SectorBadge className="bg-surface-elevated text-sector-digital">
        Digital Infrastructure
      </SectorBadge>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface-secondary px-6 py-20">
        <Image
          src="/images/hero-bg-dark.png"
          alt="NIDC team working across systems and infrastructure"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
              Building Systems. Developing the People Who Run Them.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              NIDC is building a system that develops people and builds real
              systems at the same time, across Energy, Manufacturing, and
              Digital Infrastructure.
            </p>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              This goes beyond scholarships. It is a long-term system for
              building real capability and real-world impact. Development and
              execution are happening at the same time.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <PublicLinkButton href="/apply">
                Join the First Cohort
              </PublicLinkButton>
              <PublicLinkButton href="/programs" variant="secondary">
                Learn How It Works
              </PublicLinkButton>
            </div>
          </div>
          <div className="relative hidden min-h-96 overflow-hidden rounded-md border border-surface-elevated lg:block">
            <Image
              src="/images/solution_banner.png"
              alt="Applied development system environment"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Nigeria Has Talent. But No System."
          body="Across the country, capable individuals emerge every year yet many are unable to translate their ability into meaningful contribution. Not because they lack potential, but because there is no clear structure connecting talent to real-world systems. Talent is scattered. Opportunity is disconnected. The result is a country rich in potential, yet limited in coordinated capacity and output."
        />
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <SectionHeader
          title="A System for Turning Potential Into Capability"
          body="NIDC is designed as a long-term system for developing people into areas that matter. We do not simply provide access or support. We build a structured pathway that connects growth to real-world contribution. This is not about participation. It is about becoming capable — and applying that capability where it creates impact."
        />
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader title="How the System Works" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.title}
              className="rounded-md border border-surface-elevated bg-surface-secondary p-6"
            >
              <p className="text-sm font-medium text-text-accent">
                {step.label}
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-text-secondary">
          This is a system designed to connect individual growth to real-world
          impact.
        </p>
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader
          title="From Talent to Real-World Systems"
          body="NIDC operates as an interconnected system — where talent is not only developed, but supported, integrated, and deployed into environments where real work happens."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <h3 className="font-heading text-2xl font-bold text-text-primary">
              Applied Development Hubs
            </h3>
            <p className="mt-5 max-w-4xl text-base leading-relaxed text-text-secondary">
              We are building structured environments that bridge the gap
              between learning and real-world contribution. These are not
              future plans. They are environments being developed progressively
              in parallel with the growth of talent.
            </p>
          </div>
          {hubs.map((hub) => (
            <FeatureCard
              key={hub.title}
              title={hub.title}
              body={hub.body}
              badge={hub.badge}
            />
          ))}
        </div>
        <p className="mt-10 max-w-4xl text-base leading-relaxed text-text-secondary">
          These hubs operate as part of a coordinated system — where talent,
          infrastructure, and real-world challenges intersect.
        </p>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Building the People Who Will Build Nigeria"
          body="Long-term development requires more than resources — it requires coordinated human capacity. This system exists to ensure that individuals are not just trained, but positioned where their skills can create real impact. The goal is not just personal success, but meaningful contribution at scale."
        />
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <SectionHeader
          title="Built for Transparency and Long-Term Impact"
          body="NIDC is being established as a Company Limited by Guarantee, ensuring strong governance, accountability, and sustainability. The system is designed to operate with clarity, clear processes, accountability and long-term stability."
        />
      </PublicSection>

      <PublicSection className="bg-brand-charcoal">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            title="Be Part of What We're Building"
            body="If you are serious about developing yourself and contributing to something meaningful, there is a place for you in this system."
          />
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <PublicLinkButton href="/apply">
              Join the First Cohort
            </PublicLinkButton>
            <PublicLinkButton href="/programs" variant="secondary">
              Learn How It Works
            </PublicLinkButton>
          </div>
        </div>
      </PublicSection>
    </>
  );
}
