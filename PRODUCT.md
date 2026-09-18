# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.3.5 (App Router, Turbopack) · React 19.2 · TypeScript strict · Tailwind CSS v4 (CSS-first `@theme`) · three.js + @react-three/fiber + @react-three/drei for the hero sculpture. npm. Delegated to the agent at scaffold time; confirmed by the user at the first build.

The social card is pre-rendered to `app/opengraph-image.png` by `scripts/og-card.py` (Pillow) rather than generated at request time: `next/og` throws `failed to pipe response / reading '256'` under Turbopack dev here, and this sandbox cannot run a production build (2 GB RAM, no swap).

## Users

Hiring managers, CTOs, and technical recruiters looking for someone who can actually run LLM infrastructure — not someone who has only used an API. They skim for proof in under a minute: what has shipped, what stack, can I reach them. Secondary reader: the founder or lead who wants one person to own an AI feature end to end.

## Product Purpose

Get Ashar shortlisted and contacted. Success is a recruiter or engineering lead reaching out with a real role — an email, a call, or a LinkedIn message — not traffic.

## Positioning

Most candidates can call an API. Ashar stands up the endpoint: local inference with Ollama, hosted inference on NVIDIA NIM, agent frameworks, and the full-stack surface on top. The claim a generic applicant cannot truthfully copy: he owns the unglamorous middle — containerisation, process supervision, deployment, cost and latency — that turns a demo into something that stays up.

## Operating Context

Gujranwala, Punjab, Pakistan (GMT+5), remote. Self-employed since 2019 and freelance now, so availability is genuine rather than a notice period. Client lifecycle handled end to end, sourced through Upwork and Contra.

## Capabilities and Constraints

Capabilities, all as stated on the CV: LLM deployment (Ollama, Open WebUI, NVIDIA NIM API), autonomous agent frameworks (Hermes Agent, OpenClaw), Python ML and automation, REST API work in FastAPI and Node, Linux/Ubuntu/Kali administration, Docker, PM2, Git, and frontend delivery on Netlify and Vercel.

Constraints and open decisions:
- **Every fact on the page must trace to the supplied CV.** No invented employers, dates, metrics, or client names. The single work history entry is "Freelance, Self-employed, 2019–Present" because that is what the CV says.
- The CV supplies **no hard numbers** — no request volumes, latency figures, headcounts, or revenue. The page therefore leans on named tools and shipped URLs (asharfolio.vercel.app, kikuplayer.netlify.app) instead of invented metrics. If Ashar supplies real figures later, they belong in Experience.
- **The portrait crop is computed, not eyeballed** (`object-position: 52% 38%`, hero only). It was chosen by sweeping 20/26/32/38/44% and measuring where skin pixels land — head top ~12-15%, face centred. Ashar should still confirm, since the agent has no vision. There is one photograph on the site: About is text-only, because the user found two portraits of the same photo repetitive.
- The hero 3D object must degrade: static SVG rings with no WebGL, snapped pose under `prefers-reduced-motion`, and a paused render loop offscreen. It must be cheap on mobile first — most of this user's clients view on a phone.
- `metadataBase` falls back to a placeholder domain until `NEXT_PUBLIC_SITE_URL` is set.

## Brand Commitments

Name: Ashar Qaisar. Voice: plain, specific, confident, allergic to hype — short sentences, concrete tools, no adjective stacks. The wordmark is the name set in the grotesk with wide tracking; the identity row carries a small framed portrait.

Visual world is fixed in [DESIGN.md](./DESIGN.md) — void ground `#020617`, chalk type, one lime accent `#aef33f`, editorial serif display, and no 3D (the user rejected the previous sculpture and warm-brass theme). Any brief that contradicts it must say so explicitly.

## Evidence on Hand

One CV (`uploads/Ashar_Qaisar_ML_AI_Engineer_Resume.pdf`) and one photograph (`uploads/Screenshot_20260812-192433~3.jpg`). That is the entire evidence base. Everything else on the site — project descriptions, certification names, education, contact details — is transcribed from it. Nothing is inferred or embellished.
