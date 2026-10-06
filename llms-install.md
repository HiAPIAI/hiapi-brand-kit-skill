# Agent installation

1. Install: `npx -y github:HiAPIAI/hiapi-brand-kit-skill -y` (or `--codex`, `--claude`, `--target=/path/to/skills`).
2. Set `HIAPI_API_KEY` in the environment that starts the agent (https://www.hiapi.ai/en/dashboard/api-keys).
3. Needs Node 18+ and Google Chrome or Chromium (set `CHROME_PATH` if it is not in a standard place).
4. Read `SKILL.md` and `references/logo.md`. Draw the logo as SVG and render it before any paid call.
5. Run the mockup plan with `--dry-run` and tell the user the estimate; check every mockup against the logo.
6. Never publish anything; hand over the files.
