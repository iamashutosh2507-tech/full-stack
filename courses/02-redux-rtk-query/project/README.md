# Redux & RTK Query Project

This is a **real, runnable React application** where you'll work on challenges by modifying the code: Redux store and slices, then RTK Query for API and caching, then using them together.

## 🚀 Getting Started

### 1. Install Dependencies

**Note:** If you haven't run setup yet, go to repo root and run `npm run setup` first to install all dependencies and Playwright browsers.

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Work on Challenges

Do challenges **in order, one at a time**: read the first challenge README, solve it, run review, then move on to the next. You don't need to read all challenge files upfront. Each README is self-contained for that step.

- **Challenge 01**: `challenges/01-store-setup/README.md` — Store Setup with configureStore
- **Challenge 02**: `challenges/02-first-slice/README.md` — First Slice with createSlice
- **Challenge 03**: `challenges/03-reading-dispatching/README.md` — Reading and Dispatching in Components
- **Challenge 04**: `challenges/04-multiple-slices/README.md` — Multiple Slices in the Store
- **Challenge 05**: `challenges/05-async-thunks/README.md` — Async Logic with createAsyncThunk
- **Challenge 06**: `challenges/06-rtk-query-setup/README.md` — RTK Query Setup and API Slice
- **Challenge 07**: `challenges/07-queries/README.md` — Query Endpoints and useQuery Hooks
- **Challenge 08**: `challenges/08-caching-refetch/README.md` — Caching and Cache Tags
- **Challenge 09**: `challenges/09-mutations/README.md` — Mutations with useMutation
- **Challenge 10**: `challenges/10-optimistic-updates/README.md` — Optimistic Updates
- **Challenge 11**: `challenges/11-api-local-state/README.md` — API and Local State Together
- **Challenge 12**: `challenges/12-error-loading-ux/README.md` — Error and Loading UX
- **Challenge 13**: `challenges/13-query-parameters/README.md` — Query with Parameters and Detail View

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

# Review specific challenge
npm run review -- --challenge=01-store-setup
```

## 📊 Progress Evidence

*Auto-updated when you run review. Last run: 18/6/2026, 5:29:43 pm*

| Metric | Value |
|--------|-------|
| Challenges completed | 0 / 13 (0%) |
| Average score | 0% |

| Challenge | Skills covered | Status |
|-----------|----------------|--------|
| Store Setup with configureStore | Redux, Redux Toolkit, configureStore, Provider | — |
| First Slice with createSlice | Redux Toolkit, createSlice, reducers, actions | — |
| Reading and Dispatching in Components | React-Redux, useSelector, useDispatch, typed hooks | — |
| Multiple Slices in the Store | Redux, multiple reducers, slice per domain | — |
| Async Logic with createAsyncThunk | Redux Toolkit, createAsyncThunk, extraReducers, pending/fulfilled/rejected | — |
| RTK Query Setup and API Slice | RTK Query, createApi, fetchBaseQuery, API reducer and middleware | — |
| Query Endpoints and useQuery Hooks | RTK Query, useGetUsersQuery, loading, error, data | — |
| Caching and Cache Tags | RTK Query, providesTags, invalidatesTags, cache invalidation | — |
| Mutations with useMutation | RTK Query, builder.mutation, useMutation, POST/PUT/DELETE | — |
| Optimistic Updates | RTK Query, optimistic updates, onQueryStarted, rollback | — |
| API and Local State Together | Redux, RTK Query, slice + API in one store, filtering/sorting | — |
| Error and Loading UX | RTK Query, loading state, error state, retry, UX | — |
| Query with Parameters and Detail View | RTK Query, parameterized query, getPostById, useGetPostByIdQuery, skip option, detail view | — |

## 📋 Challenge Workflow

1. **Read the challenge** in `challenges/{challenge-id}/README.md` (it has all instructions, including wiring and exports)
2. **Create or update** code in `src/store/`, `src/api/`, or `src/components/` as the README says
3. **Run the app** (`npm run dev`) when it builds; verify visually
4. **Run review** (`npm run review`) to get scored

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Playwright)

**Out of the box:** Chromium is installed automatically after `npm install` (postinstall script) so E2E and review work without extra steps. To skip browser download (e.g. in CI with cached browsers), set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` before `npm install`.

**Run E2E tests:**
```bash
npm run test:e2e
```

**If E2E fails with "Executable doesn't exist":** run `npm run setup:e2e` (installs Chromium only). Or from repo root run `npm run setup` to install for all courses.

E2E tests verify visual output and user interactions. When the review runs E2E, it starts the app on port **5174** (CI) to avoid conflict with a dev server on 5173.

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
├── src/                    → Your code goes here
│   ├── store/              → Redux store, hooks, slices (you add slices in challenges)
│   ├── api/                → Mock API and (from Ch06) RTK Query API slice
│   ├── components/         → React components used by challenge routes
│   └── ...
├── challenges/             → Challenge definitions
│   ├── 01-store-setup/
│   ├── 02-first-slice/
│   ├── 03-reading-dispatching/
│   └── ...
├── tests/                  → Test files
│   ├── challenge-*.test.tsx  → Unit tests
│   └── e2e/                → E2E tests (Playwright)
└── package.json
```

## 🎯 Important Notes

- **This is a real app** - you can see your changes immediately
- **Visual verification first** - run the app to confirm features work
- **Then get scored** - run review for comprehensive evaluation
- **Tests verify requirements** - they check technical correctness, not just visual appearance

## 🔍 Review Output

Results are saved to `../results/`:
- `challenge-results.json` - Individual challenge scores
- `course-summary.json` - Overall course summary
- `ai-feedback.json` - AI review feedback
