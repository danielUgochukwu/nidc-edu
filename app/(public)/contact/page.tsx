import ContactForm from "@/components/public/ContactForm";
import {
  PublicSection,
  SectionHeader,
} from "@/components/public/PublicSection";

export const metadata = {
  title: "Contact — NIDC",
  description: "Get in touch with the NIDC Foundation.",
};

export default function ContactPage() {
  return (
    <>
      <PublicSection className="bg-surface-secondary">
        <SectionHeader
          title="Get In Touch"
          body="For partnerships, institutional support, and general inquiries."
        />
      </PublicSection>

      <PublicSection className="bg-surface-primary">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              Contact Details
            </h2>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              Partnership and institutional inquiries:
            </p>
            <a
              href="mailto:partnerships@nidcfoundation.org"
              className="mt-4 inline-flex text-base font-medium text-text-accent hover:text-brand-lime"
            >
              partnerships@nidcfoundation.org
            </a>
          </div>

          <div className="rounded-md border border-surface-elevated bg-surface-secondary p-6">
            <h2 className="font-heading text-2xl font-bold text-text-primary">
              Contact Form
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </PublicSection>
    </>
  );
}
