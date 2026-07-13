import Link from "next/link";
import Image from "next/image";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/programs", label: "Programs" },
      { href: "/sectors", label: "Sectors" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { href: "/apply", label: "Apply" },
      { href: "/donate", label: "Donate" },
      { href: "/contact", label: "Partner" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/faqs", label: "FAQs" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ href: "/about#governance", label: "Governance" }],
  },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-surface-elevated bg-surface-secondary px-6 py-12 text-text-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="NIDC home">
            <Image
              src="/images/logo.png"
              alt="NIDC Foundation"
              width={240}
              height={160}
              className="h-20 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 max-w-sm text-base leading-relaxed">
            Building Systems. Developing the People Who Run Them.
          </p>
          <a
            href="mailto:partnerships@nidcfoundation.org"
            className="mt-6 inline-flex text-sm font-medium text-text-accent hover:text-brand-lime"
          >
            partnerships@nidcfoundation.org
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="font-heading text-base font-semibold text-text-primary">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-surface-elevated pt-6">
        <p className="text-sm">© NIDC Foundation. All rights reserved.</p>
      </div>
    </footer>
  );
}
