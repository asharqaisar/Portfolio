# agent.md — rules for every AI coding agent working in this repo

> **Canonical rules file.** If you are an AI agent (or a human) touching this project, read this file fully before your first edit. It is the single source of truth; `AGENTS.md` and `CLAUDE.md` just point here.
> Last reviewed: 2026-09-18. Skills pinned at ponytail `e3ba2aa`, impeccable `f2c7051`.

---

## 0. Project snapshot

| Item | Value |
| --- | --- |
| Framework | Next.js 16.3.5 — **App Router only** (no `pages/`) |
| UI | React 19.2 (pinned: R3F 9 requires `<19.3`), TypeScript `strict: true` |
| Styling | Tailwind CSS v4.x (CSS-first config, `@theme`, no `tailwind.config.js`) |
| 3D | three.js + @react-three/fiber + @react-three/drei (hero sculpture only) |
| Package manager | npm (swap the commands below if you move to pnpm/bun — don't mix lockfiles) |
| State | Start local/server-first. Add a store only when props can't carry it. |
| Status | Portfolio live: hero (portrait-led, no 3D), about, stack, experience, projects, credentials, contact |
| Authorities | [`PRODUCT.md`](./PRODUCT.md) (product truth) · [`DESIGN.md`](./DESIGN.md) (visual world) |

Expected layout once the app exists:

```
app/                      layout.tsx (fonts, metadata), page.tsx (section order), globals.css (@theme)
components/               Nav · Hero · HeroScene · About · Stack · Experience · Projects · Credentials · Contact · Reveal · Grain
components/scene/         Gyroscope.tsx — the WebGL rings (client only)
fonts/                    Instrument Serif + JetBrains Mono (OFL), read by scripts/og-card.py
.eslintrc → eslint.config.mjs (flat config, extends eslint-config-next)
```

**Before any UI work:** read [`DESIGN.md`](./DESIGN.md) — it owns the palette, type, layout rhythm and the banned-pattern list. Read [`PRODUCT.md`](./PRODUCT.md) for what may be claimed as proof (short answer: only the CV — no metrics, no client names).

---

## 1. Hard rules (non-negotiable)

1. **Read before you write.** Trace the real flow end to end — every file the change touches, every caller of the function you're editing (`grep` them). A small diff you don't understand is not efficiency, it's a second bug. Fix root causes in the shared function, not symptoms at one call site.
2. **Lazy first (ponytail).** Stop at the first rung that holds: (a) does this need to exist at all? (b) does it already exist in this codebase? (c) does the standard library / React / Next.js do it natively? (d) does an already-installed dependency do it? (e) can it be one line? (f) only then write the minimum that works. Deletion beats addition. Boring beats clever.
3. **No new dependency without asking.** `npm i <anything>` requires explicit approval, with one line on why the stdlib/platform can't do it. No abstraction that wasn't requested: no interface with one implementation, no factory for one product, no config for a value that never changes.
4. **Docs before guessing.** Before using any library API you are not certain about — Next.js, React, Tailwind, a new package — call **context7** and read the real docs. Never ship an API you inferred from memory; hallucinated APIs are the most common silent failure here.
5. **Verify before you say "done".** Run the checks (§5). "It should work" is not done. If a check can't run, say so explicitly instead of implying it passed.
6. **Smallest complete diff.** One concern per change. No drive-by refactors, no reformatting files you didn't need to touch, no "while I'm here" migrations.
7. **UI work goes through impeccable + 21st MCP.** Never hand-roll a generic-looking component when a curated one exists, and never ship AI-default visual slop (§4, banned list below).
8. **Secrets never touch the repo.** Keys live in `.env` (gitignored) or the environment. Read them via `process.env`. Never log them, never hardcode them, never commit `.env`. Validate env at the boundary.
9. **Ship states, not happy paths.** Every interactive surface gets hover, focus-visible, disabled, loading, error, and empty states. Keyboard reachable, contrast ≥4.5:1 for body text. This is part of the work, not a follow-up.
10. **No unrequested output.** No extra files, no boilerplate "for later", no essays. Explain in ≤3 lines unless a report was explicitly asked for.
11. **Git hygiene.** Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`). Never force-push or `--hard`-reset without asking. Never commit `.env`, lockfile churn from a different package manager, or build output.
12. **Ask when blocked or genuinely ambiguous** — surface the question with your recommendation and keep moving on everything else. Don't stall, don't silently guess on decisions that are expensive to reverse.

**Never simplify away** (ponytail does not apply): input validation at trust boundaries, error handling that prevents data loss, security, accessibility basics, and anything explicitly requested.

---

## 2. Skills installed

Installed into `.claude/skills/` (Claude Code) and `.agents/skills/` (Codex, OpenCode, Copilot-style agents). Re-run `node scripts/install-skills.mjs` to update.

### 🐴 Ponytail — lazy senior dev mode

- **Files:** `.claude/skills/ponytail/`, `.claude/commands/ponytail*.md`
- **Always on** via §1.2 of this file. Levels: `lite` (do it, name the lazier alternative) · `full` (default, enforce the ladder) · `ultra` (YAGNI extremist, deletion before addition) · `off` (`normal mode`).
- **Switch:** `/ponytail lite|full|ultra|off` — persists for the session.
- **Also installed:** `/ponytail-review` (hunt over-engineering in a diff) · `/ponytail-audit` (whole-repo ranked list of what to delete) · `/ponytail-debt` (ledger of `ponytail:` shortcut comments) · `/ponytail-gain` (impact scoreboard) · `/ponytail-help`.
- **Mark deliberate shortcuts** that cut a real corner with a known ceiling:
  `// ponytail: in-memory cache, swap for Redis if we run >1 instance`
- **Lazy code without its check is unfinished.** Non-trivial logic leaves one runnable check behind — the smallest test that fails if the logic breaks. No test frameworks or fixtures unless asked. Trivial one-liners need no test.

### ✨ Impeccable — frontend design craft

- **Files:** `.claude/skills/impeccable/` (`SKILL.md`, `reference/`, `scripts/`), subagents in `.claude/agents/`
- **Use for:** any UI task — build, redesign, critique, audit, polish, animate, typeset, layout, adapt, harden, optimize, onboard, extract design tokens.
- **Session setup:** run `.claude/skills/impeccable/scripts/impeccable context` once per session (from the project root) before any UI work, then load the matching playbook from `reference/`. The engine binary is cached here; on a fresh machine it downloads ~16 MB on first run. No hook is active in a non-Claude-Code session, so finish with `impeccable detect --json <targets>` (it needs a full Chrome/Chromium/Edge on PATH, not headless-shell).
- **Modes — pick by surface, not by product:** `Persuade` (marketing/landing/pricing) · `Operate` (app UI, dashboards, settings) · `Read` (docs, articles) · `Experience` (portfolios, showcases).
- **Commands:**

  | Group | Commands |
  | --- | --- |
  | Build | `shape [feature]` · `init` (writes `PRODUCT.md`) · `document` (writes `DESIGN.md`) · `extract [target]` |
  | Evaluate | `critique [target]` · `audit [target]` |
  | Refine | `polish` · `bolder` · `quieter` · `distill` · `harden` · `onboard` |
  | Enhance | `animate` · `colorize` · `typeset` · `layout` · `delight` · `overdrive` |
  | Fix | `clarify` · `adapt` · `optimize` |
  | Iterate | `live` (pick elements in browser) · `generate [n] [action] [element]` |

- **Two laws:** the **brief wins** — a pinned aesthetic outranks the skill's taste; and **refinement preserves, redesign replaces** — never split the difference.
- **Hooks:** `.claude/settings.json` runs the impeccable detector after every `Edit`/`Write` and a deep pass on `Stop`. Act on its findings instead of re-auditing manually. Delete the `hooks` block if you want it off.

---

## 3. MCP servers

Config lives in `.mcp.json` (project scope). Check they're connected with `/mcp`.

| Server | Transport | Use it for |
| --- | --- | --- |
| **context7** | stdio, `npx @upstash/context7-mcp@latest` | Live, version-correct docs for any library. Use *before* writing API code you're not 100% sure about. |
| **21st** | HTTP, `https://21st.dev/api/mcp` | Search 10k+ React/Tailwind components, themes, templates, logos; retrieve real code instead of generating generic UI. |

**context7 pattern:** `resolve-library-id` for the package → `get-library-docs` with a focused topic and token budget. Prefer it over recall for Next.js App Router APIs, React 19 hooks, Tailwind v4 syntax, and any package after a major version bump.

**21st pattern:** `search` (metadata is free) → `get_component` (metered, small daily free allowance) → adapt the returned code into our components and design system. With hosted 21st AI enabled you also get `generate` / `iterate_generation`; if AI access is off the server hides those — use search + retrieval and adapt locally, don't retry generation.

**Keys** (`.env`, see `.env.example`):
- `CONTEXT7_API_KEY` — optional, for higher rate limits: <https://context7.com/dashboard>
- `API_KEY_21ST` — **required** for the 21st server: <https://21st.dev/settings/api-keys>. Or run `21st login` for a browser session (`21st whoami`, `21st usage` to verify).
- Restart the agent (or `/mcp reconnect`) after changing keys.

Current account (checked 2026-09-18 with `21st usage --json`): **free tier, 2 component-code retrievals/day, hosted AI generation disabled.** So `search` and `theme` are free and unlimited-ish; `get_component` is metered — spend retrievals deliberately; `generate`/`iterate_generation` are hidden until AI access is enabled, so adapt retrieved code locally instead of retrying generation.

**Also available on the CLI:** `npx @21st-dev/cli@latest search "pricing table"` · `21st get <id>` · `21st add <user>/<slug>` · `21st init --design-context` (creates `.21st/design.json` + `.21st/DESIGN.md`, which impeccable reads) · `21st review <path> --fix` (deterministic local UI review).

---

## 4. Conventions

**Next.js / React**
- Server Components by default. `'use client'` only for state, effects, event handlers, browser APIs — and only on the smallest leaf that needs it.
- Data fetching in the server component that needs it; mutations via Server Actions with `'use server'`. Validate action input at the top of every action.
- Co-locate `loading.tsx` / `error.tsx` with routes that fetch. Use `next/font`, `next/image`, and the App Router `metadata` export rather than ad-hoc equivalents.
- Route handlers only when something outside the app needs an HTTP endpoint.

**TypeScript**
- `strict: true`. No `any` — model the unknown or narrow it. Types for public function signatures; let the rest infer.
- `import type` for type-only imports. Prefer `interface` for shapes, `type` for unions/mapped types.

**Tailwind v4**
- CSS-first config: `@import "tailwindcss";` and `@theme { … }` in `app/globals.css`. Don't create `tailwind.config.js`.
- Tokens (colors, radii, fonts) are CSS variables in `@theme`; reference them via utilities, never hardcode hex values in components.
- No arbitrary values that a token should own. Compose classes in the markup; keep conditional classes readable with `clsx`/`tailwind-merge` if the project has them.

**Design quality — banned by default** (from impeccable's craft floor; a pinned brief can override, your habit can't)
- Grids of identical icon + heading + text cards as the page structure. Nested cards, always.
- Eyebrow/kicker labels above headings. Gradient text. Glassmorphism as decoration. Colored `border-left` stripes on cards. Hard offset shadows outside a neobrutalist world.
- Emoji or Unicode glyphs standing in for an icon system; system fonts (Impact, Arial Black) as the display voice.
- One identical scroll-entrance animation on every section; bounce/elastic easing; animating `width`/`height`/`padding` instead of `transform`/`opacity`.
- Un-themed browser surfaces: text selection, caret, focus rings, scrollbars.

---

## 5. Definition of done

Before reporting any change complete:

```bash
npx tsc --noEmit     # types
npm run lint         # eslint (flat config, next/core-web-vitals + typescript)
npm run build        # production build — needs ≥3 GB RAM; it is SIGKILLed in this 2 GB sandbox
npm test             # tests, if present
```

Sandbox note: `npm run build` cannot complete here (Turbopack and webpack workers both get OOM-killed at 2 GB / 2 vCPU). Run it on your machine or a CI runner; `npm run dev`, `tsc`, and `eslint` all pass here.

Then confirm:
- [ ] Works when run, not just when compiled — exercise the path you changed.
- [ ] Every new interactive element has hover / focus-visible / disabled / loading / error / empty states.
- [ ] No new dependency without approval; no new file that wasn't needed.
- [ ] Library APIs verified against context7 docs, not recall.
- [ ] UI changes pass an impeccable pass (`/impeccable polish <target>`) or the hook's findings are addressed.
- [ ] No secrets, no `.env`, no build output in the diff.
- [ ] Report format: what changed → what you skipped → when to add it. Three lines.

---

## 6. Slash-command quick reference

```
/ponytail [lite|full|ultra|off]     /ponytail-review   /ponytail-audit
/ponytail-debt   /ponytail-gain     /ponytail-help

/impeccable shape [feature]         /impeccable init   /impeccable document
/impeccable critique [target]       /impeccable audit [target]
/impeccable polish [target]         /impeccable bolder|quieter|distill [target]
/impeccable animate|colorize|typeset|layout|delight|overdrive [target]
/impeccable clarify|adapt|optimize|harden|onboard [target]
/impeccable live                    /impeccable generate [n] [action] [element]
```

---

## 7. Setup & maintenance

**Fresh machine, from the repo root:**

```bash
node scripts/install-skills.mjs      # install/update ponytail + impeccable
./scripts/setup-mcp.sh               # wire MCP servers + keys (optional helper)
cp .env.example .env                 # then fill in API_KEY_21ST
21st login                           # alternative to the API key
node scripts/install-skills.mjs --check
```

**Updating skills:** re-run `node scripts/install-skills.mjs` (shallow-fetches upstream `main`, overwrites local copies). Pinned commits are recorded in `.claude/skills/installed-skills.json`.

**Optional — ponytail as an always-on Claude Code plugin** (adds session-start hooks and a statusline; this repo's rules already cover always-on behaviour):
`/plugin marketplace add DietrichGebert/ponytail` → `/plugin install ponytail@ponytail`

---

## 8. Never do

- Commit secrets, `.env`, or anything from `.env.*`.
- `git push --force`, `git reset --hard`, or `rm -rf` outside the project — ever, without explicit approval.
- Add a dependency, a config file, an abstraction, or an `index`-barrel nobody asked for.
- Write a library API from memory when context7 could confirm it in one call.
- Report success on work you didn't run. If verification is impossible, say which check is missing and why.
- Reformat or "improve" files unrelated to the task.
