# Challenge 12: Categories and Tags

**Work on this challenge only.** You've completed Challenge 11 (debounced search). Now read this README and implement this step. Do not remove any code from earlier challenges.

## Goal

Add **category** (single) and **tags** (array of strings) to tasks. Extend TaskForm, TaskCard, and FilterBar to support them. Filter by category in addition to All/Active/Completed. Persist in localStorage.

## What to do

1. **Task type** — Extend the task object: add `category: string` and `tags: string[]`. Default category (e.g. "General") and empty array for new tasks. Ensure existing tasks without these fields are handled (defaults when loading from localStorage).

2. **TaskForm** — Add a category dropdown (options: e.g. "General", "Work", "Personal" or dynamic from existing categories). Add a tags input: user types comma-separated values; parse into an array (e.g. `"a, b, c"` → `["a","b","c"]`). Trim and filter empty strings.

3. **TaskCard** — Display category and tags. Show tags as badges (e.g. small pills or spans with `data-tag` or class). Use `id="task-category"` and a container with `id="task-tags"` for tests.

4. **FilterBar** — Add a category filter dropdown. Options: "All categories" plus all unique categories from the current tasks. Filter the list by selected category (in addition to All/Active/Completed and search). Combine: status filter → category filter → search → sort.

5. **Unique categories** — Derive the list of categories from tasks: `[...new Set(tasks.map(t => t.category).filter(Boolean))]` (or similar). Use this for the category dropdown in the form and in FilterBar.

6. **Persist** — Ensure category and tags are saved and loaded with tasks in localStorage (Challenge 10 logic should already persist the full task object).

7. **Route and wiring** — Ensure the route `/challenge/12-categories-and-tags` shows FilterBar (App passes `showFilterBar` to TaskApp) so the category dropdown and search appear.

8. **Code** — TypeScript, functional components, no `console.*`, pass ESLint.

## Review

Tests check: tasks have category and tags; category filter works with other filters; tags display as badges; can add tasks with multiple tags; category dropdown shows existing categories; data persists. Pass threshold: **≥ 80%**.

## Verify

- `npm run dev` → open `/challenge/12-categories-and-tags` → add task with category and tags; filter by category; refresh → data persists.
- `     
`
