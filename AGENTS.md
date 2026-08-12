# AGENTS.md

## Cursor Cloud specific instructions

This repo is a static content project — a curated "awesome list" (`README.md`) plus a companion **Astro** website in `website/`. There is **no backend, database, Docker, or long-running API**; the only long-lived service is the Astro dev server.

### Project layout gotchas
- There are **two independent npm packages**: the repo root (`package.json`, quality/lint tooling) and `website/` (the Astro app). They are **not npm workspaces** and each has its own `package-lock.json`, so dependencies must be installed in **both** locations. The update script handles this on startup.
- Root scripts delegate into the website via `npm --prefix website ...` (e.g. `validate:catalog`), so the website deps must be installed for the root `npm test` to pass.
- Node `>=22.12.0` is required (see `engines`).

### Running / testing / building (commands live in the two `package.json` files)
- Dev server: `npm --prefix website run dev`. It serves at **http://localhost:4321/awesome-workbuddy/** — note the `/awesome-workbuddy` base path (from `astro.config.mjs`); the bare `http://localhost:4321/` root returns 404, which is expected, not a bug.
- Root quality checks: `npm test` (runs `lint:awesome` + `validate:catalog`).
- Website unit tests: `npm --prefix website test`.
- Production build: `npm --prefix website run build`.

### Data validation nuance
- `website/scripts/validate-data.mjs` cross-checks `README.md` ↔ `prompts/100-work-efficiency-prompts.json` ↔ recorded runs in `prompts/runs/`. The build runs it in **strict** mode (`check:data`, publication policy), while `validate:catalog` / `check:data:review` run it with `--allow-pending` (review policy). If you add prompts or runs, keep all three sources consistent or these checks fail.
