# AGENTS.md

**Read [`agent.md`](./agent.md) in full before doing any work in this repo.** It is the canonical rules file — project snapshot, hard rules, installed skills, MCP servers, conventions, and the definition of done.

Condensed version, for orientation only (agent.md wins on every detail):

1. **Read before writing** — trace the flow, grep every caller, fix root causes.
2. **Lazy first (ponytail)** — YAGNI → reuse what exists → stdlib/platform → installed deps → one line → minimum code. Deletion over addition.
3. **No new dependency, abstraction, or file without asking.**
4. **Verify library APIs with context7 MCP** before writing them; never from memory.
5. **Verify before "done"** — `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm test`. Say it out loud when a check can't run.
6. **Smallest complete diff**, one concern per change.
7. **UI work goes through the impeccable skill + 21st MCP** — no AI-default visual slop (banned list in agent.md §4).
8. **Secrets stay in `.env`**, never in the repo or in logs.
9. **Ship states** — hover, focus-visible, disabled, loading, error, empty; keyboard reachable; contrast ≥4.5:1.
10. **No unrequested prose or files.** Report: what changed → what was skipped → when to add it. ≤3 lines.

Stack: Next.js 16.x App Router · React 19.x · TypeScript strict · Tailwind CSS v4 (CSS-first config).

Skills live in `.claude/skills/` and `.agents/skills/` (`ponytail*`, `impeccable`). MCP servers are declared in `.mcp.json` (`context7`, `21st`).
