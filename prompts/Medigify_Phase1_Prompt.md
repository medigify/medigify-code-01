# MEDIGIFY — PHASE 1 BUILD PROMPT

> You are building **Phase 1** of Medigify — a mobile-first medical exam question bank for Pakistani medical students. This phase delivers: a **marketing landing page** and a **Practice Mode** with 50 seed MCQs. **No authentication, no user accounts, no database writes.** This is a testable prototype.

---

## STACK

- **Framework:** Next.js 14+ (App Router, `app/` directory)
- **Styling:** Tailwind CSS (utility-first, no component libraries like MUI/Chakra/ShadCN)
- **Font Loading:** `next/font/google` — self-hosted, zero CLS
- **Icons:** Lucide React (lightweight, tree-shakeable)
- **Animations:** CSS transitions only (no Framer Motion yet). 150ms ease-out on hovers.
- **PWA:** Serwist or `next-pwa` — service worker, manifest, installable
- **Deployment Target:** Vercel
- **Data (Phase 1 only):** MCQs loaded from a local JSON file (`/data/mcqs.json`). No Supabase yet. No API routes yet.

---

## DESIGN SYSTEM — FOLLOW EXACTLY

### Color Tokens (CSS Variables via Tailwind config)

**Dark Theme (default):**

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0B0F1A` | Page background |
| `--bg-surface` | `#121826` | Cards, containers, modals |
| `--bg-surface-hover` | `#1A2235` | Hovered cards/buttons |
| `--text-primary` | `#E6EDF3` | Headings, body text |
| `--text-secondary` | `#8B9BB4` | Labels, captions, metadata |
| `--accent` | `#3CC8FF` | CTAs, links, glows, active states |
| `--accent-hover` | `#2BA8DB` | Hovered accent elements |
| `--success` | `#34D399` | Correct answers |
| `--error` | `#F87171` | Incorrect answers |
| `--warning` | `#FBBF24` | Warnings |
| `--border` | `#1E293B` | Subtle dividers |

**Light Theme:**

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#F7FAFC` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, containers |
| `--bg-surface-hover` | `#EDF2F7` | Hovered cards/buttons |
| `--text-primary` | `#0F172A` | Headings, body text |
| `--text-secondary` | `#5B6B82` | Labels, captions |
| `--accent` | `#199ED6` | CTAs, links, active states |
| `--accent-hover` | `#158AC0` | Hovered accent elements |
| `--success` | `#22C55E` | Correct answers |
| `--error` | `#EF4444` | Incorrect answers |
| `--warning` | `#F59E0B` | Warnings |
| `--border` | `#E2E8F0` | Dividers |

### Theme Toggle Implementation

- Store preference in `localStorage` key: `medigify-theme`
- Default to system preference via `prefers-color-scheme`
- Toggle via a sun/moon icon in the header
- Apply theme by toggling a `dark` class on `<html>` element
- All color references must use CSS variables — never hardcode hex values in components

### Typography

| Role | Font | Tailwind Class | Weights |
|---|---|---|---|
| Headings | Space Grotesk | `font-heading` | 600, 700 |
| Body / MCQs | Inter | `font-body` | 400, 500, 600 |

- Body text: `text-base` (16px) on mobile, `text-lg` (18px) on `md:` breakpoint
- Line height: `leading-relaxed` (1.625) for body, `leading-tight` (1.25) for headings
- Max content width for reading: `max-w-3xl` (768px)

### Component Rules

- **Touch targets:** Every clickable element must be minimum `min-h-[48px] min-w-[48px]`
- **Border radius:** Cards = `rounded-lg` (8px), Buttons = `rounded-md` (6px), Modals = `rounded-xl` (12px)
- **Spacing:** Use Tailwind's default spacing scale (based on 4px). Prefer `p-4`, `gap-6`, `space-y-8`, etc.
- **Shadows:** Dark theme = none (use `border border-[--border]` instead). Light theme = `shadow-sm` on cards.
- **Focus states:** `focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2`
- **No decorative elements:** No background patterns, no gradients, no floating shapes, no particle effects. Clean and clinical.
- **Transitions:** `transition-colors duration-150` on interactive elements only

### Accessibility (WCAG 2.1 AA)

- Semantic HTML everywhere: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<article>`
- Every `<section>` on the landing page gets an `aria-labelledby` pointing to its heading
- All icon-only buttons get `aria-label`
- Skip-to-content link as first focusable element: visually hidden, visible on focus
- Respect `prefers-reduced-motion`: disable all transitions/animations when enabled
- All images get descriptive `alt` text
- Color is never the only indicator — correct/incorrect answers use both color AND icons (checkmark/X)

---

## FILE/FOLDER STRUCTURE

```
medigify/
├── app/
│   ├── layout.tsx              # Root layout: fonts, theme provider, metadata
│   ├── page.tsx                # Landing page (/)
│   ├── practice/
│   │   ├── page.tsx            # Subject selection + block size picker
│   │   └── session/
│   │       └── page.tsx        # Active practice session (MCQ flow)
│   ├── terms/
│   │   └── page.tsx            # Terms of Service (placeholder)
│   ├── privacy/
│   │   └── page.tsx            # Privacy Policy (placeholder)
│   └── not-found.tsx           # Custom 404 page
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header with nav + theme toggle
│   │   └── Footer.tsx          # Site footer
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── Audience.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   ├── practice/
│   │   ├── SubjectSelector.tsx
│   │   ├── BlockSizePicker.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── ExplanationPanel.tsx
│   │   ├── ProgressBar.tsx
│   │   └── PostBlockSummary.tsx
│   └── ui/
│       ├── ThemeToggle.tsx
│       ├── Button.tsx          # Reusable button with variants
│       ├── Card.tsx            # Reusable card wrapper
│       ├── Accordion.tsx       # For FAQ
│       └── SkeletonLoader.tsx  # Loading states
├── data/
│   └── mcqs.json               # 50 seed MCQs (format below)
├── hooks/
│   ├── useTheme.ts             # Theme toggle logic
│   └── usePracticeSession.ts   # Practice mode state management
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   └── utils.ts                # Helper functions
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # PWA icons (192x192, 512x512)
│   └── og-image.png            # Open Graph image for social sharing
├── styles/
│   └── globals.css             # Tailwind base + CSS variables
├── tailwind.config.ts
├── next.config.js              # PWA config
└── tsconfig.json
```

---

## MCQ DATA FORMAT (`/data/mcqs.json`)

```json
[
  {
    "id": "q001",
    "statement": "Which cranial nerve is responsible for the sensation of taste in the anterior two-thirds of the tongue?",
    "options": {
      "a": "Glossopharyngeal nerve (CN IX)",
      "b": "Facial nerve (CN VII)",
      "c": "Trigeminal nerve (CN V)",
      "d": "Vagus nerve (CN X)"
    },
    "correct_option": "b",
    "explanation": "The facial nerve (CN VII), specifically through its chorda tympani branch, carries taste sensation from the anterior two-thirds of the tongue. The glossopharyngeal nerve (CN IX) handles the posterior one-third.",
    "subject": "Anatomy",
    "topic": "Cranial Nerves",
    "year": 2023,
    "academic_year": 1
  }
]
```

Note: Some questions may have 5 options (a through e). The component must handle both 4 and 5 option questions dynamically.

For Phase 1 testing, include at least 50 MCQs distributed across these subjects: Anatomy, Physiology, Biochemistry, Pathology, Pharmacology. Use real, medically accurate questions from UHS past papers or create realistic examples.

---

## PAGE SPECIFICATIONS

### PAGE 1: LANDING PAGE (`/`)

This is a **server-side rendered** marketing page. NOT the app dashboard.

#### Header (Sticky)

- Left: Medigify logo (text-based: "Medigify" in Space Grotesk 700, with accent color on the "M")
- Center/Right: Nav links — "Features", "How It Works", "FAQ" (smooth scroll to sections)
- Right: Theme toggle icon (sun/moon)
- Right: `Login` button (ghost/outlined style, disabled with tooltip "Coming Soon") and `Sign Up` button (filled accent color, disabled with tooltip "Coming Soon")
- On mobile: hamburger menu that slides out from right

#### Section 1: Hero

- **Headline:** "Ace Your Medical Exams — One Question at a Time"
  - Typography: `text-4xl md:text-6xl font-heading font-bold`
- **Subheadline:** "Pakistan's smartest question bank. UHS past papers, spaced-repetition flashcards, and mock tests — built for how you actually study."
  - Typography: `text-lg md:text-xl text-[--text-secondary]`
- **Primary CTA:** "Try Practice Mode — It's Free" → links to `/practice`
  - Style: Large button, `bg-[--accent] text-white`, padding `px-8 py-4`, `text-lg`
- **Secondary CTA:** "See How It Works" → smooth scrolls to How It Works section
  - Style: Ghost button, `border border-[--accent] text-[--accent]`
- **Visual:** Right side on desktop — a stylized mockup/illustration of the Practice Mode interface on a phone frame. On mobile, this goes below the text.
  - If you cannot generate a realistic mockup, use a clean CSS illustration: a phone-shaped div with rounded corners containing a simplified version of the QuestionCard component inside it.

#### Section 2: Trust Bar / Social Proof

- Horizontal bar with metrics:
  - "10,000+ MCQs" · "5+ Subjects" · "UHS Past Papers"
- Below: Examining body badges in a row — "UHS", "NUMS (Coming Soon)", "AKU (Coming Soon)"
- Style: Muted, clean, small text. Background slightly different from page bg (`bg-[--bg-surface]`)
- On mobile: stack vertically or wrap into 2 rows

#### Section 3: How It Works

- Heading: "How It Works"
- Three steps in a horizontal row (mobile: vertical stack):

| Step | Icon | Title | Description |
|---|---|---|---|
| 1 | `Search` icon | "Pick Your Subject" | "Filter by your year, your examining body, your weak spots." |
| 2 | `BookOpen` icon | "Practice or Test" | "Low-pressure practice with instant answers, or timed mock exams that simulate the real thing." |
| 3 | `Brain` icon | "Remember Everything" | "Turn any question into a flashcard. Spaced repetition makes it stick." |

- Each step is a card with the step number (large, accent-colored), icon, title, and description
- Steps connected by a subtle line/arrow on desktop

#### Section 4: Feature Highlights

- Heading: "Everything You Need to Pass"
- 2×2 grid on desktop, stacked on mobile
- Each card:

| Icon | Title | Description |
|---|---|---|
| `Library` | "10,000+ Past Paper MCQs" | "Organized by subject, topic, and year. Every question comes with a detailed explanation." |
| `Timer` | "Exam-Realistic Mock Tests" | "Timed blocks with no answer peeking. Full review after submission." |
| `Layers` | "Smart Flashcards" | "One tap creates a flashcard from any question. Our algorithm decides when you review it." |
| `Smartphone` | "Works Everywhere" | "Install as an app on your phone. Study on slow networks. No app store needed." |

- Card style: `bg-[--bg-surface] border border-[--border] rounded-lg p-6`
- Icon: Accent colored, `w-10 h-10`

#### Section 5: Who It's For

- Heading: "Built For Every Year"
- Three cards side by side (mobile: stacked):

| Year | Message |
|---|---|
| "1st & 2nd Year" | "Building your foundation? Start with Anatomy, Physiology, and Biochemistry past papers." |
| "3rd & 4th Year" | "Into clinical subjects? Pathology, Pharmacology, and Forensic Medicine — covered." |
| "Final Year" | "Revision mode. Timed mocks that feel like the real exam." |

- Each card has a subtle gradient top border in accent color

#### Section 6: Testimonials

- Heading: "What Students Are Saying"
- 3 testimonial cards in a horizontal scroll on mobile, row on desktop:

| Quote | Name | Detail |
|---|---|---|
| "Finally a platform that understands UHS papers. The explanations are actually helpful." | "Sarah A." | "3rd Year, KEMU" |
| "I use the flashcard feature every single day. My retention has gone up dramatically." | "Ahmed R." | "2nd Year, AIMC" |
| "The mock tests feel exactly like the real exam. The pressure, the timer — everything." | "Fatima K." | "Final Year, SMC" |

- Card style: Quote in italics, name bold, detail in secondary text
- These are placeholder testimonials — mark with a `{/* TODO: Replace with real testimonials */}` comment

#### Section 7: FAQ

- Heading: "Frequently Asked Questions"
- Accordion component — one open at a time:

| Question | Answer |
|---|---|
| "Is Medigify free?" | "Yes — you can start practicing for free right now. Premium plans unlock the full question bank, all mock tests, and advanced analytics." |
| "Which exams do you cover?" | "We're launching with UHS past papers across all years. NUMS, AKU, and UCMD support is coming soon." |
| "Can I use it on my phone?" | "Absolutely. Medigify is built mobile-first as a Progressive Web App. Install it from your browser — no app store needed." |
| "How do flashcards work?" | "Tap 'Add to Flashcards' on any question. We use the SM-2 spaced-repetition algorithm to schedule your reviews at the optimal time for long-term memory." |
| "I found a mistake in a question." | "Use the Report button on any MCQ. Our team reviews every report and makes corrections quickly." |
| "Will my progress be saved?" | "Once you create a free account (coming soon), all your practice history, mock test scores, and flashcards are saved automatically." |

#### Section 8: Final CTA

- Full-width section with contrasting background (`bg-[--bg-surface]`)
- Headline: "Your Exams Won't Wait. Neither Should You."
- CTA: "Start Practicing Now — It's Free" → `/practice`
- Same button style as hero CTA

#### Section 9: Footer

- Medigify logo + "Made for Pakistani medical students"
- Links row: Terms of Service (`/terms`), Privacy Policy (`/privacy`)
- "© 2026 Medigify. All rights reserved."
- Style: Minimal, small text, `text-[--text-secondary]`

#### SEO for Landing Page

```tsx
// In app/layout.tsx or page metadata
export const metadata = {
  title: "Medigify — Pakistan's #1 Medical Exam Question Bank",
  description: "Practice UHS past papers with instant explanations, timed mock tests, and smart flashcards. Built for Pakistani medical students. Free to start.",
  keywords: ["UHS past papers", "medical MCQs Pakistan", "MBBS question bank", "medical exam preparation", "UHS MCQs", "medical flashcards"],
  openGraph: {
    title: "Medigify — Ace Your Medical Exams",
    description: "10,000+ UHS past paper MCQs with explanations. Practice, test, and remember.",
    url: "https://medigify.com",
    siteName: "Medigify",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Medigify — Pakistan's #1 Medical Exam Question Bank",
    description: "Practice UHS past papers with instant explanations. Free to start."
  }
}
```

Also generate:
- `/app/sitemap.ts` — dynamic sitemap
- `/app/robots.ts` — robots.txt allowing all crawlers
- JSON-LD structured data for EducationalOrganization schema in the root layout

---

### PAGE 2: PRACTICE MODE — SUBJECT SELECTION (`/practice`)

#### Layout

- Header (same sticky header as landing page, but "Practice" nav item is active/highlighted)
- Page title: "Practice Mode"
- Subtitle: "Pick a subject and start practicing. No timer, no pressure — just learn."

#### Subject Selection

- Grid of subject cards (2 columns on mobile, 3 on desktop)
- Each card shows:
  - Subject name (e.g., "Anatomy")
  - MCQ count for that subject (computed from the JSON data)
  - A subtle icon or emoji per subject
- Cards are clickable — tapping selects that subject (visual highlight with accent border)
- Multiple subjects can be selected (multi-select with checkmarks)
- "Select All" toggle above the grid

#### Block Size Picker

- Appears after at least one subject is selected
- Label: "How many questions?"
- Options as pill buttons in a row: `5`, `10`, `15`, `20`, `All`
- Default selected: `10`
- Below the pills, show: "X questions available" based on selection

#### Start Button

- "Start Practice" — large accent button
- Disabled until at least 1 subject is selected
- On tap: navigates to `/practice/session` with subjects and count as URL search params (e.g., `/practice/session?subjects=anatomy,physiology&count=10`)

#### Bottom Banner

- Subtle, non-intrusive banner at page bottom:
- "Sign up to save your progress and unlock all features"
- Styled with `bg-[--bg-surface] border-t border-[--border]`
- No link (Phase 1 — auth doesn't exist yet)

---

### PAGE 3: PRACTICE SESSION (`/practice/session`)

This is the core study experience. Get this right.

#### Session Initialization

- Read `subjects` and `count` from URL search params
- Filter MCQs from JSON data matching selected subjects
- Randomly shuffle the filtered questions
- Slice to the requested count
- If not enough questions available, use all available and show a note: "Only X questions available for your selection"

#### Session State (React state, not persisted)

```typescript
interface PracticeSession {
  questions: MCQ[]               // The shuffled, sliced question array
  currentIndex: number           // Which question we're on (0-based)
  answers: Map<string, {         // Keyed by question ID
    selectedOption: string       // 'a', 'b', 'c', 'd', or 'e'
    isCorrect: boolean
    timeSpentMs: number          // Milliseconds on this question
  }>
  sessionStartTime: number       // Date.now() when session began
  currentQuestionStartTime: number // Date.now() when current question loaded
  isComplete: boolean
}
```

#### Question Card UI

- **Progress Bar:** Thin bar at the very top of the content area showing progress (e.g., 30% filled after question 3 of 10). Color: `--accent`. Height: 3px.
- **Progress Text:** "Question 3 of 10" — below the bar, right-aligned, small secondary text
- **Question Statement:**
  - Typography: `text-lg md:text-xl font-medium leading-relaxed`
  - Wrap in a card: `bg-[--bg-surface] rounded-lg p-6`
  - Must handle long text gracefully (some medical questions are 3-4 lines)
- **Options:**
  - Rendered as a vertical list of buttons, one per option
  - Each button shows: option letter ("A", "B", "C", "D", and optionally "E") + option text
  - Style (default): `bg-[--bg-surface] border border-[--border] rounded-md p-4 text-left w-full`
  - Style (hover, before answering): `bg-[--bg-surface-hover] border-[--accent]`
  - Minimum height: 48px (touch target)
  - **Before answering:** All options are interactive
  - **After answering:** All options are disabled. Styles change:
    - User's selected option (if wrong): `border-[--error] bg-red-500/10` + X icon on the right
    - Correct option: `border-[--success] bg-green-500/10` + checkmark icon on the right
    - Other options: Slightly dimmed, `opacity-60`
- **NO visible timer anywhere on screen**

#### Explanation Panel

- Appears immediately after the user taps an option (slides down with a 150ms transition)
- Background: `bg-[--bg-surface] border-l-4 border-[--accent] rounded-r-lg p-4 mt-4`
- Label: "Explanation" in bold
- Content: The explanation text from the MCQ data
- Typography: `text-base leading-relaxed`

#### Navigation

- **"Next Question" button:** Appears only after the user has answered. Large, accent-colored, full-width on mobile.
- **No "Previous" button:** Users cannot go back to previous questions in Practice Mode.
- **No "Skip" button:** Every question must be answered.
- On the last question, the button text changes to "Finish Practice"

#### Post-Block Summary Screen

After the last question is answered and "Finish Practice" is tapped:

- **Score Header:** Large display — "7 / 10 Correct" with a circular percentage indicator (e.g., 70%). Color the percentage based on performance:
  - ≥ 80%: `--success` green
  - 50–79%: `--warning` yellow
  - < 50%: `--error` red
- **Stats Grid (2×2):**
  - "Incorrect Answers": count with `--error` color
  - "Avg. Time / Question": calculated from silent timing (e.g., "42 seconds")
  - "Longest Question": the time spent on the slowest question (e.g., "2m 15s")
  - "Subjects Covered": list of subjects in this block
- **Subject Breakdown Table:**
  - Columns: Subject | Correct | Total | Accuracy
  - Only shows subjects that appeared in this block
- **"Review Mistakes" Button:**
  - Shows only incorrectly answered questions
  - Each question shows: statement, the user's wrong answer (red), the correct answer (green), and the explanation
  - Collapsible — all collapsed by default, tap to expand
- **Action Buttons:**
  - "Practice Again" → goes back to `/practice` (subject selection)
  - "Back to Home" → goes to `/`
- **Bottom Banner (same as before):** "Sign up to save your progress and unlock all features"

---

### PAGE 4: TERMS OF SERVICE (`/terms`)

- Simple, clean, readable page
- Heading: "Terms of Service"
- Last updated date
- Placeholder legal text covering:
  - Acceptance of terms
  - Prohibited activities (scraping, automated extraction, unauthorized distribution)
  - Account sharing prohibition
  - Intellectual property ownership
  - Limitation of liability
  - Right to modify terms
- Style: `max-w-3xl mx-auto` centered content, body text styling

### PAGE 5: PRIVACY POLICY (`/privacy`)

- Same layout as Terms
- Heading: "Privacy Policy"
- Placeholder text covering:
  - Data collected (email, name, academic info, performance data)
  - How data is stored
  - Third-party services
  - Data retention
  - User rights
- Style: Same as Terms

### PAGE 6: 404 NOT FOUND (`/not-found.tsx`)

- Centered content
- Large "404" text in accent color
- Message: "This page doesn't exist. Maybe it's still in development."
- "Back to Home" button → `/`
- Keep it clean and on-brand

---

## PWA CONFIGURATION

### manifest.json

```json
{
  "name": "Medigify",
  "short_name": "Medigify",
  "description": "Pakistan's #1 Medical Exam Question Bank",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B0F1A",
  "theme_color": "#3CC8FF",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker

- Cache-first strategy for static assets (JS, CSS, fonts, images)
- Network-first for data (MCQ JSON in Phase 1)
- Precache the landing page, practice page, and practice session page shells
- Must work offline for cached pages (landing page at minimum)

### Viewport Locking (Practice Session only)

In `/practice/session` layout or page:
- Disable pinch-to-zoom: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`
- Lock horizontal scroll: `overflow-x: hidden` on body
- Do NOT apply these restrictions to the landing page (hurts accessibility/SEO)

---

## PERFORMANCE REQUIREMENTS

- **Lighthouse Performance:** ≥ 90
- **Lighthouse SEO:** ≥ 95
- **Lighthouse Accessibility:** ≥ 95
- **First Contentful Paint:** < 1.5s
- **Total Bundle (initial load):** < 150KB gzipped
- **Fonts:** Self-hosted via `next/font`, preloaded, `font-display: swap`
- **Images:** Use `next/image` for any images. Use SVGs for icons.
- **Code splitting:** Each page should be its own chunk. Practice session components lazy-loaded.

---

## WHAT NOT TO BUILD (Phase 1 Excluded)

DO NOT implement any of these — they are for future phases:

- ❌ User authentication (no login, no signup, no Supabase Auth)
- ❌ Database connections (no Supabase client, no API routes that write data)
- ❌ Mock Test Mode (Phase 3)
- ❌ Flashcard system (Phase 3)
- ❌ User dashboard (Phase 2)
- ❌ User profiles (Phase 2)
- ❌ "Add to Flashcards" functionality (button can exist but does nothing — show tooltip "Coming Soon")
- ❌ "Report Question" functionality (button can exist but does nothing — show tooltip "Coming Soon")
- ❌ Admin panel (Phase 4)
- ❌ Payment/subscription system (Phase 5)
- ❌ Study streaks (Phase 2)
- ❌ Offline sync for test progress (Phase 5)
- ❌ API routes or server actions
- ❌ Analytics dashboards

---

## FINAL CHECKLIST — VERIFY BEFORE DELIVERY

- [ ] Landing page renders correctly in dark and light themes
- [ ] Theme toggle persists across page refreshes (localStorage)
- [ ] All 9 landing page sections are present and responsive
- [ ] Smooth scroll works for in-page nav links
- [ ] Practice flow: select subjects → pick block size → answer questions → see summary
- [ ] Question options show correct/incorrect feedback with colors AND icons
- [ ] Explanation appears immediately after answering
- [ ] Post-block summary shows: score, incorrect count, avg time, longest time, subject breakdown
- [ ] "Review Mistakes" shows only wrong answers with explanations
- [ ] Mobile hamburger menu works
- [ ] All touch targets are ≥ 48×48px
- [ ] PWA is installable (manifest + service worker registered)
- [ ] 404 page renders for unknown routes
- [ ] Terms and Privacy pages exist with placeholder content
- [ ] No console errors
- [ ] No horizontal scroll anywhere
- [ ] Lighthouse Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95
- [ ] Login/Signup buttons show "Coming Soon" tooltip when tapped
- [ ] "Add to Flashcards" and "Report" show "Coming Soon" tooltip when tapped
- [ ] Semantic HTML used throughout (header, main, nav, section, footer, article)
- [ ] `prefers-reduced-motion` respected
- [ ] Skip-to-content link present
