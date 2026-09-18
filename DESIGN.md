# DESIGN.md — void ground, single lime accent

The visual system for Ashar Qaisar's hiring portfolio (web). Surface mode: **Persuade**, leaning **Experience** in the projects index. There is no 3D on this site.

## Why this world

The previous world (Monolith: near-black ink, molten brass, a lathed 3D obelisk) was rejected by the user on two counts — the sculpture "looked out of place" on a personal portfolio, and the warm brass theme "didn't match". The replacement was chosen by the user from 21st.dev: the theme **Portfolio Pro Dark** (https://21st.dev/community/themes/portfolio-pro-dark-1786881610971), dark half, adopted as **tokens only** — the sections are hand-built, not installed components.

Two values in that theme's source are junk and are deliberately ignored: `--shadow-color: #ff0000` and `--letter-spacing: 0.28em`.

## Ground and palette

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#020617` | page ground |
| `void-2` | `#0f172a` | raised surface (cards, portrait frame fill) |
| `void-3` | `#1e293b` | muted fill, borders, scrollbar thumb |
| `chalk` | `#f8fafc` | primary type |
| `mute` | `#94a3b8` | body copy, labels |
| `lime` | `#aef33f` | the single accent — CTA, focus, hover, live state, one 3D ring |
| `lime-deep` | `#16532e` | accent fill where lime would be too loud |
| `on-lime` | `#000000` | type on lime |

One accent only, and it is **restrained**: the user rejected a giant lime surname as too loud, so the name is chalk and lime is spent on the CTA, the availability dot, small markers, focus/hover state and the sweep ring of the 3D object. It is never decoration, and it never touches the portrait.

## Type

- **Display:** Instrument Serif 400 (+ italic) — headlines, project titles, the closing line. Italic is the emphasis register, not bold.
- **Grotesk:** Inter Tight — body, UI, wordmark.
- **Mono:** JetBrains Mono, uppercase, `0.16–0.22em` tracking — indices, meta, links, the availability line. Never body copy.

Scale is fluid (`clamp()`), display leads at `0.86–0.92`, tracking tightens as size grows (`-0.02em` to `-0.035em`).

## The hero

Mobile-first: one column, portrait first, then type. From `lg` up it becomes two columns — type left, portrait right.

- **One circular portrait.** `rounded-full`, 15rem on mobile → 23rem on desktop. `object-position: 52% 38%`, chosen by sweeping 20/26/32/38/44% and measuring where skin pixels land (head top ~12–15%, face centred). Computed, not eyeballed — the agent has no vision. There is no second photograph anywhere on the site; About is text-only.
- **The name** is two lines — `Ashar` and an italic `Qaisar`, both chalk — entering with a staggered blur-in (`animate-blur-in`, `filter: blur(14px)` → 0), delays 60→660 ms.
- One ambient wash behind the portrait at 10% opacity, neutral steel rather than lime — the brief is *the portrait and the rings*, so nothing green sits near the photo.
- A scroll cue (lime bar in a hairline track) sits bottom-centre on desktop only.

### The 3D object: a gyroscope, with the portrait inside it

The user's original brief asked for 3D; the brass obelisk was rejected as out of place on a portfolio, and deleting 3D entirely was also wrong. The answer is `components/scene/Gyroscope.tsx`: a ring system with **the portrait as a textured disc at its centre**.

**The portrait is part of the scene, not layered behind it.** An earlier version painted the canvas behind an `<img>`, which sliced every ring off at the photo's edge — two objects stacked, not one composition, and the user called it out. Now the photo is a `circleGeometry` disc textured with `/ashar-portrait.jpg`, so WebGL occludes correctly: the sweep ring's near arc passes in front of the photo, the far arc disappears behind it.

- **Sweep ring** (lime, R 1.22, tilt `-1.15` about X): the one that crosses the portrait. Its near arc rides at y ≈ -0.48 — inside the photo's 0.901 radius — at z ≈ +1.11, so it passes in front across the lower third, clear of the face. Verify with a lime-pixel count inside the photo radius: ~15 meant "still two layers", ~415 means it reads as one object.
- **Orbit rings** (steel `#cbd5e1` R 1.577, `#94a3b8` R 1.339, `#94a3b8` R 1.134): sit clear of the photo on different axes.
- **No bezel and no lime bloom.** Both were tried and removed at the user's request — the brief now is simply *the portrait and the rings*. Verified by sampling lime pixels in a band at the photo's radius: a bezel lights all 12 angular sectors evenly, the current build lights 3 and leaves 3 empty.
- **Rim shade**: a procedural radial-gradient overlay, transparent across the face and easing to the void colour at the edge, so the photo dissolves into the ground instead of being a cut-out circle.
- The canvas **overhangs the portrait by 45%** (`-inset-[45%]`), giving the rings room outside the circle. At camera z 5.6 / fov 34 the half-height is 1.712 world units, so the photo radius in scene units is 0.526 × 1.712 = **0.901** — keep `PORTRAIT_R` in step with that inset ratio or the disc will not cover the `<img>` beneath it.
- The photo texture is UV-cropped (`repeat.y 0.6177`, `offset.y 0.2372`) to match the CSS crop `object-position: 52% 38%`. v is measured from the bottom because three.js uploads textures flipped.
- Lit only by local `<Lightformer>`s inside `<Environment frames={1}>` — lime key upper right, cool steel rim behind-left, soft uplight. No HDR fetch, no network cost.
- Lean toward the pointer, damped (`MathUtils.damp`, λ 2.2), capped at 0.42 rad so the silhouette never breaks.

**Layering:** the `<img>` stays in the DOM underneath as the no-WebGL fallback and as a guarantee the portrait never disappears; the canvas sits on top (`z-10`) and fades in only once the texture has decoded, so there is never a flash of rings over a bare photo.

## Motion and performance

Mobile is the primary target — most of this user's clients open the page on a phone — so the 3D is built to be cheap before it is built to be pretty:

- `dpr` capped at `[1, 1.5]` under 640px, `[1, 1.75]` above; antialiasing off on mobile.
- Ring segment counts drop from 176×14 to 96×10 under 640px — that is the entire poly budget.
- `Environment` resolution 64 on mobile vs 128 on desktop, baked once (`frames={1}`).
- An `IntersectionObserver` sets `frameloop="demand"` the moment the hero scrolls away, so nothing renders offscreen; it resumes on scroll back.
- No WebGL (or a failed probe) → `StaticRings`, the same three rings as flat SVG.
- Under `prefers-reduced-motion` the loop runs `demand` and the form **snaps** to its composed pose — damping would freeze it mid-ramp, which was a real bug in the earlier sculpture.
- The only other continuous rAF loop is the projects cursor plate (spring lerp 0.11), and it runs only while a row is hovered, on fine pointers ≥1024px.
- Tap targets are ≥48px on the hero CTAs; the layout never overflows at 390px.

## Layout

One editorial measure, not a card grid. Sections are separated by hairlines (`chalk` at 11% on void) and generous vertical rhythm (`py-28` → `py-40`). Work is a typographic index — number, title in display, discipline/year, one-line blurb — with a 16:10 artwork plate per project: full width above the blurb on mobile, a right-hand column from `md` up, and a larger cursor-following plate on fine pointers ≥1024px. Max content width 1440px, gutters 24px → 40px.

Radius is the one change the new theme brings to that grammar: `--radius-card` 1.25rem, `--radius-frame` 2rem. It applies to frames, chips and the CTA — not to section edges.

## Assets

- `app/icon.svg` — diamond mark, void ground, chalk stroke, lime core.
- `app/opengraph-image.png` (1200×630) — generated by `scripts/og-card.py` (Pillow) from the real Instrument Serif / JetBrains Mono faces in `fonts/`. Regenerate with `python3 scripts/og-card.py`; do not hand-edit the PNG.
- `public/ashar-portrait.jpg` — EXIF/GPS stripped, 1000px wide.
- `inspiration/` — the 21st.dev research (theme CSS, component previews, `lookbook.png`) kept as the record of how the theme was chosen.

## Project imagery

`public/projects/*.jpg` are third-party dashboard screenshots, chosen for topical fit and then graded to the palette (centre-cropped to 16:10, 1600×1000, 12% desaturated, 10% darker, soft vignette) so they sit inside the void ground instead of shouting.

- `agent-framework.jpg` — an ML model-monitoring dashboard (dark UI), for the LLM deployment work.
- `spectr.jpg` — Palscope, an OSINT investigation tool, for SPECTR.
- **Kiku carries no image.** The user asked for no generated art for it, and there is no honest capture of it to hand, so the row is type-only by design.

**These are not Ashar's own screens.** That was flagged before they were used and the decision was the user's. The standing recommendation is unchanged: swap in real captures of the actual projects when they exist — a recruiter cannot be misled by a genuine screenshot. `uploads/proj-agent-portfolio.png` is a real 1440×900 capture of asharfolio.vercel.app, ready to drop in.

**Do not regenerate "abstract" artwork for this section.** It was tried and rejected: a node graph and a radar plate, generated by script. If generative plates are ever revisited, two lessons held: draw bold (these display at ~320–368px, where a 2px hairline vanishes — size strokes as fractions of canvas height), and never build a bloom from concentric filled circles, because stacking alpha saturates the centre into a blob that swallows the linework.

## Banned by default

The craft floor holds: no icon+heading+text card grids, no nested cards, no eyebrow/kicker labels above headings, no gradient text, no decorative glassmorphism, no colored `border-left` stripes, no hard offset shadows, no emoji or Unicode glyphs as icons, no system display faces, no one-identical-entrance on every section, no bounce/elastic easing, and no animating `width`/`height`/`padding`. Browser surfaces are themed: lime selection, lime caret, lime focus ring, custom scrollbar, film grain.

A pinned brief can override any of these. Habit cannot.
