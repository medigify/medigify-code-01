# Medigify — Product Requirements Document (PRD) v2.0

> **Prepared for:** Medigify Founding Team
> **Prepared by:** Development Lead
> **Date:** March 2026
> **Stack:** Next.js · Supabase · PWA
> **Status:** Pre-Development — Phase 1

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technical Foundation](#2-technical-foundation)
3. [Design System](#3-design-system)
4. [Phase 1 — Landing Page + Practice Mode (No Auth)](#4-phase-1--landing-page--practice-mode-no-auth)
5. [Phase 2 — Authentication & User System](#5-phase-2--authentication--user-system)
6. [Phase 3 — Mock Test Mode + Flashcard System](#6-phase-3--mock-test-mode--flashcard-system)
7. [Phase 4 — Admin Dashboard + Content Pipeline](#7-phase-4--admin-dashboard--content-pipeline)
8. [Phase 5 — Monetization, Offline Sync & Hardening](#8-phase-5--monetization-offline-sync--hardening)
9. [Database Schema Overview](#9-database-schema-overview)
10. [Landing Page — Section Blueprint](#10-landing-page--section-blueprint)
11. [Success Metrics & KPIs](#11-success-metrics--kpis)
12. [Risk Register](#12-risk-register)
13. [Appendix](#13-appendix)

---

## 1. Executive Summary

**Medigify** is a web-based, mobile-first question bank and spaced-repetition flashcard platform built for medical students in Pakistan. The initial content scope is UHS past papers, with an architecture designed to scale toward NUMS, AKU, UCMD, and other examining bodies.

### 1.1 Product Vision

A frictionless, blazing-fast study tool that works reliably on Pakistani cellular networks — where every second of load time is a student lost.

### 1.2 Phased Delivery Strategy

The product will be delivered across **5 phases**, each producing a complete, testable, and independently useful product increment. No phase depends on a future phase to be functional.

| Phase | Name | Core Deliverable | Auth Required |
|-------|------|-----------------|---------------|
| 1 | Foundation | Landing Page + Practice Mode | No |
| 2 | User System | Auth, Profiles, Dashboard | Yes |
| 3 | Study Modes | Mock Tests + Flashcards | Yes |
| 4 | Admin & Content | Admin Panel + Bulk Upload Pipeline | Yes (Admin) |
| 5 | Monetization & Polish | Payments, Offline Sync, Security | Yes |

### 1.3 Current Content Status

- **Available:** 50 MCQs in `.txt` format (for Phase 1 testing)
- **Pipeline:** ~10,000 MCQs to be migrated to Supabase in Phase 4
- **Format:** Statement, Options (A–E), Correct Answer, Explanation, Tags (Subject/Topic/Year)
- **Branding:** Logo and brand assets are ready

---

## 2. Technical Foundation

### 2.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (App Router) | SSR for SEO on landing page, static generation for app pages, image optimization, built-in routing |
| Backend & DB | Supabase (PostgreSQL) | Auth, Row-Level Security (RLS), real-time subscriptions, storage, edge functions, CRON jobs |
| Deployment | Vercel | Zero-config Next.js deployment, edge network, analytics |
| PWA | next-pwa / Serwist | Service worker registration, offline caching, install prompts |

### 2.2 Performance Mandates

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 1.5s on 4G | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s on 4G | Lighthouse |
| Total Bundle Size (initial) | < 150 KB gzipped | Build output |
| Time to Interactive (TTI) | < 3s on 3G | Lighthouse |
| Lighthouse Performance Score | > 90 | Lighthouse |

### 2.3 SEO Requirements

- Server-side rendered landing page with full meta tags, Open Graph, and Twitter Card support
- Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<nav>`)
- Structured data (JSON-LD) for educational platform schema
- Dynamic sitemap generation
- robots.txt configuration
- Canonical URLs on all pages

### 2.4 PWA Configuration

- Offline-capable service worker with cache-first strategy for static assets
- App manifest with Medigify branding, theme colors, and icons
- Install prompt on mobile after 2nd visit
- Horizontal scroll lock on study interfaces
- Pinch-to-zoom disabled on test/study pages only (not landing page)

---

## 3. Design System

### 3.1 Design Philosophy

**Modern. Clinical. Minimalist.**
High readability, cognitive ease, zero visual noise. No bloated UI component libraries. No decorative background patterns. No heavy animations. Every pixel serves a purpose.

### 3.2 Color Palette

#### Dark Theme (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0B0F1A` | Page background |
| `--bg-surface` | `#121826` | Cards, containers, modals |
| `--bg-surface-hover` | `#1A2235` | Hovered cards/buttons |
| `--text-primary` | `#E6EDF3` | Headings, body text |
| `--text-secondary` | `#8B9BB4` | Labels, captions, metadata |
| `--accent` | `#3CC8FF` | CTAs, links, glows, active states |
| `--accent-hover` | `#2BA8DB` | Hovered accent elements |
| `--success` | `#34D399` | Correct answers, positive indicators |
| `--error` | `#F87171` | Incorrect answers, errors, destructive actions |
| `--warning` | `#FBBF24` | Warnings, streak-at-risk |
| `--border` | `#1E293B` | Subtle dividers, card borders |

#### Light Theme

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#F7FAFC` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, containers, modals |
| `--bg-surface-hover` | `#EDF2F7` | Hovered cards/buttons |
| `--text-primary` | `#0F172A` | Headings, body text |
| `--text-secondary` | `#5B6B82` | Labels, captions, metadata |
| `--accent` | `#199ED6` | CTAs, links, active states |
| `--accent-hover` | `#158AC0` | Hovered accent elements |
| `--success` | `#22C55E` | Correct answers |
| `--error` | `#EF4444` | Incorrect answers |
| `--warning` | `#F59E0B` | Warnings |
| `--border` | `#E2E8F0` | Dividers, card borders |

> **Note:** The original PRD listed `#199ED6` as card background in Light Theme. This is corrected here — colored card backgrounds reduce readability. The accent color is used for interactive elements instead.

### 3.3 Typography

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| Headings | Space Grotesk | system-ui, sans-serif | 600, 700 |
| Body / MCQ Text | Inter | system-ui, sans-serif | 400, 500, 600 |
| Monospace (stats) | JetBrains Mono | monospace | 400 |

- Load fonts via `next/font` (self-hosted, zero CLS)
- Body text minimum: 16px on mobile, 18px on desktop
- Line height: 1.6 for body, 1.3 for headings
- Max content width: 720px for reading interfaces

### 3.4 Component Standards

| Element | Specification |
|---------|--------------|
| Touch targets | Minimum 48×48px (all clickable elements) |
| Border radius | 8px (cards), 6px (buttons), 12px (modals) |
| Spacing scale | 4px base unit (4, 8, 12, 16, 24, 32, 48, 64) |
| Shadows (dark) | None — use border + subtle background differentiation |
| Shadows (light) | `0 1px 3px rgba(0,0,0,0.08)` on cards |
| Transitions | 150ms ease-out (hover states only, no page transitions) |
| Focus indicators | 2px solid `--accent` with 2px offset |

### 3.5 Accessibility (WCAG 2.1 AA)

- Semantic HTML on every page (`<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`)
- ARIA labels on all icon-only buttons
- Skip-to-content link on all pages
- Keyboard navigable — all interactive elements reachable via Tab
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
- Reduced motion: respect `prefers-reduced-motion` media query
- Screen reader announcements for dynamic content (answer reveals, score updates)

---

## 4. Phase 1 — Landing Page + Practice Mode (No Auth)

**Goal:** Ship a testable, beautiful product with real study value. No accounts, no complexity. Just the landing page and a working Practice Mode with the 50 seed MCQs.

**Why no auth:** The team needs to see and test the core product before adding user accounts. This phase proves the concept works.

### 4.1 Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 1.1 | Public landing page (full SEO) | P0 |
| 1.2 | Dark/Light theme toggle | P0 |
| 1.3 | PWA shell (manifest, service worker, installable) | P0 |
| 1.4 | Supabase project setup + MCQ schema | P0 |
| 1.5 | Seed 50 MCQs into Supabase | P0 |
| 1.6 | Practice Mode — full flow | P0 |
| 1.7 | Mobile-first responsive design across all pages | P0 |
| 1.8 | 404 page | P1 |
| 1.9 | Loading skeleton screens | P1 |

### 4.2 Landing Page

Full section blueprint in [Section 10](#10-landing-page--section-blueprint).

**Route:** `/`

The landing page is a **separate marketing page** — not the app dashboard. It must be server-side rendered for full SEO.

**Header (sticky):**
- Medigify logo (left)
- Nav links: Features, How It Works, FAQ
- Theme toggle (icon)
- CTA buttons: `Login` (ghost), `Sign Up` (filled) — both disabled in Phase 1 with tooltip "Coming Soon"

**Footer:**
- Medigify branding
- Links: Terms of Service, Privacy Policy (placeholder pages in Phase 1)
- Social media links (if available)
- Copyright notice

### 4.3 Practice Mode

**Route:** `/practice`

**Entry Flow:**
1. User lands on a subject selection screen
2. Selects a subject (from available seed data)
3. Chooses block size (5, 10, 15, 20 — or "All Available")
4. Taps "Start Practice"

**In-Session Behavior:**

| Feature | Specification |
|---------|--------------|
| Progress indicator | "Question 3 of 10" with a thin progress bar |
| Timer | **Hidden** — no visible stopwatch. Frontend silently records `startTime` and `endTime` per question |
| Answer selection | Tapping an option instantly locks it and reveals the correct answer |
| Correct answer | Selected option turns `--success` green, correct option highlighted |
| Incorrect answer | Selected option turns `--error` red, correct option highlighted in `--success` green |
| Explanation | Expands below the options immediately after selection |
| Navigation | "Next Question" button appears after answering. No going back to previous questions |
| Skip | Not allowed — every question must be answered |

**Post-Block Summary Screen:**

| Metric | Display |
|--------|---------|
| Score | "7 / 10 Correct" with percentage |
| Incorrect count | Count of wrong answers with subject/topic breakdown |
| Avg. time per question | Calculated from silent timing |
| Longest single question | The question that took the most time |
| Option to review | "Review Mistakes" button showing only incorrectly answered questions with explanations |

**Phase 1 Limitations (no auth):**
- No progress is saved between sessions (no user account to attach it to)
- No flashcard creation (requires user account)
- No question reporting (requires user account)
- A subtle banner at the bottom: "Sign up to save your progress and unlock all features" (links nowhere in Phase 1)

### 4.4 Data Model (Phase 1 — Minimal)

```
questions
├── id (uuid, PK)
├── statement (text, NOT NULL)
├── option_a (text, NOT NULL)
├── option_b (text, NOT NULL)
├── option_c (text, NOT NULL)
├── option_d (text, NOT NULL)
├── option_e (text, nullable — some MCQs have 4 options)
├── correct_option (enum: a, b, c, d, e)
├── explanation (text, NOT NULL)
├── subject (text, NOT NULL)
├── topic (text, nullable)
├── year (integer, nullable)
├── examining_body (text, default: 'UHS')
├── academic_year (integer — 1 through 5)
├── requires_subscription (boolean, default: false)
├── is_active (boolean, default: true)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### 4.5 Phase 1 Exit Criteria

- [ ] Landing page scores 90+ on Lighthouse (Performance, SEO, Accessibility)
- [ ] Practice Mode works end-to-end with 50 seed MCQs
- [ ] Dark/Light theme toggles correctly across all pages
- [ ] PWA is installable on Android and iOS
- [ ] All touch targets are ≥ 48×48px
- [ ] Page loads under 3 seconds on throttled 3G connection
- [ ] Tested on: Chrome (Android), Safari (iOS), Chrome (Desktop)

---

## 5. Phase 2 — Authentication & User System

**Goal:** Turn anonymous visitors into registered users. Build the account system, dashboard, and profile infrastructure that every future feature depends on.

**Dependency:** Phase 1 complete and tested.

### 5.1 Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 2.1 | Supabase Auth — Google OAuth + Email/Password | P0 |
| 2.2 | Registration flow with cascading dropdowns | P0 |
| 2.3 | Username validation (real-time duplicate check) | P0 |
| 2.4 | User profile schema + API | P0 |
| 2.5 | Protected route middleware | P0 |
| 2.6 | User dashboard (dynamic greeting, basic layout) | P0 |
| 2.7 | Profile page (view + edit) | P0 |
| 2.8 | Content filtering by academic year | P0 |
| 2.9 | Welcome email on registration | P1 |
| 2.10 | First-time interactive UI tour | P1 |
| 2.11 | Study streak tracking | P1 |
| 2.12 | Practice Mode — now saves progress to user account | P0 |
| 2.13 | "Add to Flashcards" button on MCQs (queues for Phase 3) | P1 |
| 2.14 | "Report Question" button on MCQs | P1 |
| 2.15 | Email verification flow | P0 |

### 5.2 Registration Flow

**Route:** `/signup`

**Step 1 — Auth Method:**
- "Continue with Google" (OAuth)
- OR Email + Password fields (minimum 8 chars, 1 number, 1 uppercase)

**Step 2 — Profile Setup (post-auth):**

| Field | Type | Validation |
|-------|------|-----------|
| First Name | text | Required, 2–30 chars |
| Last Name | text | Required, 2–30 chars |
| Username | text | Required, 3–20 chars, alphanumeric + underscores only. **Real-time** Supabase check on blur — shows green checkmark or red "Username taken" |
| Current Academic Year | select | 1, 2, 3, 4, 5 |
| Expected Graduation Date | date picker | Must be in the future |
| Examining Body | select | UHS, NUMS, AKU, UCMD, Other |
| College | select | Dynamically populated based on Examining Body. Includes "Other" |
| College (manual) | text | Renders ONLY if "Other" is selected in BOTH Examining Body AND College dropdowns |

**Cascading Dropdown Data:**

The examining body → college mapping must be stored in Supabase as a reference table:

```
examining_bodies
├── id (uuid, PK)
├── name (text) — e.g., "UHS"
└── is_active (boolean)

colleges
├── id (uuid, PK)
├── name (text) — e.g., "King Edward Medical University"
├── examining_body_id (uuid, FK → examining_bodies.id)
└── is_active (boolean)
```

### 5.3 User Dashboard

**Route:** `/dashboard`

**Dynamic Greeting:**
- First ever login: "Welcome, [First Name] [Last Name]"
- All subsequent logins: "Welcome back, [First Name]"

**Dashboard Widgets (Phase 2 scope):**

| Widget | Content |
|--------|---------|
| Quick Start | "Continue Practice" or "Start New Practice" button |
| Study Streak | Current streak count + flame icon. "Complete 1 activity today to maintain your streak" |
| Progress Overview | MCQs attempted / total available for their year (e.g., "12 / 50") |
| Weak Subjects | Top 3 subjects with lowest accuracy (requires ≥ 5 attempts per subject to show) |
| Upcoming | Placeholder for Mock Tests (Phase 3) |

**Study Streak Rules:**
- A streak day is maintained by completing **any one** of: 1 Practice MCQ answered, 1 Mock Test MCQ answered, 1 Flashcard reviewed
- Streak resets at midnight (user's local time)
- Tracked in the `user_streaks` table with `last_activity_date` and `current_streak` fields

### 5.4 User Profile

**Route:** `/profile`

| Section | Editable | Fields |
|---------|----------|--------|
| Personal Info | Partially | First Name, Last Name, Username (with re-validation) |
| Academic Info | Read-only post-registration | Examining Body, College, Year |
| Password | Yes | Change password (Email/Password users only) |
| Lifetime Stats | Read-only | Total MCQs attempted, Total available, Current streak, Longest streak |

### 5.5 User Data Model (Phase 2 additions)

```
profiles
├── id (uuid, PK, FK → auth.users.id)
├── first_name (text)
├── last_name (text)
├── username (text, UNIQUE)
├── academic_year (integer)
├── graduation_date (date)
├── examining_body_id (uuid, FK)
├── college_id (uuid, FK, nullable)
├── college_custom (text, nullable)
├── subscription_status (enum: free, pending, premium — default: free)
├── subscription_expires_at (timestamptz, nullable)
├── role (enum: user, admin, master_admin — default: user)
├── is_first_login (boolean, default: true)
├── created_at (timestamptz)
└── updated_at (timestamptz)

user_streaks
├── user_id (uuid, PK, FK → profiles.id)
├── current_streak (integer, default: 0)
├── longest_streak (integer, default: 0)
├── last_activity_date (date)
└── updated_at (timestamptz)

question_attempts
├── id (uuid, PK)
├── user_id (uuid, FK → profiles.id)
├── question_id (uuid, FK → questions.id)
├── selected_option (enum: a, b, c, d, e)
├── is_correct (boolean)
├── time_spent_seconds (integer)
├── mode (enum: practice, mock)
├── session_id (uuid — groups attempts into blocks)
├── created_at (timestamptz)
└── INDEX on (user_id, question_id, mode)

question_reports
├── id (uuid, PK)
├── user_id (uuid, FK → profiles.id)
├── question_id (uuid, FK → questions.id)
├── issue_type (enum: statement, options, answer, explanation)
├── description (text)
├── status (enum: pending, resolved, dismissed — default: pending)
├── created_at (timestamptz)
└── resolved_at (timestamptz, nullable)
```

### 5.6 Phase 2 Exit Criteria

- [ ] User can register via Google OAuth and Email/Password
- [ ] Cascading dropdowns work correctly for all examining bodies
- [ ] Username duplicate check works in real-time
- [ ] Dashboard renders with correct greeting and live stats
- [ ] Practice Mode saves all attempts to user account
- [ ] Study streak increments and resets correctly
- [ ] Profile page allows editing permitted fields
- [ ] Welcome email sends on registration
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Email verification flow works end-to-end

---

## 6. Phase 3 — Mock Test Mode + Flashcard System

**Goal:** Deliver the two remaining core study features — high-stakes exam simulation and spaced-repetition flashcards.

**Dependency:** Phase 2 complete (user accounts required).

### 6.1 Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 3.1 | Mock Test Mode — full flow with global timer | P0 |
| 3.2 | Post-test review screen | P0 |
| 3.3 | Flashcard system — user-generated from MCQs | P0 |
| 3.4 | SM-2 spaced repetition algorithm | P0 |
| 3.5 | Flashcard review interface | P0 |
| 3.6 | "Add to Flashcards" functionality (wired up from Phase 2 button) | P0 |
| 3.7 | Post-block statistics (enhanced for both modes) | P1 |
| 3.8 | Dashboard enhancements — flashcard stats, mock test history | P1 |
| 3.9 | Profile — total flashcards generated/reviewed | P1 |

### 6.2 Mock Test Mode

**Route:** `/mock-test`

**Entry Flow:**
1. User selects subject(s)
2. Selects block size (10, 25, 50, 100)
3. Timer is auto-calculated: **1.5 minutes per question** (configurable in admin, Phase 4)
4. Taps "Begin Test"
5. Confirmation modal: "Once started, you cannot pause. Are you ready?"

**In-Session Behavior:**

| Feature | Specification |
|---------|--------------|
| Global timer | Visible countdown at top-right, fixed position. Turns `--warning` yellow at 25% time remaining. Turns `--error` red at 10% remaining |
| Question navigation | Sidebar/bottom tray showing question numbers. Tappable to jump. Color-coded: white (unanswered), `--accent` (answered), `--warning` (flagged) |
| Flag for review | Toggle flag on any question for later review within the test |
| Answer selection | Tapping an option selects it. **No feedback** — no green/red, no explanation |
| Answer change | User can change their answer before submitting the test |
| Submit | "Submit Test" button. Confirmation modal: "You have X unanswered questions. Submit anyway?" |
| Auto-submit | When timer hits 0, test auto-submits with current answers |

**Post-Test Review Screen:**

**Route:** `/mock-test/review/[session_id]`

| Element | Specification |
|---------|--------------|
| Score summary | "32 / 50 Correct (64%)" — large, prominent |
| Time summary | Total time taken, average per question |
| Subject breakdown | Table showing accuracy per subject |
| Question list | Each question shows: statement, user's answer (red if wrong, green if right), correct answer, explanation |
| Collapse/expand | Each question's options and explanation are collapsible (collapsed by default, expand on tap) |
| Filter | Toggle to show: All, Incorrect Only, Correct Only, Flagged |
| Add to Flashcards | Available on each question in review |

### 6.3 Flashcard System

**Route:** `/flashcards`

#### Card Structure

| Side | Content |
|------|---------|
| Front | MCQ statement (the question) |
| Back | Correct option letter + full option text + explanation |

#### How Cards Are Created

1. User taps "Add to Flashcards" on any MCQ (in Practice, Mock Test review, or while browsing)
2. System checks for duplicates (same `question_id` for this user)
3. Card is created and auto-tagged with the MCQ's subject, topic, and year
4. Confirmation toast: "Added to your [Subject] deck"

#### Deck Organization

- Cards are automatically grouped by **Subject** (e.g., "Anatomy", "Physiology")
- User sees a deck list with card counts and "Due for Review" counts
- No manual deck creation in this phase — all decks are auto-generated from tags

#### Review Interface

**Route:** `/flashcards/review/[subject]`

1. Card appears with Front side showing
2. User taps "Show Answer" to flip
3. User rates their recall:

| Button | Label | SM-2 Quality | Next Review |
|--------|-------|-------------|-------------|
| Red | "Forgot" | 0 | 1 minute |
| Orange | "Hard" | 2 | Next day |
| Green | "Good" | 4 | Based on interval |
| Blue | "Easy" | 5 | Extended interval |

4. Next card loads automatically

#### SM-2 Algorithm Implementation

Each flashcard tracks:
- `easiness_factor` (starts at 2.5, minimum 1.3)
- `interval` (days until next review)
- `repetitions` (successful consecutive reviews)
- `next_review_date`

Standard SM-2 formula applied on each rating.

### 6.4 Flashcard Data Model

```
flashcards
├── id (uuid, PK)
├── user_id (uuid, FK → profiles.id)
├── question_id (uuid, FK → questions.id)
├── subject (text — denormalized for fast deck queries)
├── topic (text, nullable)
├── easiness_factor (float, default: 2.5)
├── interval_days (integer, default: 0)
├── repetitions (integer, default: 0)
├── next_review_date (date, default: today)
├── last_reviewed_at (timestamptz, nullable)
├── created_at (timestamptz)
└── INDEX on (user_id, subject, next_review_date)
```

### 6.5 Phase 3 Exit Criteria

- [ ] Mock Test runs with visible countdown timer
- [ ] Auto-submit triggers when timer expires
- [ ] Post-test review shows all questions with correct/incorrect highlighting
- [ ] Flashcards can be created from any MCQ context
- [ ] SM-2 algorithm correctly schedules review intervals
- [ ] Flashcard review interface works with swipe/tap gestures on mobile
- [ ] Dashboard shows flashcard and mock test statistics
- [ ] All features work on mobile (48×48px touch targets maintained)

---

## 7. Phase 4 — Admin Dashboard + Content Pipeline

**Goal:** Give the team independence to manage content, users, and reports — through an admin panel you build for them. This is what turns the product from a developer-dependent prototype into a manageable platform.

**Dependency:** Phases 1–3 complete.

### 7.1 Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 4.1 | Admin dashboard — protected route with RBAC | P0 |
| 4.2 | User management table (view, search, filter) | P0 |
| 4.3 | MCQ upload via `.txt` file with parsing + validation | P0 |
| 4.4 | Bulk MCQ migration pipeline (for the 10k question bank) | P0 |
| 4.5 | Question management (edit, deactivate, toggle subscription flag) | P0 |
| 4.6 | Report queue (review + resolve user-submitted reports) | P1 |
| 4.7 | Admin-uploaded flashcard decks (standalone `.txt` upload) | P1 |
| 4.8 | RBAC — Master Admin can assign granular permissions to associate admins | P1 |
| 4.9 | Content analytics — most attempted questions, highest error rates | P2 |

### 7.2 Admin Access Control

**Route:** `/admin` (all admin routes)

**Role Hierarchy:**

| Role | Permissions |
|------|------------|
| Master Admin | Full access — user management, content, reports, RBAC, paywall toggles, account deletion |
| Content Admin | Upload MCQs, edit questions, manage flashcard decks, view reports |
| Support Admin | View and resolve question reports only |

- Admin routes are protected by Supabase RLS + Next.js middleware
- Non-admin users see a 404 (not a 403 — don't reveal admin routes exist)

### 7.3 MCQ Upload System

**Route:** `/admin/upload`

**Expected `.txt` Format:**

```
##QUESTION
What is the largest organ in the human body?
##OPTIONS
A. Heart
B. Liver
C. Skin
D. Brain
E. Lungs
##ANSWER
C
##EXPLANATION
The skin is the largest organ by surface area, covering approximately 1.5-2 square meters in adults.
##TAGS
subject:Anatomy|topic:Integumentary System|year:2023|academic_year:1|examining_body:UHS
---
```

(Questions separated by `---`)

**Upload Validation Rules:**

| Rule | On Failure |
|------|-----------|
| Every question must have: QUESTION, OPTIONS, ANSWER, EXPLANATION, TAGS | Abort upload, show: "Error on question #X: Missing [FIELD]" |
| Minimum 4 options (A–D), maximum 5 (A–E) | Abort upload, show line number |
| ANSWER must match one of the provided options | Abort upload, show line number |
| TAGS must include at minimum: subject and academic_year | Abort upload, show line number |
| Duplicate detection (same statement text) | Warning (not abort) — admin can choose to skip or overwrite |

**Upload Process:**
1. Admin selects `.txt` file
2. Frontend parses and validates client-side first (instant feedback)
3. If valid, sends parsed JSON array to Supabase edge function
4. Edge function does server-side validation + inserts
5. Success: "Uploaded X questions successfully. Y duplicates skipped."
6. Failure: Detailed error log with line numbers

### 7.4 Bulk Migration Pipeline

For the initial 10,000 MCQ migration:
- Same `.txt` format as above
- Batch processing: upload is chunked into batches of 100 for database performance
- Progress bar in admin UI showing: "Uploading batch 4 of 100..."
- Rollback capability: if any batch fails, previously inserted batches are not rolled back (idempotent — re-upload skips duplicates)

### 7.5 Dynamic Paywall Control

Every content piece (question, flashcard deck) has a `requires_subscription` boolean.

Admin can:
- Toggle individual questions
- Bulk toggle by subject, topic, year, or examining body
- Preview which content is free vs. premium from the admin dashboard

> **Note:** The actual paywall enforcement (frontend intercept + payment flow) is Phase 5. Phase 4 only builds the admin controls and database flags.

### 7.6 Admin Data Model (Phase 4 additions)

```
admin_permissions
├── id (uuid, PK)
├── user_id (uuid, FK → profiles.id)
├── permission (enum: manage_users, manage_content, manage_reports, manage_paywall, manage_admins)
├── granted_by (uuid, FK → profiles.id)
├── created_at (timestamptz)
└── UNIQUE(user_id, permission)

admin_flashcard_decks
├── id (uuid, PK)
├── title (text)
├── subject (text)
├── topic (text, nullable)
├── academic_year (integer)
├── examining_body (text)
├── requires_subscription (boolean, default: false)
├── created_by (uuid, FK → profiles.id)
├── is_active (boolean, default: true)
├── created_at (timestamptz)
└── updated_at (timestamptz)

admin_flashcard_items
├── id (uuid, PK)
├── deck_id (uuid, FK → admin_flashcard_decks.id)
├── front_text (text)
├── back_text (text)
├── sort_order (integer)
├── created_at (timestamptz)
└── INDEX on (deck_id, sort_order)

upload_logs
├── id (uuid, PK)
├── admin_id (uuid, FK → profiles.id)
├── file_name (text)
├── total_questions (integer)
├── successful (integer)
├── duplicates_skipped (integer)
├── errors (jsonb — array of { line, message })
├── created_at (timestamptz)
└── status (enum: success, partial, failed)
```

### 7.7 Phase 4 Exit Criteria

- [ ] Admin dashboard accessible only to authorized roles
- [ ] MCQ upload parses and validates `.txt` files with clear error messages
- [ ] 10,000 MCQs successfully migrated to Supabase
- [ ] Questions can be edited, deactivated, and toggled for subscription
- [ ] Report queue shows pending reports with resolve/dismiss actions
- [ ] Admin-uploaded flashcard decks appear for relevant users
- [ ] RBAC correctly restricts associate admins to their assigned permissions
- [ ] Non-admin users see 404 on admin routes

---

## 8. Phase 5 — Monetization, Offline Sync & Hardening

**Goal:** Turn the platform into a sustainable product — payment verification, premium content gating, offline resilience, security hardening, and legal compliance.

**Dependency:** Phases 1–4 complete.

### 8.1 Deliverables

| # | Deliverable | Priority |
|---|------------|----------|
| 5.1 | Freemium paywall — frontend intercept + "Become a Member" flow | P0 |
| 5.2 | Payment verification workflow (Google Form + manual admin approval) | P0 |
| 5.3 | Premium status management + 365-day expiration | P0 |
| 5.4 | Account upgrade email (triggered on admin approval) | P0 |
| 5.5 | Paywall banner for free-tier users | P0 |
| 5.6 | Offline PWA sync for Mock Tests | P1 |
| 5.7 | Data obfuscation (frontend payload security) | P1 |
| 5.8 | Dormant account cleanup (CRON job) | P2 |
| 5.9 | Terms of Service page | P0 |
| 5.10 | Privacy Policy page | P0 |
| 5.11 | Analytics visualization — strength/weakness breakdown on dashboard | P1 |
| 5.12 | Global user statistics on profile | P1 |
| 5.13 | Re-subscription flow for expired accounts | P1 |

### 8.2 Freemium Paywall Logic

**How it works:**

1. Content with `requires_subscription = true` appears in the UI but is visually marked (lock icon or subtle badge)
2. When a free-tier user taps locked content, the app **intercepts** the request (no API call made)
3. A modal appears: "Become a Member" with benefits listed
4. Modal has a CTA: "Subscribe Now" → routes to `/subscribe`

**What's locked (default — admin-configurable):**
- Certain subjects or topics
- Certain years of past papers
- Admin-uploaded flashcard decks (configurable per deck)
- Mock Test block sizes above 25 questions

**What's always free:**
- Landing page
- Account creation and profile
- Practice Mode with free-tier content
- User-generated flashcards from free content
- Study streaks

### 8.3 Payment & Verification Workflow

**Route:** `/subscribe`

1. **Benefits page** — lists what premium unlocks
2. **Embedded Google Form** — for bank transfer details (name, transaction ID, amount, date)
3. **Below form:** Button — "I have submitted my payment"
4. **On click:** User's `subscription_status` updates to `pending` in Supabase
5. **Admin side:** A "Pending Verification" queue appears in admin dashboard (Phase 4 infrastructure)
6. **Admin action:** View submission → Approve or Reject
7. **On approve:**
   - `subscription_status` → `premium`
   - `subscription_expires_at` → `NOW() + 365 days`
   - Supabase trigger fires → sends Account Upgrade Email
8. **On reject:**
   - `subscription_status` → `free`
   - Rejection email sent with reason

### 8.4 Subscription Expiration

- A Supabase CRON job runs daily at midnight UTC
- Checks for profiles where `subscription_status = 'premium'` AND `subscription_expires_at < NOW()`
- Auto-reverts to `free`
- Sends expiration notification email
- User data (flashcards, stats, streaks) is **preserved** — only content access is locked
- Dashboard banner updates: "Your subscription has expired. Subscribe again to continue enjoying all content."

### 8.5 Offline PWA Sync (Mock Tests)

**Scope:** Mock Test Mode only (Practice Mode remains online-only).

**How it works:**

1. When a Mock Test begins, the full question set is cached in the service worker + IndexedDB
2. The global timer runs locally via `setInterval` (not server-dependent)
3. After each answer, the attempt is saved to IndexedDB
4. A `navigator.onLine` listener monitors connectivity
5. On reconnection, a sync function pushes all locally stored attempts to Supabase via background sync API
6. Conflict resolution: local data always wins (user's answers are the source of truth)

**Edge cases:**
- If the user closes the browser mid-test, IndexedDB retains the data. On next app open, prompt: "You have an unfinished mock test. Resume or discard?"
- If sync fails after 3 retries, show: "Your test results are saved locally. They'll sync when your connection stabilizes."

### 8.6 Data Obfuscation

The frontend must not expose question data in a trivially scrapeable format:

| Layer | Technique |
|-------|-----------|
| API response | Questions are fetched one-at-a-time (not entire block at once) in Practice Mode. Mock Test fetches all but with options array order randomized server-side |
| Correct answer | Never sent in the initial payload for Mock Tests. Fetched only during post-test review |
| Network tab | Response payloads use short key names (e.g., `s` instead of `statement`, `o` instead of `options`) — not true encryption, but raises the effort bar |
| Console | `devtools-detect` library to display a warning message when DevTools are opened (deterrent, not prevention) |

### 8.7 Dormant Account Cleanup

- Master Admin configures threshold in admin settings (default: 6 months)
- Supabase CRON job runs weekly
- Targets: `subscription_status = 'free'` AND `last_activity_date < NOW() - threshold`
- **Before deletion:** Sends a "We miss you" email 14 days before scheduled deletion with a "Keep my account" link
- **On deletion:** Permanently removes profile, attempts, flashcards, and streaks. Auth record is deleted via Supabase Admin API.

### 8.8 Legal Pages

**Route:** `/terms` and `/privacy`

**Terms of Service — must include:**
- Prohibition on scraping, automated extraction, or unauthorized distribution of Q-bank content
- Prohibition on sharing accounts
- Right to terminate accounts violating terms
- Intellectual property ownership statement

**Privacy Policy — must include:**
- Data collected: email, name, academic affiliation, performance metrics
- How data is stored (Supabase, PostgreSQL, encrypted at rest)
- Data retention policy (tied to dormant account cleanup)
- Third-party services used (Google OAuth, Vercel analytics)
- User rights: data export, account deletion request

### 8.9 Phase 5 Exit Criteria

- [ ] Free-tier users are blocked from premium content with a clear upgrade path
- [ ] Payment submission → admin approval → premium activation works end-to-end
- [ ] Premium expires after 365 days and reverts to free with data intact
- [ ] Mock Test works fully offline and syncs on reconnection
- [ ] Dormant account cleanup runs on schedule with warning emails
- [ ] Terms of Service and Privacy Policy pages are live and accessible
- [ ] Question data is not trivially visible in browser DevTools
- [ ] Dashboard shows strength/weakness analytics
- [ ] Profile shows all global lifetime statistics

---

## 9. Database Schema Overview

This is the complete entity relationship summary across all phases:

```
auth.users (Supabase managed)
  └── profiles (1:1)
        ├── user_streaks (1:1)
        ├── question_attempts (1:many)
        ├── question_reports (1:many)
        ├── flashcards (1:many)
        └── admin_permissions (1:many, if admin)

examining_bodies (reference)
  └── colleges (1:many)

questions (core content)
  ├── question_attempts (1:many)
  ├── question_reports (1:many)
  └── flashcards (1:many)

admin_flashcard_decks
  └── admin_flashcard_items (1:many)

upload_logs (audit trail)
```

**Row-Level Security (RLS) Policy Summary:**

| Table | Policy |
|-------|--------|
| profiles | Users can read/update their own. Admins can read all. Master Admin can delete. |
| questions | All authenticated users can read where `is_active = true`. Only admins can insert/update. |
| question_attempts | Users can read/insert their own only. |
| flashcards | Users can read/insert/update/delete their own only. |
| question_reports | Users can insert their own. Admins can read/update all. |
| admin_* tables | Only users with appropriate admin_permissions can access. |

---

## 10. Landing Page — Section Blueprint

The landing page is a critical marketing asset. It must convert visitors into signups. Every section has a purpose.

### Section 1: Hero

| Element | Content |
|---------|---------|
| Headline | "Ace Your Medical Exams — One Question at a Time" |
| Subheadline | "Pakistan's smartest question bank. UHS past papers, spaced-repetition flashcards, and mock tests — built for how you actually study." |
| Primary CTA | "Try Now For Free" → `/signup` |
| Secondary CTA | "See How It Works" → scrolls to Section 3 |
| Visual | Clean mockup of the Practice Mode on a phone frame (dark theme) |

### Section 2: Social Proof / Trust Bar

| Element | Content |
|---------|---------|
| Metrics | "X+ MCQs" · "X+ Students" · "X+ Past Papers Covered" (update dynamically once real data exists) |
| Examining Bodies | Logo row: UHS, NUMS, AKU, UCMD badges |

### Section 3: How It Works

Three-step visual flow:

| Step | Title | Description |
|------|-------|-------------|
| 1 | "Pick Your Subject" | "Filter by your year, your examining body, your weak spots." |
| 2 | "Practice or Test" | "Low-pressure practice with instant feedback, or full mock exams with timers." |
| 3 | "Remember Everything" | "Turn any question into a flashcard. Our spaced-repetition algorithm makes sure it sticks." |

### Section 4: Feature Highlights

Four feature cards in a 2×2 grid (mobile: stacked):

| Feature | Title | Description | Icon |
|---------|-------|-------------|------|
| Q-Bank | "10,000+ UHS Past Paper MCQs" | "Organized by subject, topic, and year. Every question has a detailed explanation." | Book icon |
| Mock Tests | "Exam-Realistic Mock Tests" | "Timed blocks, no peeking at answers, full post-test review." | Clock icon |
| Flashcards | "Spaced-Repetition Flashcards" | "Turn any MCQ into a flashcard. Review at the perfect time to maximize retention." | Cards icon |
| Mobile-First | "Study Anywhere" | "Built as a PWA. Install it like an app. Works on slow networks." | Phone icon |

### Section 5: Who It's For

| Audience | Message |
|----------|---------|
| 1st–2nd Year | "Building your foundation? Start with Anatomy, Physiology, and Biochemistry past papers." |
| 3rd–4th Year | "Hitting clinical subjects? We've got Pathology, Pharmacology, and Forensic Medicine covered." |
| Final Year | "Revision mode. Mock tests that simulate the real thing." |

### Section 6: Testimonials

- Placeholder section with 3 cards
- Each card: quote, student name, college, year
- Use placeholder content for Phase 1; replace with real testimonials when available

### Section 7: FAQ

Accordion-style, 5–7 questions:

| Question | Answer |
|----------|--------|
| "Is Medigify free?" | "Yes — you can start practicing for free. Premium unlocks the full question bank and all mock tests." |
| "Which examining bodies do you cover?" | "We're starting with UHS past papers. NUMS, AKU, and UCMD support is on our roadmap." |
| "Can I use it offline?" | "Yes — Medigify is a PWA. Install it on your phone and access cached content even without internet." |
| "How are flashcards different from just re-reading?" | "We use the SM-2 spaced-repetition algorithm — you review cards at scientifically optimal intervals." |
| "I found an error in a question. What do I do?" | "Hit the Report button on any question. Our team reviews every report and makes corrections." |

### Section 8: Final CTA

| Element | Content |
|---------|---------|
| Headline | "Your Exams Won't Wait. Neither Should You." |
| CTA | "Start Practicing Now — It's Free" → `/signup` |

### Section 9: Footer

- Medigify logo + tagline
- Links: Terms of Service, Privacy Policy, Contact
- Social media icons (if available)
- "Made for Pakistani medical students" badge
- © 2026 Medigify. All rights reserved.

---

## 11. Success Metrics & KPIs

### Phase 1 (Landing + Practice)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Lighthouse Performance Score | ≥ 90 | Lighthouse CI |
| Landing page bounce rate | < 60% | Vercel Analytics |
| Practice sessions started | Track count | Supabase (anonymous, no user ID) |
| PWA installs | Track count | Service worker analytics |

### Phase 2 (Auth + Users)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Registration completion rate | > 70% of signups complete profile | Supabase query |
| DAU (Daily Active Users) | Establish baseline | Supabase + Vercel |
| Avg. streak length | Track and grow | user_streaks table |
| Registration → first practice | < 2 minutes | Timestamp delta |

### Phase 3 (Mock + Flashcards)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Mock tests completed (not abandoned) | > 60% completion rate | question_attempts where mode = mock |
| Flashcards created per user | > 10 avg | flashcards table |
| Flashcard review sessions per week | > 3 avg | Review timestamps |

### Phase 4 (Admin + Content)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| MCQ upload success rate | > 95% | upload_logs |
| Report resolution time | < 48 hours | question_reports timestamps |
| Total content available | 10,000+ MCQs | questions table count |

### Phase 5 (Monetization)

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Free → Premium conversion | > 5% | profiles where status = premium |
| Payment verification turnaround | < 24 hours | Admin queue timestamps |
| Premium retention (re-subscribe rate) | > 40% | Re-subscriptions after expiry |
| Churn (premium → dormant) | < 20% | Activity tracking |

---

## 12. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Slow load times on Pakistani networks | High | High | Aggressive code splitting, image optimization, CDN (Vercel Edge), PWA caching |
| MCQ content quality issues | High | Medium | Upload validation, user reporting system, admin review queue |
| Supabase free tier limits hit | Medium | Medium | Monitor usage early. Plan migration to Supabase Pro before Phase 4 bulk upload |
| Low adoption / signups | High | Medium | SEO-optimized landing page, word-of-mouth through medical student communities, free tier is generous enough to hook users |
| Question bank piracy / scraping | Medium | High | Data obfuscation, one-at-a-time fetch, DevTools warning. Accept that determined scrapers will succeed — focus on UX being the moat |
| Offline sync data loss | Medium | Low | IndexedDB persistence, retry logic, local-data-wins conflict resolution |
| Manual payment verification bottleneck | Medium | Medium | Admin notification system. If volume grows, plan for automated payment integration (JazzCash, Easypaisa) |
| Single developer dependency | High | High | Phased delivery means each phase is a complete product. Clean code, documented APIs, Supabase as managed backend reduces bus factor |

---

## 13. Appendix

### A. Tech Stack Quick Reference

| Tool | Purpose | Docs |
|------|---------|------|
| Next.js 14+ | Frontend framework (App Router) | nextjs.org |
| Supabase | Auth, DB, Storage, Edge Functions, CRON | supabase.com |
| Vercel | Hosting & deployment | vercel.com |
| Serwist / next-pwa | PWA service worker | serwist.pages.dev |
| Tailwind CSS | Utility-first styling | tailwindcss.com |
| Framer Motion | Minimal, performant animations (optional) | framer.com/motion |
| React Hot Toast | Toast notifications | react-hot-toast.com |

### B. Content Format Specification

**MCQ `.txt` file format:**

```
##QUESTION
[Question statement text]
##OPTIONS
A. [Option A text]
B. [Option B text]
C. [Option C text]
D. [Option D text]
E. [Option E text] (optional)
##ANSWER
[Letter]
##EXPLANATION
[Explanation text — can be multi-line]
##TAGS
subject:[value]|topic:[value]|year:[value]|academic_year:[value]|examining_body:[value]
---
```

### C. Email Templates Required

| Email | Trigger | Phase |
|-------|---------|-------|
| Welcome | Registration complete | 2 |
| Email Verification | Registration (email/password) | 2 |
| Account Upgrade | Admin approves premium | 5 |
| Subscription Expiry Warning | 7 days before expiry | 5 |
| Subscription Expired | Day of expiry | 5 |
| Payment Rejected | Admin rejects payment | 5 |
| Dormant Account Warning | 14 days before deletion | 5 |
| Account Deleted | Post-deletion confirmation | 5 |

### D. Browser Support Matrix

| Browser | Version | Priority |
|---------|---------|----------|
| Chrome (Android) | Latest 2 versions | P0 |
| Safari (iOS) | Latest 2 versions | P0 |
| Chrome (Desktop) | Latest 2 versions | P1 |
| Firefox (Desktop) | Latest 2 versions | P2 |
| Edge (Desktop) | Latest 2 versions | P2 |
| Samsung Internet | Latest version | P2 |

---

> **This is a living document.** It will be updated as the product evolves and as decisions are made during development. Each phase will receive a detailed implementation plan before development begins.
