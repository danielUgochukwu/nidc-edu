"use client";

import { FormEvent, useState } from "react";

const subjects = [
  "General Inquiry",
  "Partnership",
  "Institutional Funding",
  "Media",
  "Other",
] as const;

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitState(response.ok ? "success" : "error");
      if (response.ok) event.currentTarget.reset();
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <label className="grid gap-2 text-sm font-medium text-text-secondary">
        Full Name
        <input
          name="name"
          required
          className="min-h-11 rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-base text-text-primary focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-text-secondary">
        Email Address
        <input
          name="email"
          type="email"
          required
          className="min-h-11 rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-base text-text-primary focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-text-secondary">
        Subject
        <select
          name="subject"
          required
          className="min-h-11 rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-base text-text-primary focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime"
        >
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-text-secondary">
        Message
        <textarea
          name="message"
          required
          minLength={10}
          rows={6}
          className="rounded-sm border border-surface-elevated bg-surface-primary px-4 py-3 text-base text-text-primary focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime"
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="min-h-11 rounded-md bg-brand-lime px-6 py-3 text-sm font-medium text-text-on-light transition-colors hover:bg-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime disabled:bg-surface-elevated disabled:text-text-secondary"
      >
        {submitState === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {submitState === "success" ? (
        <p className="rounded-md bg-status-success p-4 text-sm font-medium text-text-on-light">
          Your message has been received. We will respond within 3–5 business
          days.
        </p>
      ) : null}

      {submitState === "error" ? (
        <p className="rounded-md bg-status-rejected p-4 text-sm font-medium text-text-primary">
          Something went wrong. Please email us directly at
          partnerships@nidcfoundation.org
        </p>
      ) : null}
    </form>
  );
}
