'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const projects = [
  {
    index: '01',
    title: 'AI Agent Framework & LLM Deployment',
    kind: 'LLM Infrastructure',
    year: 'Live',
    href: 'https://asharfolio.vercel.app',
    host: 'asharfolio.vercel.app',
    blurb:
      'Autonomous agent frameworks and LLM inference endpoints serving local models through Ollama and Open WebUI, with the deployment portfolio around them.',
    plate: 'agents',
  },
  {
    index: '02',
    title: 'SPECTR',
    kind: 'OSINT Dashboard',
    year: '2025',
    href: null,
    host: 'Python · Full-stack',
    blurb:
      'An OSINT dashboard built end to end: Python data processing on the back, a full-stack interface on the front, designed for investigating rather than admiring.',
    plate: 'spectr',
  },
  {
    index: '03',
    title: 'Kiku',
    kind: 'Music Player Web App',
    year: 'Live',
    href: 'https://kikuplayer.netlify.app',
    host: 'kikuplayer.netlify.app',
    blurb:
      'A browser-based music player designed and built from scratch, including the end-to-end deployment pipeline that keeps it on Netlify.',
    plate: 'kiku',
  },
];

const plates: Record<string, React.CSSProperties> = {
  agents: {
    background:
      'radial-gradient(58% 58% at 50% 38%, rgba(174,243,63,0.55) 0%, rgba(174,243,63,0.12) 45%, transparent 72%), repeating-linear-gradient(180deg, rgba(248,250,252,0.10) 0 1px, transparent 1px 7px), #020617',
  },
  spectr: {
    background:
      'repeating-linear-gradient(90deg, rgba(174,243,63,0.55) 0 2px, transparent 2px 10px), linear-gradient(180deg, #aef33f 0%, transparent 65%), #020617',
    maskImage: 'linear-gradient(180deg, #000 30%, transparent 92%)',
  },
  kiku: {
    background:
      'radial-gradient(42% 26% at 50% 74%, rgba(207,247,140,0.85) 0%, rgba(174,243,63,0.15) 55%, transparent 75%), repeating-linear-gradient(90deg, rgba(248,250,252,0.12) 0 1px, transparent 1px 26px), linear-gradient(180deg, #020617 0%, #0f172a 100%)',
  },
};

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const subscribeFinePointer = useCallback((onChange: () => void) => {
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
  }, []);

  const fine = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 1024,
    () => false,
  );

  useEffect(() => {
    if (!fine) return;
    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [fine]);

  useEffect(() => {
    if (!fine || active === null) return;
    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.11;
      current.current.y += (target.current.y - current.current.y) * 0.11;
      if (plateRef.current) {
        plateRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [fine, active]);

  return (
    <section id="projects" className="border-t hairline py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">
            Projects
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Selected · {projects.length}
          </p>
        </div>

        <ul className="mt-14 md:mt-20">
          {projects.map((project, i) => {
            const Row = project.href ? 'a' : 'div';
            return (
              <li
                key={project.title}
                className="group relative border-t hairline last:border-b"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((prev) => (prev === i ? null : prev))}
              >
                <span className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-lime transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

                <Row
                  {...(project.href
                    ? { href: project.href, target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-8 md:py-10"
                >
                  <span className="font-mono text-[11px] tracking-[0.14em] text-mute transition-colors duration-300 group-hover:text-lime">
                    {project.index}
                  </span>
                  <h3 className="font-display text-[clamp(1.9rem,5.4vw,3.8rem)] leading-[0.95] tracking-[-0.02em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {project.title}
                  </h3>
                  <span className="ml-auto flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                    {project.kind} · {project.year}
                    {project.href ? (
                      <span className="text-chalk transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                        ↗
                      </span>
                    ) : null}
                  </span>
                </Row>

                <div className="flex items-start gap-6 pb-8 md:pb-10 md:pl-[3.4rem]">
                  <div
                    aria-hidden
                    className="mt-1 h-10 w-10 shrink-0 lg:hidden"
                    style={plates[project.plate]}
                  />
                  <div>
                    <p className="max-w-[54ch] text-[15px] leading-[1.65] text-mute">
                      {project.blurb}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute/70">
                      {project.host}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {fine && (
        <div
          ref={plateRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-30 h-[22rem] w-[16rem] overflow-hidden shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: active === null ? 0 : 1,
            transform: 'translate3d(-100px,-100px,0) translate(-50%,-50%)',
          }}
        >
          {active !== null && (
            <div className="relative h-full w-full overflow-hidden">
              <div className="absolute inset-0" style={plates[projects[active].plate]} />
              <div className="grain absolute inset-0 opacity-[0.09] mix-blend-overlay" />
              <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-chalk/70">
                {projects[active].title}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
