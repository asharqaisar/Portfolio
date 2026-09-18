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
    image: '/projects/agent-framework.jpg',
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
    image: '/projects/spectr.jpg',
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
    // No image on purpose: the work is real, but there is no honest picture of
    // it to hand, and generated art would misrepresent it.
  },
];


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

                <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-start md:gap-10 md:pb-10 md:pl-[3.4rem]">
                  <div className="order-2 flex-1 md:order-1">
                    <p className="max-w-[54ch] text-[15px] leading-[1.65] text-mute">
                      {project.blurb}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute/70">
                      {project.host}
                    </p>
                  </div>

                  {project.image ? (
                    <div className="order-1 w-full overflow-hidden rounded-card border border-chalk/10 bg-void-2 md:order-2 md:w-[17rem] lg:w-[20rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt=""
                        width={1600}
                        height={1000}
                        className="aspect-[16/10] w-full object-cover"
                      />
                    </div>
                  ) : null}
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
          className="pointer-events-none fixed left-0 top-0 z-30 h-[15rem] w-[23rem] overflow-hidden rounded-card ring-1 ring-chalk/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: active === null ? 0 : 1,
            transform: 'translate3d(-100px,-100px,0) translate(-50%,-50%)',
          }}
        >
          {active !== null && (
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={projects[active].image}
                alt=""
                className="h-full w-full object-cover"
              />
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
