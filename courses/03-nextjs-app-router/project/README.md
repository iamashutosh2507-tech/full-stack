# Next.js App Router Project

This is a **real, runnable Next.js application** where you'll work on challenges by modifying the code.

## 🚀 Getting Started

### 1. Install Dependencies

**Note:** If you haven't run setup yet, go to repo root and run `npm run setup` first to install all dependencies and Playwright browsers.

```bash
npm install
```

After install, a `postinstall` script runs to patch ESM shims for Vitest (so `npm test` works). If tests fail with module-not-found for `.mjs` files, run `node scripts/patch-esm-shims.js` and try again.

### 2. Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Work on Challenges

**Complete all 17 challenges in order (01 → 17).** Each challenge builds on the previous. Read `challenges/{id}/README.md` before starting; each README states prerequisites and what the tests expect.

- **01** App Router, Pages, and Layout (`challenges/01-app-router-pages-layout/README.md`)
- **02** Server and Client Components (`challenges/02-server-and-client-components/README.md`)
- **03** Data Fetching in Server Components (`challenges/03-data-fetching-server/README.md`)
- **04** API Route Handlers (`challenges/04-api-route-handlers/README.md`)
- **05** Loading and Streaming (`challenges/05-loading-and-streaming/README.md`)
- **06** Dynamic Routes (`challenges/06-dynamic-routes/README.md`)
- **07** Static and Dynamic Rendering (`challenges/07-static-and-dynamic-rendering/README.md`)
- **08** SSR (Server-Side Rendering) (`challenges/08-ssr-dynamic-rendering/README.md`)
- **09** Server Actions and Revalidation (`challenges/09-server-actions-and-revalidation/README.md`)
- **10** Caching and Revalidating (`challenges/10-caching-and-revalidating/README.md`)
- **11** Error Handling (`challenges/11-error-handling/README.md`)
- **12** Metadata and SEO (`challenges/12-metadata-and-seo/README.md`)
- **13** Images and Fonts (`challenges/13-images-and-fonts/README.md`)
- **14** Search and Pagination (`challenges/14-search-and-pagination/README.md`)
- **15** Redux Toolkit with Next.js (`challenges/15-redux-toolkit-with-nextjs/README.md`)
- **16** RTK Query with Next.js (`challenges/16-rtk-query-with-nextjs/README.md`)
- **17** Fullstack Capstone (`challenges/17-fullstack-capstone/README.md`)

### 4. Verify Your Work

**Visual Verification (Primary Method):**
1. Run `npm run dev`
2. Open the app in your browser
3. Interact with your features
4. Confirm everything works as expected visually

**Then Run Review for Scoring:**
```bash
# Review all challenges
npm run review

# Review specific challenge (use the challenge id from the README)
npm run review -- --challenge=01-app-router-pages-layout
```


## 📊 Progress Evidence

*Auto-updated when you run review. Last run: 13/7/2026, 10:51:05 am*

| Metric | Value |
|--------|-------|
| Challenges completed | 0 / 17 (0%) |
| Average score | 0% |

| Challenge | Skills covered | Status |
|-----------|----------------|--------|
| App Router, Pages, and Layout | Next.js App Router, File-based Routing, Link Component, Layout, Page Structure | — |
| Server and Client Components | Server Components, Client Components, 'use client', useState, Event handlers | — |
| Data Fetching in Server Components | Async Server Components, fetch, Data fetching, Server-side data | — |
| API Route Handlers | Route Handlers, app/api, GET, POST, Response.json | — |
| Loading and Streaming | loading.tsx, Streaming, Suspense, Loading UI | — |
| Dynamic Routes | Dynamic Routes, [id], params, generateStaticParams | — |
| Static and Dynamic Rendering | Static Rendering, Dynamic Rendering, force-static, force-dynamic | — |
| SSR (Server-Side Rendering) | SSR, force-dynamic, cache: no-store, Server-side rendering | — |
| Server Actions and Revalidation | Server Actions, 'use server', revalidatePath, revalidateTag | — |
| Caching and Revalidating | fetch cache, revalidate, revalidatePath, revalidateTag | — |
| Error Handling | error.tsx, notFound(), not-found.tsx, Error boundaries | — |
| Metadata and SEO | metadata, generateMetadata, Open Graph, SEO | — |
| Images and Fonts | next/image, next/font, Image optimization, Font optimization | — |
| Search and Pagination | searchParams, URL search params, Pagination, Filtering | — |
| Redux Toolkit with Next.js | Redux Toolkit, configureStore, Provider, useSelector, useDispatch | — |
| RTK Query with Next.js | RTK Query, createApi, fetchBaseQuery, useGetPostsQuery, useMutation | — |
| Fullstack Capstone | Dynamic routes, Server Components, Client Components, Error handling, Metadata, Server Actions | — |

## 📋 Challenge Workflow

1. **Complete challenges in order** — Start with challenge 01; only move to the next after passing (≥80%).
2. **Read the challenge** in `challenges/{challenge-id}/README.md` — Each README states prerequisites, exact file paths, and what the tests expect.
3. **Modify code** in `app/` directory — Create or update only the files the README asks for.
4. **Run the app** (`npm run dev`) to see your changes and verify visually.
5. **Run review** for that challenge: `npm run review -- --challenge={challenge-id}` (e.g. `--challenge=01-app-router-pages-layout`).
6. **Repeat** for the next challenge until you complete all 17.

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Playwright)

**First-time setup (required once):**
```bash
# Install Playwright browsers (required for E2E tests)
npx playwright install
```

**Run E2E tests:**
```bash
npm run test:e2e
```

E2E tests verify visual output and user interactions that you can see in the browser.

**Note:** If you see "Executable doesn't exist" errors, run `npx playwright install` to download the required browsers (Chromium, Firefox, WebKit).

### Review System

The review system runs:
- ✅ Unit tests (functional correctness)
- ✅ E2E tests (visual/interaction verification)
- ✅ Code quality checks (ESLint)
- ✅ Architecture validation (AST pattern checks)
- ✅ Best practices review
- ✅ AI code review (readability & maintainability)

## 📁 Project Structure

```
project/
├── app/                     → Next.js App Router directory
│   ├── page.tsx            → Home page
│   ├── layout.tsx          → Root layout
│   ├── api/                → API routes
│   └── ...
├── challenges/              → Challenge definitions (complete in order 01 → 17)
│   ├── 01-app-router-pages-layout/
│   ├── 02-server-and-client-components/
│   ├── ... (03 through 16)
│   └── 17-fullstack-capstone/
├── tests/                   → Test files
│   ├── challenge-*.test.tsx  → Unit tests
│   └── e2e/                → E2E tests (Playwright)
└── package.json
```

## 🎯 Important Notes

- **This is a real app** - you can see your changes immediately
- **Visual verification first** - run the app to confirm features work
- **Then get scored** - run review for comprehensive evaluation
- **Tests verify requirements** - they check technical correctness, not just visual appearance
- **Progressive difficulty** - Challenges go from basic → intermediate → advanced

## 🔍 Review Output

Results are saved to `../results/`:
- `challenge-results.json` - Individual challenge scores
- `course-summary.json` - Overall course summary
- `ai-feedback.json` - AI review feedback (if available)
