import FAQAccordion, { FAQItem } from "@/components/public/FAQAccordion";
import {
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "FAQs — NIDC",
  description: "Frequently asked questions about NIDC and how the system works.",
};

const candidateFaqs: FAQItem[] = [
  {
    question: "What is NIDC?",
    answer:
      "NIDC is a structured talent development system that identifies, develops, and deploys capable Nigerians into Energy, Manufacturing & Industrial Systems, and Digital Infrastructure. It is not a scholarship or a one-off program — it is a long-term system.",
  },
  {
    question: "Who can apply?",
    answer:
      "Anyone who is serious about developing themselves and contributing to real-world systems. We evaluate seriousness, discipline, and long-term intent — not perfect qualifications.",
  },
  {
    question: "Do I need academic qualifications to apply?",
    answer:
      "No. Supporting documents such as academic records are not required at the application stage. They are only requested from shortlisted applicants.",
  },
  {
    question: "How long does the program last?",
    answer:
      "NIDC is a long-term system. Development timelines vary depending on your starting point and the pathway you enter. This is not a short course.",
  },
  {
    question: "What sectors can I develop into?",
    answer:
      "Energy Systems, Manufacturing & Industrial Systems, and Digital Infrastructure.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "Applications are reviewed by the screening team. Shortlisted applicants are contacted for an interview. Selected individuals are integrated into a structured development pathway.",
  },
  {
    question: "Is this free?",
    answer:
      "Details on participation costs and support structures will be communicated to shortlisted candidates.",
  },
];

const partnerFaqs: FAQItem[] = [
  {
    question: "How is NIDC funded?",
    answer:
      "Through individual contributions, institutional grants, and operational revenue from NIDC hubs.",
  },
  {
    question: "How are funds allocated?",
    answer:
      "Programs (40–50%), Infrastructure (20–30%), Operations (20–30%), Reserves (5–10%).",
  },
  {
    question: "Is NIDC a registered organisation?",
    answer:
      "NIDC is being established as a Company Limited by Guarantee, ensuring strong governance, accountability, and sustainability.",
  },
  {
    question: "How can I partner with NIDC?",
    answer:
      "Contact us at partnerships@nidcfoundation.org or visit the Contact page.",
  },
];

export default function FAQsPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <SectionHeader
          title="FAQs"
          body="Frequently asked questions about NIDC and how the system works."
        />
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              For Candidates
            </h2>
            <div className="mt-6">
              <FAQAccordion items={candidateFaqs} />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              For Donors and Partners
            </h2>
            <div className="mt-6">
              <FAQAccordion items={partnerFaqs} />
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  );
}
