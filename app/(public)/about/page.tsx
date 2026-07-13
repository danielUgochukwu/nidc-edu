import Image from "next/image";
import {
  FeatureCard,
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "About — NIDC",
  description:
    "NIDC is a structured system designed to move individuals from potential to real capability.",
};

const problemItems = [
  {
    title: "Direction",
    body: "Clear structure for growth and movement into contribution.",
  },
  {
    title: "Access",
    body: "Connection to the environments where capability becomes useful.",
  },
  {
    title: "Consistent support",
    body: "Ongoing development instead of fragmented encouragement.",
  },
];

const governanceItems = [
  {
    title: "Directors",
    body: "Responsible for oversight and direction",
  },
  {
    title: "Core Team",
    body: "Handles operations and coordination",
  },
  {
    title: "Advisors",
    body: "Provide strategic guidance",
  },
];

export default function AboutPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
              Why This Exists
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              Nigeria is not short of capable people. What is missing is
              structure — a system that helps individuals grow, become capable,
              and contribute to real-world systems.
            </p>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-md border border-surface-elevated">
            <Image
              src="/images/nidc1.jpeg"
              alt="NIDC development environment"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="The Problem"
          body="Many individuals have potential but lack Direction, Access, and Consistent support. As a result, growth is unstructured, and capability is never fully developed."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problemItems.map((item) => (
            <FeatureCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <SectionHeader
          title="What This Is"
          body="NIDC is a structured system designed to move individuals from potential to real capability. Not just through learning — but through continuous development, application, and contribution."
        />
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="How It Thinks"
          body="The focus is not just education. The focus is Outcome. Developing individuals who can Learn effectively, Apply what they learn, Contribute to real systems."
        />
      </PublicSection>

      <PublicSection className="bg-surface-elevated">
        <SectionHeader
          title="What Makes It Different"
          body="This is not built for mass participation. It is designed for individuals who are willing to take responsibility for their growth and commit to a structured process."
        />
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Long-Term Vision"
          body="To build a system where individuals are continuously developed, connected, and positioned to contribute over time."
        />
      </PublicSection>

      <PublicSection id="governance" className="bg-surface-secondary">
        <SectionHeader title="Governance & Transparency" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {governanceItems.map((item) => (
            <FeatureCard key={item.title} title={item.title} body={item.body} />
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <FeatureCard
            title="Use of Funds"
            body="Allocated toward program development, participant support, and operations"
          />
          <FeatureCard
            title="Legal Structure"
            body="Structured as a non-profit entity to ensure accountability and continuity"
          />
        </div>
        <p className="mt-10 max-w-3xl text-base leading-relaxed text-text-secondary">
          Built for long-term sustainability, not short-term activity
        </p>
      </PublicSection>
    </>
  );
}
