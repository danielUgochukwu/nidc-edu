"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/sectors", label: "Sectors" },
  { href: "/apply", label: "Apply" },
  { href: "/donate", label: "Donate" },
];

const navLinkClasses =
  "text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime";

export default function PublicNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-elevated bg-surface-secondary">
      <nav
        className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6"
        aria-label="Primary navigation"
      >
        <Link href="/" aria-label="NIDC home" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="NIDC Foundation"
            width={180}
            height={120}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClasses}>
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/apply"
          className="hidden min-h-11 items-center rounded-md bg-brand-lime px-5 py-3 text-sm font-medium text-text-on-light transition-colors hover:bg-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime md:inline-flex"
        >
          Join the First Cohort
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-sm border border-surface-elevated text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="block h-0.5 w-5 bg-text-primary" />
          <span className="block h-0.5 w-5 bg-text-primary" />
          <span className="block h-0.5 w-5 bg-text-primary" />
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-surface-elevated bg-surface-secondary px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-lime px-5 py-3 text-sm font-medium text-text-on-light"
              onClick={() => setIsOpen(false)}
            >
              Join the First Cohort
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
