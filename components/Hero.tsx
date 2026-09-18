import { HeroScene } from './HeroScene';

const socials = [
  { label: 'Email', href: 'mailto:noahext994@gmail.com', value: 'noahext994@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/noah-zipit', value: 'github.com/noah-zipit' },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ashar-qaisar-47110337b',
    value: 'in/ashar-qaisar',
  },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* ambient wash behind the portrait. Neutral, not lime: the user asked for
          "just the profile pic and the rings", so nothing green sits near it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[6%] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full opacity-[0.10] blur-[110px] lg:left-auto lg:right-[4%] lg:top-[12%] lg:h-[42rem] lg:w-[42rem] lg:translate-x-0"
        style={{ background: 'radial-gradient(circle, #94a3b8 0%, rgba(148,163,184,0) 68%)' }}
      />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-24 sm:px-8 md:gap-16 lg:min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 lg:pb-28 lg:pt-32">
        {/*
          Portrait: first on mobile (it is the page's opening statement),
          right-hand column from lg up. The canvas overhangs the circle by 45%
          so the rings have room to orbit outside the photo.
        */}
        <div className="order-1 mx-auto w-[15rem] sm:w-[18rem] lg:order-2 lg:mx-0 lg:w-full lg:max-w-[23rem]">
          <div className="relative aspect-square">
            {/*
              Base layer — a plain circular photo. This is what shows with no
              WebGL, and it stays underneath as a guarantee that the portrait is
              never missing: the 3D disc below is the same photo at the same size.
            */}
            <div className="relative h-full w-full overflow-hidden rounded-full bg-void-2">
              {/*
                Crop tuned for a circular frame: 52% across, 38% down. Chosen by sweeping
                20/26/32/38/44% and measuring where skin pixels land — head top ~12-15%,
                face centred. Computed, not eyeballed: the agent has no vision.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ashar-portrait.jpg"
                alt="Ashar Qaisar"
                width={1000}
                height={1619}
                className="h-full w-full object-cover"
                style={{ objectPosition: '52% 38%' }}
              />
            </div>

            {/*
              The scene sits ON TOP of the photo, not behind it. The portrait is
              a textured disc inside the same 3D space as the rings, so the near
              arc of a ring crosses in front and the far arc passes behind —
              real occlusion instead of a stacked cutout.
            */}
            <div className="absolute -inset-[45%] z-10">
              <HeroScene />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        <div className="order-2 lg:order-1">
          <div
            className="animate-blur-in flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute md:text-[11px]"
            style={{ animationDelay: '60ms' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
            </span>
            Available for work · Remote
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.85rem,12.5vw,7rem)] leading-[0.86] tracking-[-0.035em] md:mt-8">
            <span className="animate-blur-in block" style={{ animationDelay: '140ms' }}>
              Ashar
            </span>
            <span
              className="animate-blur-in block italic text-chalk/90"
              style={{ animationDelay: '260ms' }}
            >
              Qaisar
            </span>
          </h1>

          <p
            className="animate-blur-in mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-chalk/70 md:mt-7 md:text-[12px]"
            style={{ animationDelay: '380ms' }}
          >
            Full-Stack Developer · AI Integration Engineer
          </p>

          <p
            className="animate-blur-in mt-6 max-w-[46ch] text-[15px] leading-[1.65] text-mute md:mt-8 md:text-[17px]"
            style={{ animationDelay: '460ms' }}
          >
            I put language models into production — local inference with Ollama, hosted
            endpoints on NVIDIA NIM, and the agents, APIs and servers that keep them running.
          </p>

          <div
            className="animate-blur-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-10"
            style={{ animationDelay: '560ms' }}
          >
            <a
              href="mailto:noahext994@gmail.com"
              className="group inline-flex min-h-[48px] items-center justify-center gap-3 rounded-full bg-lime px-7 py-3.5 text-[14px] font-medium text-on-lime transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-chalk sm:min-h-0 sm:w-auto"
            >
              Email me
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                aria-hidden
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                <path d="M0 5h12M8.4 1 12.6 5l-4.2 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
            <a
              href="/Ashar-Qaisar-CV.pdf"
              download
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-chalk/20 px-7 py-3.5 text-[14px] text-chalk transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-lime hover:text-lime sm:min-h-0 sm:w-auto"
            >
              Download CV
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>

          <ul
            className="animate-blur-in mt-8 flex flex-col gap-2 border-t border-chalk/10 pt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-mute sm:flex-row sm:flex-wrap sm:gap-x-8 md:mt-10 md:text-[11px]"
            style={{ animationDelay: '660ms' }}
          >
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  {...(social.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                  className="inline-block py-1.5 transition-colors duration-300 hover:text-lime"
                >
                  <span className="text-chalk/45">{social.label}</span> {social.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* scroll cue — desktop only, where there is room for it */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="relative h-12 w-px overflow-hidden bg-chalk/15">
          <div
            className="absolute inset-x-0 top-0 h-4 bg-lime"
            style={{ animation: 'scrollcue 2.6s cubic-bezier(0.16,1,0.3,1) infinite' }}
          />
        </div>
      </div>
    </section>
  );
}
