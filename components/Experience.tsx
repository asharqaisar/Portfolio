import { Reveal } from './Reveal';

const responsibilities = [
  'Deployed local and cloud-based LLM inference endpoints using Ollama and Open WebUI, and integrated the NVIDIA NIM API for production AI workloads.',
  'Built and maintained autonomous AI agent frameworks (Hermes Agent, OpenClaw) for client and personal automation projects.',
  'Designed and integrated REST APIs using Python (FastAPI) and Node.js, connecting third-party services and AI endpoints for client projects.',
  'Provisioned and maintained Linux server environments (Ubuntu, Kali) for AI and application deployment, using Docker for containerization and PM2 for process management.',
  'Managed full client lifecycle on Upwork and Contra, scoping and delivering AI deployment, full-stack development, and cloud setup engagements.',
];

export function Experience() {
  return (
    <section id="experience" className="border-t hairline py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">
          Experience
        </h2>

        <Reveal className="mt-14 md:mt-20">
          <div className="grid gap-8 border-t hairline pt-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <h3 className="max-w-[22ch] font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] tracking-[-0.02em]">
                Freelance Full-Stack Developer &amp; AI Integration Engineer
              </h3>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-lime">
                2019 — Present
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Self-employed · Remote / Gujranwala, Pakistan
              </p>
            </div>

            <ul className="space-y-6 md:col-span-7 md:col-start-6">
              {responsibilities.map((item) => (
                <li key={item} className="flex gap-5 text-[15px] leading-[1.7] text-mute">
                  <span aria-hidden className="mt-2.5 h-px w-5 shrink-0 bg-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
