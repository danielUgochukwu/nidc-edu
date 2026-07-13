"use client";

import { useState } from "react";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className={`rounded-md border bg-surface-secondary p-5 ${
              isOpen ? "border-brand-lime" : "border-surface-elevated"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-heading text-lg font-semibold text-text-primary">
                {item.question}
              </span>
              <span className="text-xl text-text-accent" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                {item.answer}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
