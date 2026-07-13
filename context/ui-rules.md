# NIDC UI Context
> Visual language specification for the Nigeria Innovation Community Foundation platform.
> This file is the single source of truth for all design decisions.
> **An AI agent must never invent a color, spacing value, or type style not defined here.**

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Sizing](#4-spacing--sizing)
5. [Border Radius Scale](#5-border-radius-scale)
6. [Shadow & Elevation](#6-shadow--elevation)
7. [Component Library Conventions](#7-component-library-conventions)
8. [Layout Patterns](#8-layout-patterns)
9. [Icon Usage](#9-icon-usage)
10. [Motion & Animation](#10-motion--animation)
11. [Accessibility Baseline](#11-accessibility-baseline)

---

## 1. Design Philosophy

NIDC manages the full journey of a human life — from discovery to deployment. The interface must honour that weight without becoming cold. Two principles govern every decision:

- **Structured warmth.** Dense information (pipeline stages, donor records, grant tables) is organized with precision. But the candidate-facing surfaces breathe — generous padding, friendly radius, readable type.
- **Earned hierarchy.** Lime `brand-lime` is the most energetic color in the system. It earns its place on primary actions only. Everything else steps back. No competing accents on the same surface.

Dark and light modes are first-class citizens. Every token has a counterpart for both.

---

## 2. Color Tokens

### 2.1 Raw Palette (Never use these directly in components — always use semantic tokens)

| Palette Name | Hex | Description |
|---|---|---|
| `palette-lime` | `#C6F20A` | Brand primary — electric, energetic |
| `palette-green` | `#7CC943` | Brand secondary — growth, success |
| `palette-mint` | `#E6FFB8` | Brand tint — lightest green, backgrounds |
| `palette-amber` | `#FF9A1A` | Brand accent — energy, urgency, warmth |
| `palette-charcoal` | `#1F2937` | Brand dark — primary dark surface |
| `palette-white` | `#FFFFFF` | Base white |
| `palette-black` | `#111827` | Deepest dark surface |
| `palette-gray-50` | `#F9FAFB` | Near-white surface |
| `palette-gray-100` | `#F3F4F6` | Subtle surface |
| `palette-gray-200` | `#E5E7EB` | Dividers, borders |
| `palette-gray-300` | `#D1D5DB` | Muted borders |
| `palette-gray-400` | `#9CA3AF` | Placeholder text |
| `palette-gray-500` | `#6B7280` | Muted text |
| `palette-gray-600` | `#4B5563` | Secondary text |
| `palette-gray-700` | `#374151` | Dark mode borders |
| `palette-gray-800` | `#1F2937` | Dark mode surface (same as charcoal) |
| `palette-gray-900` | `#111827` | Dark mode base |
| `palette-lime-dark` | `#B0D909` | Lime hover state |
| `palette-lime-deeper` | `#96BB08` | Lime active/pressed |
| `palette-lime-muted` | `#D4F53D` | Lime on dark surface |
| `palette-green-dark` | `#69B036` | Green hover |
| `palette-green-deeper` | `#57932D` | Green active/pressed |
| `palette-green-muted` | `#A8D97A` | Subtle green tint text |
| `palette-amber-dark` | `#E8870A` | Amber hover |
| `palette-amber-light` | `#FFF3E0` | Amber background tint |
| `palette-red` | `#EF4444` | Destructive / error |
| `palette-red-dark` | `#DC2626` | Destructive hover |
| `palette-red-light` | `#FEF2F2` | Error background tint |
| `palette-blue` | `#3B82F6` | Info / discovery stage |
| `palette-blue-light` | `#EFF6FF` | Info background tint |
| `palette-purple` | `#8B5CF6` | Screening stage |
| `palette-indigo` | `#6366F1` | Manufacturing sector |
| `palette-cyan` | `#06B6D4` | Digital sector |
| `palette-emerald` | `#059669` | Deployment / final stage |

---

### 2.2 Semantic Tokens — Light Mode

#### Backgrounds

| Token | Maps To | Usage |
|---|---|---|
| `color-bg-base` | `palette-white` | Page background |
| `color-bg-subtle` | `palette-gray-50` | Secondary page sections |
| `color-bg-muted` | `palette-gray-100` | Input fills, muted panels |
| `color-bg-tint` | `palette-mint` | Brand-tinted card backgrounds |
| `color-bg-inverse` | `palette-charcoal` | Inverted panels, dark nav |
| `color-bg-overlay` | `palette-black` at 50% opacity | Modal backdrop |

#### Text

| Token | Maps To | Usage |
|---|---|---|
| `color-text-primary` | `palette-charcoal` | All primary body and heading text |
| `color-text-secondary` | `palette-gray-600` | Supporting text, subtitles |
| `color-text-muted` | `palette-gray-400` | Placeholders, disabled labels |
| `color-text-inverse` | `palette-white` | Text on dark surfaces |
| `color-text-brand` | `palette-green-dark` | Brand-colored inline text, links |
| `color-text-link` | `palette-green-dark` | Inline hyperlinks |
| `color-text-link-hover` | `palette-green-deeper` | Link hover state |
| `color-text-danger` | `palette-red` | Error messages, destructive labels |
| `color-text-warning` | `palette-amber-dark` | Warning messages |
| `color-text-success` | `palette-green-dark` | Success messages |
| `color-text-info` | `palette-blue` | Informational messages |

#### Borders

| Token | Maps To | Usage |
|---|---|---|
| `color-border-default` | `palette-gray-200` | Default inputs, cards |
| `color-border-subtle` | `palette-gray-100` | Dividers, table lines |
| `color-border-strong` | `palette-gray-300` | Emphasized border |
| `color-border-brand` | `palette-green` | Active inputs, focused elements |
| `color-border-focus` | `palette-lime` | Keyboard focus ring |
| `color-border-danger` | `palette-red` | Error state inputs |
| `color-border-warning` | `palette-amber` | Warning state inputs |

#### Actions

| Token | Maps To | Usage |
|---|---|---|
| `color-action-primary-bg` | `palette-lime` | Primary button background |
| `color-action-primary-bg-hover` | `palette-lime-dark` | Primary button hover |
| `color-action-primary-bg-active` | `palette-lime-deeper` | Primary button pressed |
| `color-action-primary-text` | `palette-charcoal` | Text on primary button |
| `color-action-secondary-bg` | `palette-white` | Secondary button background |
| `color-action-secondary-bg-hover` | `palette-mint` | Secondary button hover |
| `color-action-secondary-border` | `palette-green` | Secondary button border |
| `color-action-secondary-text` | `palette-green-dark` | Secondary button text |
| `color-action-ghost-bg` | `transparent` | Ghost button background |
| `color-action-ghost-bg-hover` | `palette-mint` | Ghost button hover |
| `color-action-ghost-text` | `palette-charcoal` | Ghost button text |
| `color-action-destructive-bg` | `palette-red` | Destructive button background |
| `color-action-destructive-bg-hover` | `palette-red-dark` | Destructive button hover |
| `color-action-destructive-text` | `palette-white` | Text on destructive button |
| `color-action-disabled-bg` | `palette-gray-100` | Disabled button background |
| `color-action-disabled-text` | `palette-gray-400` | Disabled button text |
| `color-action-disabled-border` | `palette-gray-200` | Disabled button border |

---

### 2.3 Semantic Tokens — Dark Mode

#### Backgrounds

| Token | Maps To | Usage |
|---|---|---|
| `color-bg-base-dark` | `palette-black` | Page background |
| `color-bg-subtle-dark` | `palette-charcoal` | Cards, panels |
| `color-bg-muted-dark` | `palette-gray-700` | Input fills, nested panels |
| `color-bg-tint-dark` | `palette-charcoal` with lime border | Brand-tinted card in dark |
| `color-bg-inverse-dark` | `palette-white` | Inverted panels in dark mode |

#### Text (Dark Mode)

| Token | Maps To | Usage |
|---|---|---|
| `color-text-primary-dark` | `palette-gray-50` | Primary text |
| `color-text-secondary-dark` | `palette-gray-300` | Supporting text |
| `color-text-muted-dark` | `palette-gray-500` | Placeholders |
| `color-text-inverse-dark` | `palette-charcoal` | Text on light surfaces in dark mode |
| `color-text-brand-dark` | `palette-lime-muted` | Brand-colored text on dark |
| `color-text-link-dark` | `palette-lime-muted` | Links on dark backgrounds |
| `color-text-link-hover-dark` | `palette-lime` | Link hover on dark |

#### Borders (Dark Mode)

| Token | Maps To | Usage |
|---|---|---|
| `color-border-default-dark` | `palette-gray-700` | Default borders |
| `color-border-subtle-dark` | `palette-gray-800` | Subtle dividers |
| `color-border-strong-dark` | `palette-gray-600` | Emphasized borders |
| `color-border-brand-dark` | `palette-lime` | Active / focused borders — lime pops on dark |
| `color-border-focus-dark` | `palette-lime` | Keyboard focus ring on dark |
| `color-border-danger-dark` | `palette-red` | Error inputs in dark mode |

#### Actions (Dark Mode)

| Token | Maps To | Usage |
|---|---|---|
| `color-action-primary-bg-dark` | `palette-lime` | Primary button — lime on charcoal |
| `color-action-primary-bg-hover-dark` | `palette-lime-dark` | Primary hover |
| `color-action-primary-text-dark` | `palette-charcoal` | Dark text on lime |
| `color-action-secondary-bg-dark` | `palette-gray-700` | Secondary button bg |
| `color-action-secondary-bg-hover-dark` | `palette-gray-600` | Secondary hover |
| `color-action-secondary-border-dark` | `palette-green` | Secondary border |
| `color-action-secondary-text-dark` | `palette-green-muted` | Secondary text |
| `color-action-ghost-bg-hover-dark` | `palette-gray-700` | Ghost hover |
| `color-action-ghost-text-dark` | `palette-gray-50` | Ghost text |
| `color-action-disabled-bg-dark` | `palette-gray-800` | Disabled bg |
| `color-action-disabled-text-dark` | `palette-gray-600` | Disabled text |

---

### 2.4 Status & Feedback Tokens

| Token | Maps To | Usage |
|---|---|---|
| `color-status-success` | `palette-green` | Pass, approved, completed |
| `color-status-success-bg` | `palette-mint` | Success alert/badge background |
| `color-status-success-text` | `palette-green-dark` | Success text |
| `color-status-warning` | `palette-amber` | Pending, at-risk, review required |
| `color-status-warning-bg` | `palette-amber-light` | Warning background |
| `color-status-warning-text` | `palette-amber-dark` | Warning text |
| `color-status-error` | `palette-red` | Rejected, failed, critical |
| `color-status-error-bg` | `palette-red-light` | Error background |
| `color-status-error-text` | `palette-red` | Error text |
| `color-status-info` | `palette-blue` | Informational |
| `color-status-info-bg` | `palette-blue-light` | Info background |
| `color-status-info-text` | `palette-blue` | Info text |
| `color-status-neutral` | `palette-gray-500` | Draft, inactive, not started |
| `color-status-neutral-bg` | `palette-gray-100` | Neutral background |
| `color-status-neutral-text` | `palette-gray-600` | Neutral text |

---

### 2.5 Pipeline Stage Tokens

Used on candidate cards, timeline trackers, progress indicators, and filter chips.

| Token | Maps To | Stage |
|---|---|---|
| `color-stage-discovery` | `palette-blue` | Discovery & Application |
| `color-stage-discovery-bg` | `palette-blue-light` | Discovery background tint |
| `color-stage-screening` | `palette-purple` | Screening |
| `color-stage-screening-bg` | `#F5F3FF` | Screening background tint |
| `color-stage-assessment` | `palette-amber` | Assessment |
| `color-stage-assessment-bg` | `palette-amber-light` | Assessment background tint |
| `color-stage-selection` | `palette-lime` | Selection & Onboarding |
| `color-stage-selection-bg` | `palette-mint` | Selection background tint |
| `color-stage-selection-text` | `palette-charcoal` | Text on lime selection badge |
| `color-stage-development` | `palette-green` | Development |
| `color-stage-development-bg` | `palette-mint` | Development background tint |
| `color-stage-deployment` | `palette-emerald` | Deployment — final stage |
| `color-stage-deployment-bg` | `#ECFDF5` | Deployment background tint |

---

### 2.6 Sector Tokens

Used on tags, sidebar section headers, candidate profile badges, and filter pills.

| Token | Maps To | Sector |
|---|---|---|
| `color-sector-energy` | `palette-amber` | Energy |
| `color-sector-energy-bg` | `palette-amber-light` | Energy background tint |
| `color-sector-energy-text` | `palette-amber-dark` | Energy label text |
| `color-sector-manufacturing` | `palette-indigo` | Manufacturing & Industrial Systems |
| `color-sector-manufacturing-bg` | `#EEF2FF` | Manufacturing background tint |
| `color-sector-manufacturing-text` | `palette-indigo` | Manufacturing label text |
| `color-sector-digital` | `palette-cyan` | Digital Infrastructure |
| `color-sector-digital-bg` | `#ECFEFF` | Digital background tint |
| `color-sector-digital-text` | `#0E7490` | Digital label text (darkened for contrast) |

---

### 2.7 Track Tokens

Used to distinguish Educational Pathway from Direct Development Track on candidate cards.

| Token | Maps To | Track |
|---|---|---|
| `color-track-educational` | `palette-blue` | Educational Pathway track indicator |
| `color-track-educational-bg` | `palette-blue-light` | Educational track background |
| `color-track-direct` | `palette-green` | Direct Development track indicator |
| `color-track-direct-bg` | `palette-mint` | Direct track background |

---

### 2.8 Funding & Finance Tokens

Used in donor dashboards, grant tables, and financial reporting views.

| Token | Maps To | Usage |
|---|---|---|
| `color-fund-donor` | `palette-lime` | Local donor contributions |
| `color-fund-donor-bg` | `palette-mint` | Donor row/card tint |
| `color-fund-grant` | `palette-green` | Institutional grants |
| `color-fund-grant-bg` | `palette-mint` | Grant row/card tint |
| `color-fund-revenue` | `palette-amber` | Hub revenue |
| `color-fund-revenue-bg` | `palette-amber-light` | Revenue row/card tint |
| `color-fund-progress-track` | `palette-gray-200` | Progress bar background |
| `color-fund-progress-fill` | `palette-lime` | Progress bar fill |
| `color-fund-progress-fill-over` | `palette-green` | Progress bar — target exceeded |

---

### 2.9 Navigation Tokens

| Token | Maps To | Usage |
|---|---|---|
| `color-nav-bg` | `palette-charcoal` | Sidebar and top nav background |
| `color-nav-bg-hover` | `palette-gray-700` | Nav item hover |
| `color-nav-bg-active` | `palette-gray-800` | Nav item active / selected |
| `color-nav-accent` | `palette-lime` | Active nav item left border / indicator |
| `color-nav-text` | `palette-gray-300` | Default nav item text |
| `color-nav-text-active` | `palette-white` | Active nav item text |
| `color-nav-text-muted` | `palette-gray-500` | Section label text in nav |
| `color-nav-icon` | `palette-gray-400` | Default icon color in nav |
| `color-nav-icon-active` | `palette-lime` | Active icon color |
| `color-nav-divider` | `palette-gray-700` | Horizontal rule between nav sections |
| `color-nav-badge-bg` | `palette-lime` | Count badge on nav items |
| `color-nav-badge-text` | `palette-charcoal` | Count badge text |

---

## 3. Typography

### 3.1 Font Families

| Token | Value | Usage |
|---|---|---|
| `font-display` | `'Poppins', sans-serif` | All headings H1–H4, display text, section titles |
| `font-body` | `'Inter', sans-serif` | All body copy, labels, captions, UI text, tables |
| `font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | Candidate IDs, grant codes, reference numbers |

### 3.2 Type Scale

| Token | px | rem | Font | Usage |
|---|---|---|---|---|
| `text-xs` | 11px | 0.6875rem | Inter | Micro labels, timestamps, table footnotes |
| `text-sm` | 13px | 0.8125rem | Inter | Captions, helper text, secondary labels |
| `text-base` | 15px | 0.9375rem | Inter | Default body text |
| `text-md` | 16px | 1rem | Inter | Slightly emphasized body, form labels |
| `text-lg` | 18px | 1.125rem | Poppins | H4, card titles, section intros |
| `text-xl` | 20px | 1.25rem | Poppins | H3, modal titles |
| `text-2xl` | 24px | 1.5rem | Poppins | H2, panel headings |
| `text-3xl` | 30px | 1.875rem | Poppins | H1, page titles |
| `text-4xl` | 36px | 2.25rem | Poppins | Dashboard stat headlines |
| `text-5xl` | 48px | 3rem | Poppins | Hero / landing display only |

### 3.3 Font Weights

| Token | Value | Usage |
|---|---|---|
| `font-regular` | `400` | Body text, captions |
| `font-medium` | `500` | UI labels, button text, nav items |
| `font-semibold` | `600` | Subheadings, card titles, emphasis |
| `font-bold` | `700` | Page headings H1–H2, stat numbers |
| `font-extrabold` | `800` | Display headings, hero text only |

### 3.4 Line Heights

| Token | Value | Usage |
|---|---|---|
| `leading-tight` | `1.2` | Large headings |
| `leading-snug` | `1.4` | Card titles, subheadings |
| `leading-normal` | `1.6` | Body paragraphs |
| `leading-relaxed` | `1.75` | Candidate bios, long-form reading |

### 3.5 Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `tracking-tight` | `-0.02em` | Large display headings (H1, hero) |
| `tracking-normal` | `0em` | Body text |
| `tracking-wide` | `0.04em` | Uppercase section eyebrows |
| `tracking-wider` | `0.08em` | Badge labels, status pills in uppercase |

### 3.6 Typographic Conventions

- Headings (H1–H3): `font-display`, `font-bold` or `font-semibold`, `leading-tight`
- Card titles (H4): `font-display`, `font-semibold`, `leading-snug`
- Body paragraphs: `font-body`, `font-regular`, `leading-normal`, `text-base`
- Table cells: `font-body`, `font-regular`, `text-sm`, `font-variant-numeric: tabular-nums`
- Nav items: `font-body`, `font-medium`, `text-sm`
- Buttons: `font-body`, `font-medium`, `text-sm` or `text-md`
- Status pills / badges: `font-body`, `font-medium`, `text-xs`, `tracking-wider`, uppercase
- Section eyebrow labels: `font-body`, `font-medium`, `text-xs`, `tracking-wide`, uppercase, `color-text-muted`
- Reference codes (IDs, grant numbers): `font-mono`, `text-sm`

---

## 4. Spacing & Sizing

All spacing follows a 4px base grid.

| Token | px | rem | Usage |
|---|---|---|---|
| `space-0` | 0px | 0 | Reset |
| `space-1` | 4px | 0.25rem | Icon gap, micro nudge |
| `space-2` | 8px | 0.5rem | Tight padding, badge padding |
| `space-3` | 12px | 0.75rem | Icon button padding, compact list item |
| `space-4` | 16px | 1rem | Standard padding — input, button, card inner |
| `space-5` | 20px | 1.25rem | Slightly generous padding |
| `space-6` | 24px | 1.5rem | Section padding, card outer |
| `space-8` | 32px | 2rem | Panel padding, form sections |
| `space-10` | 40px | 2.5rem | Large section gaps |
| `space-12` | 48px | 3rem | Section vertical rhythm |
| `space-16` | 64px | 4rem | Page section separation |
| `space-20` | 80px | 5rem | Hero vertical padding |
| `space-24` | 96px | 6rem | Maximum vertical gap |

---

## 5. Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `radius-none` | `0px` | Table cells, data-dense rows, hard dividers |
| `radius-xs` | `2px` | Status pill borders, tight micro badges |
| `radius-sm` | `4px` | Input fields, small secondary buttons |
| `radius-md` | `8px` | Standard cards, modals, dropdowns, popovers |
| `radius-lg` | `12px` | Large cards, side panels, drawer containers |
| `radius-xl` | `16px` | Feature cards, onboarding panels |
| `radius-2xl` | `24px` | Dashboard widgets, primary stat cards |
| `radius-full` | `9999px` | Avatars, toggle switches, pill badges, progress bars |

---

## 6. Shadow & Elevation

| Token | Value | Usage |
|---|---|---|
| `shadow-none` | `none` | Flat elements, table rows |
| `shadow-xs` | `0 1px 2px rgba(31,41,55,0.06)` | Subtle lift on inputs |
| `shadow-sm` | `0 2px 8px rgba(31,41,55,0.08)` | Default card |
| `shadow-md` | `0 4px 16px rgba(31,41,55,0.10)` | Dropdown, popover |
| `shadow-lg` | `0 8px 32px rgba(31,41,55,0.14)` | Modal, drawer |
| `shadow-xl` | `0 16px 48px rgba(31,41,55,0.18)` | Full-screen dialog |
| `shadow-focus-light` | `0 0 0 3px rgba(124,201,67,0.30)` | Focus ring — light mode (green) |
| `shadow-focus-dark` | `0 0 0 3px rgba(198,242,10,0.40)` | Focus ring — dark mode (lime) |
| `shadow-focus-danger` | `0 0 0 3px rgba(239,68,68,0.30)` | Focus ring — error state |

For dark mode: reduce shadow opacity by ~30%. Cards on dark backgrounds rely more on `color-border-default-dark` than shadows.

---

## 7. Component Library Conventions

### 7.1 Buttons

Four variants. No new variants may be invented.

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `primary` | `color-action-primary-bg` | `color-action-primary-text` | none | One per view. Primary action only. |
| `secondary` | `color-action-secondary-bg` | `color-action-secondary-text` | `color-action-secondary-border` | Supporting actions alongside primary |
| `ghost` | `color-action-ghost-bg` | `color-action-ghost-text` | none | Low-emphasis actions, icon buttons |
| `destructive` | `color-action-destructive-bg` | `color-action-destructive-text` | none | Delete, reject, revoke — always requires confirmation |

**Sizes:**

| Size | Padding | Text Token | Radius |
|---|---|---|---|
| `sm` | `space-2` / `space-3` | `text-sm` | `radius-sm` |
| `md` | `space-3` / `space-4` | `text-md` | `radius-sm` |
| `lg` | `space-4` / `space-6` | `text-md` | `radius-md` |

**Rules:**
- Only one `primary` button per visible screen section.
- Disabled buttons use `color-action-disabled-bg` and `color-action-disabled-text`. Never reduce opacity on enabled buttons; use disabled tokens.
- Buttons always have a visible focus ring using `shadow-focus-light` or `shadow-focus-dark`.

---

### 7.2 Badges & Pills

Used for pipeline stages, sectors, tracks, and statuses.

| Element | Background | Text | Radius | Text Style |
|---|---|---|---|---|
| Stage badge | `color-stage-{stage}-bg` | Stage color (darkened) | `radius-full` | `text-xs`, `font-medium`, uppercase |
| Sector tag | `color-sector-{sector}-bg` | `color-sector-{sector}-text` | `radius-xs` | `text-xs`, `font-medium` |
| Track tag | `color-track-{track}-bg` | Track color (darkened) | `radius-xs` | `text-xs`, `font-medium` |
| Status badge | `color-status-{state}-bg` | `color-status-{state}-text` | `radius-full` | `text-xs`, `font-medium`, uppercase |
| Count badge | `color-nav-badge-bg` | `color-nav-badge-text` | `radius-full` | `text-xs`, `font-bold` |

---

### 7.3 Cards

| Element | Light | Dark |
|---|---|---|
| Background | `color-bg-base` | `color-bg-subtle-dark` |
| Border | `color-border-default` | `color-border-default-dark` |
| Radius | `radius-md` or `radius-lg` | same |
| Shadow | `shadow-sm` | `shadow-none` (rely on border) |
| Padding | `space-6` | same |

Candidate cards add a 3px left border in the track color (`color-track-educational` or `color-track-direct`) to signal pathway at a glance without requiring a label.

---

### 7.4 Form Inputs

| State | Background | Border | Text | Shadow |
|---|---|---|---|---|
| Default | `color-bg-muted` | `color-border-default` | `color-text-primary` | none |
| Focused | `color-bg-base` | `color-border-brand` | `color-text-primary` | `shadow-focus-light` |
| Error | `color-bg-base` | `color-border-danger` | `color-text-primary` | `shadow-focus-danger` |
| Disabled | `color-bg-muted` | `color-border-default` | `color-text-muted` | none |
| Dark default | `color-bg-muted-dark` | `color-border-default-dark` | `color-text-primary-dark` | none |
| Dark focused | `color-bg-subtle-dark` | `color-border-brand-dark` | `color-text-primary-dark` | `shadow-focus-dark` |

Radius: `radius-sm`. Height: `40px` (md), `32px` (sm). Label: `text-sm`, `font-medium`, `color-text-secondary`, above the input with `space-2` gap. Helper text: `text-sm`, `color-text-muted`. Error text: `text-sm`, `color-text-danger`.

---

### 7.5 Tables

Used in candidate lists, donor records, grant tracking, financial reports.

| Element | Value |
|---|---|
| Header bg | `color-bg-subtle` |
| Header text | `color-text-secondary`, `text-xs`, `font-medium`, uppercase, `tracking-wide` |
| Row bg (default) | `color-bg-base` |
| Row bg (hover) | `color-bg-subtle` |
| Row bg (selected) | `color-bg-tint` |
| Row border | `color-border-subtle` |
| Cell text | `color-text-primary`, `text-sm`, `font-regular` |
| Numeric cells | `font-mono`, `text-sm`, tabular nums, right-aligned |
| Radius | `radius-none` (table itself), `radius-md` on wrapping container |

---

### 7.6 Progress Bars

Used on pipeline tracking, funding targets, cohort completion.

| Element | Token |
|---|---|
| Track background | `color-fund-progress-track` |
| Fill (standard) | `color-fund-progress-fill` |
| Fill (exceeded) | `color-fund-progress-fill-over` |
| Track radius | `radius-full` |
| Height | 6px (compact), 10px (standard), 16px (featured) |

---

### 7.7 Alerts & Toasts

| State | Background | Left border | Text | Icon color |
|---|---|---|---|---|
| Success | `color-status-success-bg` | `color-status-success` | `color-status-success-text` | `color-status-success` |
| Warning | `color-status-warning-bg` | `color-status-warning` | `color-status-warning-text` | `color-status-warning` |
| Error | `color-status-error-bg` | `color-status-error` | `color-status-error-text` | `color-status-error` |
| Info | `color-status-info-bg` | `color-status-info` | `color-status-info-text` | `color-status-info` |

Radius: `radius-md`. Left border: 4px solid. Toasts appear bottom-right, stack upward, auto-dismiss after 5s (errors persist until dismissed).

---

### 7.8 Modals & Drawers

| Element | Value |
|---|---|
| Overlay | `color-bg-overlay` (50% opacity) |
| Modal bg | `color-bg-base` / `color-bg-subtle-dark` |
| Modal border | `color-border-default` / `color-border-default-dark` |
| Modal radius | `radius-lg` |
| Modal shadow | `shadow-xl` |
| Drawer bg | same as modal |
| Drawer shadow | `shadow-lg` |
| Max-width (modal) | 560px (sm), 720px (md), 960px (lg) |
| Drawer width | 420px (default), 600px (wide/form drawer) |

---

### 7.9 Avatars

| Size | px | Radius | Font |
|---|---|---|---|
| `xs` | 24px | `radius-full` | `text-xs` |
| `sm` | 32px | `radius-full` | `text-sm` |
| `md` | 40px | `radius-full` | `text-md` |
| `lg` | 56px | `radius-full` | `text-xl` |
| `xl` | 80px | `radius-full` | `text-2xl` |

Default avatar bg: `color-bg-tint`. Initials text: `color-text-brand`, `font-semibold`.

---

### 7.10 Empty States

Every empty state must:
- State what is missing (not "No data found" — use "No candidates in this stage yet")
- Offer a next action (primary button or instructional text)
- Use `color-text-muted` for the message
- Use an icon at 48px in `color-border-strong`

---

## 8. Layout Patterns

### 8.1 Overall Application Shell

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR (64px height, full width, color-nav-bg)         │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  SIDEBAR     │  MAIN CONTENT AREA                       │
│  (240px)     │                                          │
│              │  ┌──────────────────────────────────┐   │
│  color-      │  │  PAGE HEADER (title + actions)   │   │
│  nav-bg      │  └──────────────────────────────────┘   │
│              │                                          │
│              │  ┌──────────────────────────────────┐   │
│              │  │  PAGE CONTENT                    │   │
│              │  │  (padding: space-8)              │   │
│              │  └──────────────────────────────────┘   │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

- Shell background: `color-bg-subtle` (light) / `color-bg-base-dark` (dark)
- Content max-width: `1280px`, centered within the content area
- Content padding: `space-8` (32px) on all sides, `space-6` on mobile

---

### 8.2 Sidebar — Structure & Behavior

**Width:** 240px expanded, 64px collapsed (icon-only mode). Sidebar is always visible on desktop (≥1024px). On tablet (768px–1023px), sidebar is collapsed by default. On mobile (<768px), sidebar is a drawer that slides in from the left.

**Background:** `color-nav-bg` (`palette-charcoal`)

**Anatomy (top to bottom):**

```
┌────────────────────────┐
│  LOGO (48px height)    │  ← Collapses to icon when sidebar collapses
├────────────────────────┤
│  USER CONTEXT PILL     │  ← Role label + avatar (e.g. "Admin" or "Screener")
├────────────────────────┤
│  ─── PRIMARY NAV ───   │  ← Section group label: color-nav-text-muted, text-xs, uppercase
│  > Dashboard           │
│  > Candidates          │  ← Each item: icon (20px) + label + optional badge
│  > Pipeline            │
│  > Cohorts             │
├────────────────────────┤
│  ─── MANAGE ───        │
│  > Donors              │
│  > Grants              │
│  > Mentors             │
│  > Reports             │
├────────────────────────┤
│  ─── SYSTEM ───        │
│  > Settings            │
│  > Users & Roles       │
├────────────────────────┤
│  [Collapse button]     │  ← Bottom of sidebar, toggles icon-only mode
└────────────────────────┘
```

**Nav Item States:**

| State | Background | Left border | Text | Icon |
|---|---|---|---|---|
| Default | transparent | none | `color-nav-text` | `color-nav-icon` |
| Hover | `color-nav-bg-hover` | none | `color-nav-text` | `color-nav-icon` |
| Active | `color-nav-bg-active` | 3px `color-nav-accent` | `color-nav-text-active` | `color-nav-icon-active` |

- Active indicator: 3px left border in `color-nav-accent` (lime). This is the signature nav treatment — the lime slash identifying where the user is in the system.
- Nav item height: 44px.
- Nav item padding: `space-3` vertical, `space-4` horizontal.
- Radius on nav item: `radius-sm` (right edge only, so left border reads cleanly).
- Section group labels: `color-nav-text-muted`, `text-xs`, `tracking-wide`, uppercase, `space-6` padding-top above each group.
- Divider between groups: `color-nav-divider`, 1px horizontal rule.

**Collapsed state (64px):**
- Show icons only, no labels.
- Section group labels hidden.
- Tooltips appear on hover showing the nav item label.
- Active state: icon in `color-nav-icon-active`, background in `color-nav-bg-active`.

---

### 8.3 Topbar (Navbar) — Structure

**Height:** 64px. **Background:** `color-nav-bg`. Spans full width, sits above the sidebar.

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Hamburger/collapse]  [NIDC Logo + wordmark]   [─ spacer ─]          │
│                                                  [Search]              │
│                                                  [Notifications 🔔]    │
│                                                  [Mode toggle ☀/🌙]   │
│                                                  [Avatar + name ▾]    │
└────────────────────────────────────────────────────────────────────────┘
```

**Left zone:**
- Sidebar collapse/expand toggle (icon button, ghost variant)
- NIDC logotype — hidden on mobile when sidebar drawer icon is shown

**Right zone (left to right):**
- Global search — icon that expands to an input (full-width overlay on mobile)
- Notification bell — badge count uses `color-nav-badge-bg` / `color-nav-badge-text`
- Dark/light mode toggle — icon button, ghost variant
- User avatar + display name + role + dropdown caret

**Topbar border-bottom:** 1px `color-nav-divider`.

---

### 8.4 Page Header Pattern

Every content page opens with a consistent header block:

```
┌─────────────────────────────────────────────────────────┐
│  [Breadcrumb: Dashboard / Candidates / ...]             │
│                                                         │
│  Page Title (text-3xl, font-bold)    [Primary Action]  │
│  Supporting subtitle (text-base,      [Secondary]      │
│  color-text-secondary)                                  │
│                                                         │
│  [Tab bar if multiple sub-views]                        │
└─────────────────────────────────────────────────────────┘
```

- Breadcrumb: `text-sm`, `color-text-muted`, `/` separator
- Primary action button: top-right aligned, always `primary` variant
- Secondary actions: `secondary` or `ghost`, grouped left of primary
- Tab bar: underline style, active tab uses `color-nav-accent` underline (3px), `color-text-primary` text

---

### 8.5 Content Grid

| Context | Columns | Gap |
|---|---|---|
| Dashboard stat row | 4 equal columns | `space-6` |
| Card grid (candidates, donors) | 3 columns (desktop), 2 (tablet), 1 (mobile) | `space-6` |
| Detail view (main + aside) | 8 + 4 columns | `space-8` |
| Form layout | Single column, max-width 640px | `space-6` between fields |
| Full-width table | 12 columns, no aside | — |

---

### 8.6 Detail / Profile View Pattern

Used for candidate profiles, donor records, grant detail.

```
┌────────────────────────────────────┬───────────────────────┐
│  MAIN PANEL (8 cols)               │  ASIDE (4 cols)       │
│                                    │                       │
│  Profile header                    │  Quick stats          │
│  (avatar, name, stage badge,       │  Current stage        │
│   sector tag, track tag)           │  Assigned mentor      │
│                                    │  Key dates            │
│  Tab nav:                          │  Actions panel        │
│  [Overview] [Activity] [Docs]      │  (stage transition,   │
│  [Assessment] [Notes]              │   assign, flag)       │
│                                    │                       │
│  Tab content                       │                       │
└────────────────────────────────────┴───────────────────────┘
```

---

### 8.7 Role-Based View Differences

The layout shell is the same for all roles. Navigation items are filtered by role. The sidebar shows only sections the authenticated user can access. No "locked" items are shown — absent items mean no access.

| Role | Sidebar sections visible |
|---|---|
| Admin | All sections |
| Programme Manager | Dashboard, Candidates, Pipeline, Cohorts, Reports |
| Screener / Assessor | Candidates (filtered to their queue), Pipeline |
| Mentor | Candidates (their mentees only) |
| Donor (portal) | Donor dashboard, Contributions, Reports (limited) |
| Grant Manager | Grants, Reports (financial) |

---

## 9. Icon Usage

**Library:** Lucide Icons (MIT license, consistent stroke weight)
**Stroke width:** 1.5px (default). Use 2px only for emphasis on very small icons (<16px).
**Sizes:**

| Context | Size |
|---|---|
| Nav sidebar | 20px |
| Button with label | 16px |
| Icon-only button | 20px |
| Table row action | 16px |
| Empty state illustration | 48px |
| Badge / status indicator | 12px |
| Page header | 24px |

**Color rules:**
- Nav icons: `color-nav-icon` default, `color-nav-icon-active` when active
- Inline with text: inherits `currentColor` from parent text token
- Status icons: use matching `color-status-{state}` token
- Sector icons: use matching `color-sector-{sector}` token
- Destructive action icons: `color-status-error`
- Never use raw hex on icons. Always inherit or apply a named token.

**Sector icon conventions:**
- Energy: `Zap` icon
- Manufacturing & Industrial Systems: `Factory` icon
- Digital Infrastructure: `Network` icon

**Pipeline stage icon conventions:**
- Discovery: `Search` icon
- Screening: `Filter` icon
- Assessment: `ClipboardCheck` icon
- Selection & Onboarding: `UserCheck` icon
- Development: `TrendingUp` icon
- Deployment: `Rocket` icon

---

## 10. Motion & Animation

All transitions use `ease-out` unless entering (use `ease-in-out`).

| Token | Value | Usage |
|---|---|---|
| `duration-instant` | `0ms` | State swaps with no transition (e.g. toggle) |
| `duration-fast` | `100ms` | Hover color changes, focus rings |
| `duration-normal` | `200ms` | Button states, badge appearances |
| `duration-slow` | `300ms` | Modal entry, drawer slide |
| `duration-deliberate` | `500ms` | Page-level transitions, pipeline stage advance |
| `easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exits, fades out |
| `easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Entrances, slides |

**Rules:**
- Sidebar collapse/expand: `duration-slow`, `easing-in-out`
- Modal open: slide up + fade, `duration-slow`
- Toast entry: slide in from right, `duration-normal`
- Stage badge transition (pipeline advance): pulse in lime for `duration-deliberate`, settle to stage color
- `prefers-reduced-motion`: all transitions collapse to `duration-instant`. No exceptions.

---

## 11. Accessibility Baseline

| Rule | Value |
|---|---|
| Minimum contrast (text) | 4.5:1 (WCAG AA) |
| Minimum contrast (large text, ≥18px bold) | 3:1 |
| Minimum contrast (UI components, borders) | 3:1 |
| Focus ring | Always visible; `shadow-focus-light` or `shadow-focus-dark` |
| Keyboard navigation | All interactive elements reachable by Tab; modals trap focus |
| ARIA labels | All icon-only buttons must have `aria-label` |
| Color alone | Never use color as the only differentiator — always pair with label, icon, or pattern |
| Touch targets | Minimum 44×44px for all interactive elements |

**Critical contrast pairs to verify on every component:**
- `palette-lime` on `palette-charcoal` ✓ (passes AA large, verify for body text)
- `palette-charcoal` text on `palette-white` ✓
- `palette-white` text on `palette-charcoal` ✓
- `palette-green-dark` on `palette-white` — verify AA
- `palette-lime` on `palette-black` ✓
- `color-action-primary-text` (`palette-charcoal`) on `color-action-primary-bg` (`palette-lime`) ✓

**Never place white text on `palette-lime`.** Always use `palette-charcoal` on lime.

---

*Last updated: June 2026. This file is the design source of truth. Any color, spacing, or type decision not found here requires a token to be added to this file before implementation — not a raw value in code.*
