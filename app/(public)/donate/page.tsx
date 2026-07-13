import PublicLinkButton from "@/components/public/PublicLinkButton";
import {
  FeatureCard,
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Support NIDC — Capacity Building for Nigeria",
  description:
    "Your support enables the development of talent, infrastructure, and systems required for Nigeria's long-term industrial growth.",
};

const allocationItems = [
  {
    title: "Programs 40–50%",
    body: "Talent development, training, and capacity-building initiatives.",
    width: "w-1/2",
  },
  {
    title: "Infrastructure 20–30%",
    body: "Development of hubs, equipment, and project environments.",
    width: "w-1/3",
  },
  {
    title: "Operations 20–30%",
    body: "Organizational systems and administrative support.",
    width: "w-1/3",
  },
  {
    title: "Reserves 5–10%",
    body: "Stability and long-term continuity.",
    width: "w-1/12",
  },
];

const supportEnables = [
  "Development of energy and manufacturing hubs",
  "Training and reintegration of skilled talent",
  "Execution of industrial and innovation projects",
  "Expansion of national capacity infrastructure",
];

const fundingSources = [
  {
    title: "Individual Support",
    body: "Contributions from individuals who believe in building Nigeria's future capacity.",
  },
  {
    title: "Institutional Partnerships",
    body: "Grants and funding from organizations aligned with long-term development.",
  },
  {
    title: "Operational Revenue",
    body: "Income generated through projects and activities within our hubs, including energy, manufacturing, and digital infrastructure.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <div className="max-w-4xl">
          <h1 className="font-heading text-5xl font-bold leading-tight text-text-primary">
            Support the System
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Your support enables the development of talent, infrastructure, and
            systems required for Nigeria&apos;s long-term industrial growth.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <PublicLinkButton href="#how-to-support">
              Support Now
            </PublicLinkButton>
            <PublicLinkButton href="/contact" variant="secondary">
              Partner With Us
            </PublicLinkButton>
          </div>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="This Is Not Charity. It Is Capacity Building."
          body="The NIDC Foundation is not designed as a short-term intervention. It is a structured system focused on developing and deploying high-impact talent into critical sectors such as energy, manufacturing, and digital infrastructure. Your support contributes directly to building the human and physical systems required for national development."
        />
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader
          title="A Structured Allocation Model"
          body="All contributions are allocated through a defined internal framework to ensure impact, efficiency and sustainability."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {allocationItems.map((item) => (
            <article
              key={item.title}
              className="rounded-md border border-surface-elevated bg-surface-primary p-6"
            >
              <h3 className="font-heading text-xl font-semibold text-text-primary">
                {item.title}
              </h3>
              <div className="mt-5 h-3 rounded-full bg-surface-elevated">
                <div className={`h-3 rounded-full bg-brand-lime ${item.width}`} />
              </div>
              <p className="mt-5 text-base leading-relaxed text-text-secondary">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader title="Where It Goes" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {supportEnables.map((item) => (
            <FeatureCard key={item} title={item} body={item} />
          ))}
        </div>
      </PublicSection>

      <PublicSection id="how-to-support" className="bg-surface-secondary">
        <SectionHeader title="Ways to Contribute" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <FeatureCard
            title="Bank Transfer"
            body="You can support directly via bank transfer. Account details will be provided upon full incorporation."
            badge={
              <span className="inline-flex rounded-full bg-status-warning px-3 py-2 text-xs font-medium uppercase text-text-on-light">
                Coming soon
              </span>
            }
          />
          <FeatureCard
            title="Online Contribution"
            body="Secure online payments will be available via our payment platform."
            badge={
              <span className="inline-flex rounded-full bg-status-warning px-3 py-2 text-xs font-medium uppercase text-text-on-light">
                Coming soon
              </span>
            }
          />
          <article className="rounded-md border border-surface-elevated bg-surface-primary p-6">
            <h3 className="font-heading text-xl font-semibold text-text-primary">
              Institutional Support
            </h3>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              For partnerships, grants, and structured funding.
            </p>
            <a
              href="mailto:partnerships@nidcfoundation.org"
              className="mt-5 inline-flex text-sm font-medium text-text-accent hover:text-brand-lime"
            >
              partnerships@nidcfoundation.org
            </a>
          </article>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Built for Trust"
          body="The NIDC Foundation operates under a structured governance framework and is registered as a Company Limited by Guarantee. All funds are used solely to advance the objectives of the Foundation. Financial activities are recorded and managed in alignment with institutional standards."
        />
      </PublicSection>

      <PublicSection className="bg-brand-charcoal">
        <SectionHeader
          title="Be Part of the System"
          body="This is an opportunity to contribute to something larger than individual success. It is about building the systems that enable national progress."
        />
      </PublicSection>

      <PublicSection className="bg-surface-secondary">
        <SectionHeader title="How the System is Funded" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {fundingSources.map((source) => (
            <FeatureCard
              key={source.title}
              title={source.title}
              body={source.body}
            />
          ))}
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <p className="max-w-4xl text-base leading-relaxed text-text-secondary">
          Unlike traditional models, the NIDC system is designed for continuity.
          Projects within our hubs are structured to generate value and, where
          applicable, revenue that is reintegrated into the system. This enables
          long-term operation beyond donations alone.
        </p>
      </PublicSection>
    </>
  );
}
