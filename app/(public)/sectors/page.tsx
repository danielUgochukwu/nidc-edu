import Image from "next/image";
import {
  PublicSection,
  SectionHeader,
  SectorBadge,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Sectors — NIDC",
  description:
    "NIDC deploys talent into Energy Systems, Manufacturing & Industrial Systems, and Digital Infrastructure.",
};

const sectors = [
  {
    title: "Energy Systems",
    image: "/images/energy.png",
    badgeClass: "bg-sector-energy text-text-on-light",
    focus: "Industrialization & Energy Reform",
    body: "Focused on the development and deployment of scalable energy solutions. Participants in this sector are developed to engage with real energy infrastructure — understanding, building, and improving the systems that power communities and industries.",
  },
  {
    title: "Manufacturing & Industrial Systems",
    image: "/images/high-tech.png",
    badgeClass: "bg-sector-manufacturing text-text-on-light",
    focus: "Industrialization",
    body: "Environments where ideas translate into physical output through applied engineering and production. This sector is about turning capability into things that exist in the real world — built, manufactured, deployed.",
  },
  {
    title: "Digital Infrastructure",
    image: "/images/digital-hub.png",
    badgeClass: "bg-surface-elevated text-sector-digital",
    focus: "Digitalization",
    body: "Systems that enable coordination, data, and technology development across the ecosystem. Digital Infrastructure participants build the connective tissue that makes modern systems function — from platforms to data pipelines to operational tooling.",
  },
];

export default function SectorsPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <SectionHeader
          title="Strategic Focus Areas"
          body="NIDC develops and deploys talent into three critical sectors. These are not theoretical domains — they are environments being actively built, where individuals will contribute to real systems."
        />
      </PublicSection>

      {sectors.map((sector, index) => (
        <PublicSection
          key={sector.title}
          className={index % 2 === 0 ? "bg-surface-primary" : "bg-surface-secondary"}
        >
          <article className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className={index % 2 === 0 ? "" : "lg:order-2"}>
              <SectorBadge className={sector.badgeClass}>
                {sector.title}
              </SectorBadge>
              <p className="mt-6 text-sm font-medium uppercase text-text-accent">
                {sector.focus}
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-text-primary">
                {sector.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-text-secondary">
                {sector.body}
              </p>
            </div>
            <div className="relative min-h-80 overflow-hidden rounded-md border border-surface-elevated">
              <Image
                src={sector.image}
                alt={`${sector.title} development environment`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </article>
        </PublicSection>
      ))}

      <PublicSection className="bg-surface-elevated">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionHeader
            title="Advanced Materials (Future Expansion)"
            body="Exploratory environments focused on next-generation industrial capabilities. This area is not yet open for participant entry — it represents the next phase of NIDC's sector development."
          />
          <div className="relative min-h-72 overflow-hidden rounded-md border border-surface-secondary">
            <Image
              src="/images/advance-material.png"
              alt="Advanced materials future expansion"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <SectionHeader
          title="Why These Sectors"
          body="These three areas represent the structural foundation of any industrialising nation. Energy powers everything. Manufacturing turns knowledge into output. Digital infrastructure enables coordination at scale. NIDC focuses here because this is where coordinated human capacity creates the most measurable, lasting impact."
        />
      </PublicSection>
    </>
  );
}
