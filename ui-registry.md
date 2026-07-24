# UI Registry

### Public Navigation

File: components/public/PublicNav.tsx
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-secondary` |
| Border           | `border-b border-surface-elevated` |
| Border radius    | `rounded-sm` on mobile menu button, `rounded-md` on CTA |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `min-h-16 px-6 gap-8` |
| Hover state      | `hover:text-text-primary`, `hover:bg-brand-green` |
| Shadow           | none |
| Accent usage     | Official `/images/logo.png`, `bg-brand-lime` |

**Pattern notes:**
Public navigation uses the dark secondary surface, the official NIDC logo asset, muted nav links, and one lime CTA. Mobile expands into a full-width dropdown on the same surface.

### Public Footer

File: components/public/PublicFooter.tsx
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-secondary` |
| Border           | `border-t border-surface-elevated` |
| Border radius    | none |
| Text — primary   | `text-text-primary`, `text-text-accent` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `px-6 py-12 gap-10` |
| Hover state      | `hover:text-text-primary`, `hover:text-brand-lime` |
| Shadow           | none |
| Accent usage     | Official `/images/logo.png`, `text-text-accent` for email |

**Pattern notes:**
Footer uses the official NIDC logo asset, heading type for column labels, and muted links until hover. Keep footer content on `max-w-7xl`.

### Public Buttons

File: components/public/PublicLinkButton.tsx
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-brand-lime`, `bg-transparent` |
| Border           | `border border-brand-lime` for secondary |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-on-light`, `text-brand-lime` |
| Text — secondary | none |
| Spacing          | `min-h-11 px-6 py-3` |
| Hover state      | `hover:bg-brand-green`, `hover:bg-surface-elevated` |
| Shadow           | none |
| Accent usage     | Primary action always uses `bg-brand-lime` |

**Pattern notes:**
Primary public CTAs are lime with charcoal text. Secondary CTAs are transparent with lime border/text and elevated-surface hover.

### Public Cards

File: components/public/PublicSection.tsx
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-secondary` |
| Border           | `border border-surface-elevated` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-6 gap-6` |
| Hover state      | none |
| Shadow           | `shadow-card` |
| Accent usage     | Optional sector/status badge before title |

**Pattern notes:**
Public cards are flat, compact, and repeatable. Use `rounded-md`; do not nest cards inside cards.

### Public Forms And Accordions

File: components/public/ContactForm.tsx, components/public/FAQAccordion.tsx
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-primary`, `bg-surface-secondary` |
| Border           | `border border-surface-elevated`, active `border-brand-lime` |
| Border radius    | `rounded-sm` inputs, `rounded-md` panels |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `gap-5`, `p-5`, `p-6` |
| Hover state      | `hover:bg-brand-green` on submit |
| Shadow           | none |
| Accent usage     | `focus:ring-brand-lime`, active FAQ `border-brand-lime` |

**Pattern notes:**
Public form controls use dark filled inputs with elevated borders and lime focus rings. FAQ active state is signaled by border color and an expanded answer, not color alone.

### Applicant Application Form

File: components/forms/ApplicationForm.tsx
Last updated: 2026-07-17

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-primary`, panels `bg-surface-secondary` |
| Border           | `border border-surface-elevated`, active review `border-brand-lime` |
| Border radius    | `rounded-sm` inputs/options, `rounded-md` panels/buttons |
| Text — primary   | `text-text-primary`, `text-text-on-light` on lime buttons |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-6`, `gap-5`, `gap-6`, `mt-8` |
| Hover state      | `hover:bg-brand-green`, `hover:bg-surface-elevated` |
| Shadow           | `shadow-card` |
| Accent usage     | `bg-brand-lime`, `text-text-accent`, `focus:ring-brand-lime` |

**Pattern notes:**
Applicant forms use dark filled controls on a secondary surface, with lime reserved for the active step, primary action, and final review border. Repeated assessment options are bordered rows rather than nested cards.

### Applicant Dashboard Cards

File: app/(dashboard)/applicant/page.tsx
Last updated: 2026-07-17

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-primary`, cards `bg-surface-secondary` |
| Border           | `border border-surface-elevated`, success `border-brand-lime` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-text-primary`, `text-text-on-light` on CTA |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-6`, `gap-6`, `mt-6` |
| Hover state      | `hover:bg-brand-green` |
| Shadow           | `shadow-card` |
| Accent usage     | `text-text-accent`, `bg-brand-lime` for CTA |

**Pattern notes:**
Dashboard status cards follow the existing dark dashboard shell. The primary CTA remains lime, while progress and notification details sit on `bg-surface-primary` inserts separated by elevated borders.
