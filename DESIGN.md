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

One accent only, and it is **restrained**: the user rejected a giant lime surname as too loud, so the name is chalk and lime is spent on the CTA, the availability dot, small markers, focus/hover state and one ring of the 3D object. It is never decoration.

## Type

- **Display:** Instrument Serif 400 (+ italic) — headlines, project titles, the closing line. Italic is the emphasis register, not bold.
- **Grotesk:** Inter Tight — body, UI, wordmark.
- **Mono:** JetBrains Mono, uppercase, `0.16–0.22em` tracking — indices, meta, links, the availability line. Never body copy.

Scale is fluid (`clamp()`), display leads at `0.86–0.92`, tracking tightens as size grows (`-0.02em` to `-0.035em`).

## The hero

Mobile-first: one column, portrait first, then type. From `lg` up it becomes two columns — type left, portrait right.

- **One circular portrait.** `rounded-full`, 15rem on mobile → 23rem on desktop. `object-position: 52% 38%`, chosen by sweeping 20/26/32/38/44% and measuring where skin pixels land (head top ~12–15%, face centred). Computed, not eyeballed — the agent has no vision. There is no second photograph anywhere on the site; About is text-only.
- **The name** is two lines — `Ashar` and an italic `Qaisar`, both chalk — entering with a staggered blur-in (`animate-blur-in`, `filter: blur(14px)` → 0), delays 60→660 ms.
- One soft lime bloom behind the portrait at 10% opacity. It is the only glow on the site.
- A scroll cue (lime bar in a hairline track) sits bottom-centre on desktop only.

### The 3D object: a gyroscope, not a sculpture

The user's original brief asked for 3D; the brass obelisk was rejected as out of place on a portfolio, and deleting 3D entirely was also wrong. The answer is `components/scene/Gyroscope.tsx`: three rings on different axes orbiting the portrait — two steel (`#cbd5e1`, `#94a3b8`), one lime (`#aef33f`), radii 1.134 / 1.339 / 1.577.

- The canvas **overhangs the portrait by 45%** (`-inset-[45%]`) so the rings sit outside the circle instead of hidden behind it. Ring radii are tuned against that ratio: the portrait edge falls at ~0.53 of the half-height, the rings at 0.66 / 0.78 / 0.92.
- Lit only by local `<Lightformer>`s inside `<Environment frames={1}>` — lime key upper right, cool steel rim behind-left, soft uplight. No HDR fetch, no network cost.
- Lean toward the pointer, damped (`MathUtils.damp`, λ 2.2), capped at 0.42 rad so the silhouette never breaks.

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

One editorial measure, not a card grid. Sections are separated by hairlines (`chalk` at 11% on void) and generous vertical rhythm (`py-28` → `py-40`). Work is a typographic index — number, title in display, discipline/year, one-line blurb — with a cursor-following plate instead of thumbnails. Max content width 1440px, gutters 24px → 40px.

Radius is the one change the new theme brings to that grammar: `--radius-card` 1.25rem, `--radius-frame` 2rem. It applies to frames, chips and the CTA — not to section edges.

## Assets

- `app/icon.svg` — diamond mark, void ground, chalk stroke, lime core.
- `app/opengraph-image.png` (1200×630) — generated by `scripts/og-card.py` (Pillow) from the real Instrument Serif / JetBrains Mono faces in `fonts/`. Regenerate with `python3 scripts/og-card.py`; do not hand-edit the PNG.
- `public/ashar-portrait.jpg` — EXIF/GPS stripped, 1000px wide.
- `inspiration/` — the 21st.dev research (theme CSS, component previews, `lookbook.png`) kept as the record of how the theme was chosen.

## Banned by default

The craft floor holds: no icon+heading+text card grids, no nested cards, no eyebrow/kicker labels above headings, no gradient text, no decorative glassmorphism, no colored `border-left` stripes, no hard offset shadows, no emoji or Unicode glyphs as icons, no system display faces, no one-identical-entrance on every section, no bounce/elastic easing, and no animating `width`/`height`/`padding`. Browser surfaces are themed: lime selection, lime caret, lime focus ring, custom scrollbar, film grain.

A pinned brief can override any of these. Habit cannot.
