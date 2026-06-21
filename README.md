# Challenge Engine – Learner Guide

**Step-by-step guide to run challenges, get scored, and keep your repo in sync with course updates.**

---

## Step 1: Clone the repository

Clone this repo to your computer (if you haven’t already):

```bash
git clone https://github.com/sparkplustech/challenge-engine-react.git
cd challenge-engine-react
```

---

## Step 2: Create your own GitHub repo (for your work)

You need a **personal GitHub repo** where you will push your challenge work. The course repo is **upstream** (read-only for you); your repo is **origin** (where you push).

1. Go to [GitHub](https://github.com) and sign in.
2. Click **“+”** (top right) → **“New repository”**.
3. Choose a name (e.g. `my-challenge-engine`).
4. Leave it **empty** (no README, no .gitignore).
5. Click **“Create repository”**.
6. On the new repo page, click the green **“Code”** button.
7. Copy the **HTTPS URL** (e.g. `https://github.com/YOUR_USERNAME/my-challenge-engine.git`).  
   You will use this as your **origin** URL.

---

## Step 3: Run setup (one time)

From the **repo root** (the folder that contains `package.json`):

```bash
npm run setup
```

This will:

- Install all dependencies (dashboard, course projects, review engines).
- Install Playwright browsers (for E2E tests).
- Add the **upstream** remote (course repo).
- If you cloned the course repo, it will **ask you for your GitHub repo URL** — paste the URL you copied in Step 2. That sets **origin** to your repo.

If setup doesn’t ask for your URL, set it manually after setup (see Step 4).

**Takes about 3–5 minutes.**

---

## Step 4: Set Git remotes (if needed)

You want:

- **origin** → your repo (where you push your work).
- **upstream** → course repo (where you pull updates).

Check your remotes:

```bash
git remote -v
```

You should see:

- **origin** → your repo URL (e.g. `https://github.com/YOUR_USERNAME/my-challenge-engine.git`)
- **upstream** → `https://github.com/sparkplustech/challenge-engine-react.git`

**If origin still points to the course repo**, set it to your repo:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repo name.

**If upstream is missing**, add it:

```bash
git remote add upstream https://github.com/sparkplustech/challenge-engine-react.git
```

---

## Step 5: Start the dashboard and a course

**Terminal 1 – Dashboard** (keep running):

```bash
npm run dashboard:build
npm run dashboard
```

Dashboard runs at **http://localhost:7700**. Use it to browse challenges and run reviews.

**Terminal 2 – Course app** (pick one):

```bash
cd courses/01-react-fundamentals/project
npm run dev
```

Or for other courses:

```bash
cd courses/02-redux-rtk-query/project && npm run dev
cd courses/03-nextjs-app-router/project && npm run dev
```

The course app opens in your browser (e.g. http://localhost:5173 or http://localhost:3000).

---

## Step 6: Work on a challenge

1. In the dashboard (http://localhost:7700), open a course and a challenge, or open the challenge README in your editor (e.g. `courses/01-react-fundamentals/project/challenges/01-static-task-display/README.md`).
2. Edit code in the course project (`src/` or `app/`). Save and see changes in the browser (hot reload).
3. Run a review to get scored:
   - **From dashboard:** Open the challenge → click **“Run review”**.
   - **From terminal:** In the course project folder, run:
     ```bash
     npm run review -- --challenge=01-static-task-display
     ```
4. Check the score. Pass = 80% or higher. Fix issues and run review again until you pass.

---

## Step 7: Push your work to your repo

When you want to save your progress to **your** GitHub repo:

```bash
git add .
git commit -m "Complete challenge 01-static-task-display"
git push -u origin main
```

Use the branch name you use (e.g. `main` or `master`). After the first push with `-u origin main`, you can use:

```bash
git push
```

---

## Step 8: Get latest courses and updates (pull from upstream)

When the course team adds new challenges or fixes and you want to **take all their changes** and **overwrite your copy** wherever there are conflicts, use the sync-upstream script.

**Option A – One command (recommended):**

```bash
npm run sync-upstream
```

This script:

1. Saves your current work in a commit (if you have uncommitted changes).
2. Fetches and merges from upstream.
3. On any conflict, **accepts upstream’s version** — your conflicting changes are **overwritten** by the course repo’s version. Use this when you want to always take the course team’s updates.

Then push to your repo if you want:

```bash
git push origin main
```

**Option B – Manual:**

```bash
git add .
git status
git commit -m "WIP before pull"   # only if you have changes
git fetch upstream
git merge upstream/main -X theirs
```

`-X theirs` means: when there’s a conflict, keep the upstream version.

**After pulling**, if new courses were added, run setup again so their dependencies are installed:

```bash
npm run setup
```

---

## Quick reference

| What you want to do        | Command |
|----------------------------|--------|
| First-time setup           | `npm run setup` |
| Start dashboard            | `npm run dashboard:build` then `npm run dashboard` |
| Start a course app         | `cd courses/01-react-fundamentals/project && npm run dev` |
| Run review for one challenge | `npm run review -- --challenge=01-static-task-display` (from course project) |
| Push your work             | `git add . && git commit -m "..." && git push origin main` |
| Get latest from course repo (merge and overwrite conflicts with upstream) | `npm run sync-upstream` |

---

## Troubleshooting

**“concurrently” or “command not found”**  
→ Run `npm run setup` from the repo root (installs root dependencies).

**E2E tests fail or “Executable doesn’t exist”**  
→ Run `npm run setup` again; it installs Playwright browsers. Or from a course project: `npx playwright install`.

**Review score 0% or tests fail**  
→ Make sure you ran `npm run setup` and you’re in the correct course project folder when running `npm run review`.

**Origin / upstream wrong**  
→ Use `git remote -v` to check. Set origin: `git remote set-url origin YOUR_REPO_URL`. Add upstream: `git remote add upstream https://github.com/sparkplustech/challenge-engine-react.git`.

**Merge conflicts when pulling**  
→ Use `npm run sync-upstream` to accept all upstream changes, or run `git merge upstream/main -X theirs` after `git fetch upstream`.

---

## What gets scored

Each challenge is scored by:

- **Functional tests** (Vitest)
- **Code quality** (ESLint)
- **Architecture** (required patterns)
- **Best practices**
- **E2E tests** (Playwright)
- **AI review** (optional, needs API key)

**Pass = 80% or higher.** Only what’s listed in each challenge’s README (Technical Requirements) is checked; there are no hidden requirements.

---

## More info

- **Dashboard:** [dashboard/README.md](./dashboard/README.md)
- **Scripts:** [scripts/README.md](./scripts/README.md)
- **AI review (optional):** Create `.env` in repo root with `GROQ_API_KEY=your_key`. Get a key at https://console.groq.com

---

**Happy learning.**






































































































































































































## 📈 Progress Summary

**Last updated:** 21/6/2026, 1:03:19 pm

### Pathway

| Metric | Value |
|--------|-------|
| Challenges completed | 18 / 53 (34%) |
| Overall score | 27% |

### By course

| Course | Completed | Score | Status |
|--------|-----------|-------|--------|
| React Fundamentals | 18/23 (78.3%) | 81.7% | Pass |
| Redux & RTK Query | 0/13 (0%) | 0% | Pass |
| Next.js App Router | 0/17 (0%) | 0% | Pass |

