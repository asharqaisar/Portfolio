import { Reveal } from './Reveal';

const focus = [
  'Local and hosted LLM inference — Ollama, Open WebUI, NVIDIA NIM API',
  'Autonomous agent frameworks for client and internal automation',
  'Python ML and automation workflows, delivered inside full-stack apps',
];

// Every value here is transcribed from the CV. Nothing inferred.
const glance = [
  { label: 'Based in', value: 'Gujranwala, Punjab — working remote' },
  { label: 'Working since', value: '2019, self-employed and freelance' },
  { label: 'Core work', value: 'LLM deployment · Agents · Full-stack' },
  { label: 'Certified by', value: 'Claude Academy · Cisco · NASA Open Science' },
];

export function About() {
  return (
    <section id="about" className="border-t hairline py-20 md:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 md:gap-14 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-7">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,7vw,3.6rem)] leading-none tracking-[-0.02em]">
              About
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-8 font-display text-[clamp(1.4rem,4.4vw,2.4rem)] leading-[1.15] tracking-[-0.015em] text-edge md:mt-10">
              I make models useful outside the demo — deployed, contained, and wired into the
              products people actually use.
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-8 space-y-5 text-[15px] leading-[1.7] text-mute md:mt-10 md:text-[16px]">
              <p>
                AI integration engineer with production experience deploying local and
                cloud-based LLM endpoints using Ollama, Open WebUI and the NVIDIA NIM API. I
                build and maintain autonomous agent frameworks, apply Python to machine
                learning and automation, and ship AI features inside full-stack applications.
              </p>
              <p>
                Most of my work has been self-directed: scoping with a client, provisioning the
                Linux box, containerising the model server, then handing over something that
                keeps running without me.
              </p>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <ul className="mt-8 space-y-4 border-t hairline pt-8 md:mt-10">
              {focus.map((item) => (
                <li key={item} className="flex gap-4 text-[15px] leading-[1.6] text-chalk">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-lime" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={160}>
            <div className="rounded-card border border-chalk/10 bg-void-2/40 p-6 md:p-7">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                At a glance
              </h3>
              <dl className="mt-6 space-y-5">
                {glance.map((item) => (
                  <div key={item.label} className="border-t border-chalk/10 pt-4 first:border-t-0 first:pt-0">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-[15px] leading-[1.5] text-chalk">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
