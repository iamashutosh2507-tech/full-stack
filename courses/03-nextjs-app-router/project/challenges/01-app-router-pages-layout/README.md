# Challenge 01: App Router, Pages, and Layout

**This is challenge 01 of 17.** Complete challenges in order. Work on this challenge only; after you finish and run review, move on to challenge 02.

**Prerequisites:** None. This is the first challenge.

## Goal

Create the foundation of your Next.js App Router app: a **root layout**, a **home page**, an **about page**, and navigation between them using Next.js `Link`.

## What to do

1. **Root layout** — Ensure `app/layout.tsx` exists with `<html>`, `<body>`, and `{children}`. No `'use client'` (Server Component by default).

2. **Home page** — Ensure `app/page.tsx` exists as the root page (default export). Renders when users visit `/`.

3. **About page** — Create `app/about/page.tsx` for the `/about` route. Default export, Server Component (no `'use client'`). Include a link back: `<Link href="/">Home</Link>`.

4. **Navigation** — Use the `Link` component from `next/link`:
   - On the home page (or in the layout): add `<Link href="/about">About</Link>` so the E2E test can find a link with text "About".
   - On the about page: add `<Link href="/">Home</Link>` so users can navigate back.

5. **Code** — TypeScript, no `console.*`, pass ESLint.

## What the review checks

| Step | What it does |
|------|----------------|
| **Functional tests** | app/page.tsx, app/about/page.tsx, app/layout.tsx exist; Link used; Server Components. |
| **Code quality** | ESLint (no errors/warnings). |
| **Architecture** | App Router structure, Link from next/link, no 'use client' on pages. |
| **E2E** | Home page loads; navigation to about works. |

Pass threshold: weighted score ≥ 80%.

## Technical Requirements

- Have `app/layout.tsx` (root layout with html, body, children).
- Have `app/page.tsx` (home) and `app/about/page.tsx` (about).
- Use `Link` from `next/link` for in-app navigation (not raw `<a>` for same-origin routes).
- Server Components by default (no `'use client'` on these page files).
- TypeScript; pass ESLint; no console statements.

## Verify and submit

- `npm run dev` → open `/` and `/about`, confirm the About and Home links work.
- From the project folder: `dev`
- Pass threshold: weighted score ≥ 80%. Then move to challenge 02.
