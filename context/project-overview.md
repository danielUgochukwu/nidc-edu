# NIDC Platform — Project Overview

## Overview

The NIDC (Nigeria Innovation Community Foundation) platform is a structured talent development and pipeline management system that identifies, develops, and deploys capable Nigerians into three critical sectors — Energy, Manufacturing & Industrial Systems, and Digital Infrastructure. The platform manages the full lifecycle of a candidate's journey across two distinct pipeline tracks: an Educational Pathway for candidates with little or no formal education, and a Direct Development Track for candidates with existing education or skills. Both tracks converge at sector deployment. Beyond candidate management, the platform handles donor contributions from local Nigerian donors, grant management for institutional funders, mentor-candidate matching, and financial reporting — all governed by a clearly defined role-based access system built for transparency and long-term sustainability.

---

## Goals

1. Provide a structured, phased pipeline that takes candidates from application through screening, assessment, interview, acceptance, development, mentorship, and sector deployment.
2. Assign candidates to the correct pipeline track — Educational Pathway or Direct Development Track — using a universal diagnostic assessment embedded in the application form, eliminating self-selection bias.
3. Enforce a rigorous, auditable screening process requiring consensus from multiple reviewers, with a defined escalation path to the Program Director and Deputy Program Director.
4. Support local Nigerian donor contributions via Paystack and manage institutional grant workflows through a dedicated Finance Officer role.
5. Match accepted candidates with mentors — NIDC alumni and industry professionals — and track mentorship progress and milestones on the platform.
6. Maintain a public-facing web presence that communicates NIDC's mission, programs, sectors, and impact to candidates, donors, and institutional partners.
7. Operate as an administrative portal for candidates post-acceptance, giving them visibility into their pipeline stage, milestones, documents, and notifications.
8. Establish a role-based access system that enforces separation of duties across all platform functions — from screening to finance to administration.
9. Build a platform architecture that can accommodate future features — hub tracking, board governance, native mentorship messaging, and international payments — without requiring a structural rebuild.

---

## Core User Flow — Step by Step

### Candidate Journey

1. Candidate lands on the public home page and reads about NIDC's mission and programs.
2. Candidate clicks the CTA to apply and is taken to the authentication page.
3. Candidate creates an account via Clerk. Their role is set to Applicant on signup.
4. Candidate is taken to the application form. The form is saveable and resumable — they can leave and return at any point before submission.
5. As part of the application form, the candidate completes a universal diagnostic assessment designed by the screening team.
6. The diagnostic assessment result determines pipeline assignment — Educational Pathway or Direct Development Track. Borderline results are flagged for manual review by the screening team.
7. Candidate submits the completed application. The application enters the screening queue.
8. The screening team reviews the application against defined criteria. All reviewers must reach consensus to approve or reject.
9. If reviewers disagree after 48 hours, the application escalates to the Program Director. If the Program Director is unavailable, it escalates to the Deputy Program Director — an assignable role, not a named individual.
10. Rejected candidates receive an automated email and an in-platform notification explaining the outcome.
11. Approved candidates are shortlisted. The screening team creates an interview session externally (Zoom or Google Meet), pastes the link into the platform, and the platform distributes the link and sends automated reminders to shortlisted candidates.
12. Shortlisted candidates attend a group interview session.
13. Candidates who pass the interview are formally accepted into the cohort. Candidates who fail receive an automated email and in-platform notification.
14. Accepted candidates are assigned the Candidate role and gain access to their personal dashboard.
15. The dashboard displays their pipeline track, current stage, upcoming milestones, documents, resources, and notifications.
16. At the appropriate stage, the candidate is matched with a mentor — an NIDC alumnus or industry professional. Mentorship is mandatory for Educational Pathway candidates and optional for Direct Development Track candidates.
17. Mentor and candidate conduct sessions externally. Both parties log sessions and track progress milestones on the platform.
18. Candidate progresses through their pipeline track and is eventually deployed into their assigned sector.

### Donor Journey

1. Donor lands on the public Donate page and reads about NIDC's funding model and impact.
2. Donor creates an account or proceeds as a guest and makes a Naira donation via Paystack.
3. Donor receives an automated receipt via email.
4. Donor can log in to their dashboard to view donation history and platform impact metrics.

---

## Features

### Public Pages
- Home — NIDC overview and CTA to apply
- About — mission, vision, and origin story
- Programs — Educational Pathway and Direct Development Track explained
- Sectors — Energy, Manufacturing & Industrial Systems, Digital Infrastructure
- Apply — eligibility criteria, current cohort status, application window, and CTA
- Donate — funding model, impact summary, and Paystack donation flow
- Impact — public metrics including candidates in pipeline and cohorts completed
- Contact — contact form for candidate, donor, and partner inquiries
- FAQs — answers to common candidate and donor questions
- Blog/Updates — cohort announcements, alumni stories, and NIDC news

### Authentication & Roles
- Clerk-powered authentication — sign up, login, and session management
- Role-based access control with the following ten roles: Applicant, Candidate, Mentor, Screening Team Member, Program Director, Deputy Program Director, Finance Officer, Grant Officer, Administrator, Donor
- Role assignment on signup — visitor becomes Applicant automatically
- Programmatic role upgrades — Applicant becomes Candidate on acceptance
- Deputy Program Director is an assignable role managed by the Program Director, not a hardcoded individual

### Application System
- Saveable, resumable multi-step application form
- Universal diagnostic assessment embedded in the application form
- Automatic pipeline assignment based on assessment result
- Borderline result flagging for screening team manual review
- Cohort management — administrators open and close application windows
- Application submission and queue management

### Screening Workflow
- Screening team dashboard showing all submitted applications
- Application review interface with criteria checklist
- Multi-reviewer consensus voting system
- 48-hour inactivity escalation to Program Director
- Secondary escalation to Deputy Program Director if Program Director is unavailable
- Automated rejection notifications via Resend — email and in-platform

### Interview Management
- Screening team inputs Zoom or Google Meet link manually into the platform
- Platform distributes interview link to shortlisted candidates
- Automated reminders sent before the session via Resend
- Post-interview accept or reject decision recorded in the platform
- Automated outcome notifications to candidates via email and in-platform notification

### Candidate Dashboard
- Pipeline track display — Educational Pathway or Direct Development Track
- Current stage and progress through pipeline milestones
- Upcoming deadlines and requirements
- Documents and resources relevant to track and sector
- Notifications center for all platform communications

### Mentorship System
- Mentor registration flow for NIDC alumni and industry professionals
- Mentor profiles with sector and background information
- Mentor-candidate matching managed by the screening team or administrator
- Session logging — mentor or candidate records that a session took place
- Progress tracking against defined mentorship milestones
- Mentor dashboard — assigned candidates, session history, progress status
- Candidate mentorship dashboard — mentor profile, session history, milestone status

### Donation & Funding
- Donor registration and login
- Paystack integration for local Naira donations only
- Automated donation receipts via Resend
- Donor dashboard — donation history and impact metrics
- Grant management workflow — institutional funders tracked with milestones and documentation
- Finance Officer dashboard — expenditure recording, grant documentation, financial report generation
- Separation of duties enforced — administrators cannot record or approve financial data

### Admin & Governance
- Administrator dashboard for platform management
- User management — create, assign, and revoke roles
- Cohort management — open and close application windows, manage cohort records
- Audit trails for screening decisions and financial entries
- Platform-wide settings and controls
- Finance Officer tools — expenditure entry, grant milestone tracking, report generation

---

## In Scope

- Next.js full-stack web application hosted on Vercel
- Clerk authentication and role-based access control
- PostgreSQL database managed via Prisma ORM
- Two pipeline tracks — Educational Pathway and Direct Development Track
- Universal diagnostic assessment embedded in application form
- Multi-reviewer screening consensus workflow with escalation
- Interview link distribution and automated reminders via Resend
- Candidate administrative dashboard
- Mentor-candidate matching and progress tracking
- Local Nigerian donor payments via Paystack — Naira only
- Institutional grant management workflow
- Finance Officer role with dedicated financial tools
- Full public-facing website — ten pages as listed above
- Automated email notifications via Resend for all key candidate and donor events
- File storage via Supabase Storage for candidate documents and application attachments
- Nine-phase build sequence from foundation to admin and governance

---

## Out of Scope

- Hub construction tracking and status management
- Hub-to-candidate assignment and readiness coordination
- Board Member role and governance dashboard
- Native in-platform messaging between mentors and candidates
- In-platform session scheduling and video or audio calls
- Zoom and Google Meet API integration — links are pasted manually
- Diaspora donation flows — deferred until domiciliary account is established
- International and multi-currency payment support
- Paystack integration for USD, GBP, or EUR transactions
- Automated meeting creation or calendar integration
- Mobile native application — web only for now

---

## Success Criteria

The platform is considered done for initial launch when the following conditions are met:

1. A candidate can land on the public home page, create an account, complete and submit a saveable application form including the diagnostic assessment, and receive confirmation that their application has been received.
2. The diagnostic assessment correctly assigns candidates to either the Educational Pathway or Direct Development Track, and borderline results are surfaced to the screening team for manual review.
3. The screening team can log in, review submitted applications, cast consensus votes, and the system automatically escalates unresolved decisions to the Program Director after 48 hours, and to the Deputy Program Director if the Program Director is unavailable.
4. Rejected candidates at any stage receive an automated email and an in-platform notification within five minutes of the decision being recorded.
5. Shortlisted candidates receive an interview link and at least one automated reminder before the scheduled session.
6. Accepted candidates can log in to their dashboard and view their pipeline track, current stage, milestones, and notifications.
7. Accepted candidates are matched with a mentor, and both mentor and candidate can log sessions and track progress milestones on the platform.
8. A local Nigerian donor can make a Naira donation via Paystack and receive an automated receipt by email.
9. The Finance Officer can record expenditures, attach grant documentation, and generate a financial report without requiring administrator access to do so.
10. An administrator can open and close application windows, manage user roles including assigning the Deputy Program Director role, and access audit trails for screening and financial decisions.
11. All ten public pages are live, accurately describe NIDC's mission and programs, and are accessible without authentication.
12. The platform is deployed to Vercel, connected to a production PostgreSQL database, and has no critical security vulnerabilities in authentication or payment flows.