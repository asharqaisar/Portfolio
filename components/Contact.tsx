import { Reveal } from './Reveal';

const details = [
  { label: 'Email', value: 'noahext994@gmail.com', href: 'mailto:noahext994@gmail.com' },
  { label: 'Phone', value: '+92 316 4413714', href: 'tel:+923164413714' },
  {
    label: 'GitHub',
    value: 'github.com/noah-zipit',
    href: 'https://github.com/noah-zipit',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ashar-qaisar',
    href: 'https://linkedin.com/in/ashar-qaisar-47110337b',
  },
  { label: 'Location', value: 'Gujranwala, Punjab, Pakistan', href: null },
];

export function Contact() {
  return (
    <section id="contact" className="relative border-t hairline py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 30% 100%, rgba(174,243,63,0.16) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal>
          <h2 className="max-w-[16ch] font-display text-[clamp(2.6rem,8.4vw,7rem)] leading-[0.92] tracking-[-0.03em] text-edge">
            Let&rsquo;s build something that{' '}
            <em className="italic text-lime">runs</em>.
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-14 md:mt-20">
            <a
              href="mailto:noahext994@gmail.com"
              className="group inline-flex items-baseline gap-4 border-b border-chalk/25 pb-2 text-[clamp(1.05rem,2.6vw,2rem)] tracking-[-0.01em] transition-colors duration-500 hover:border-lime hover:text-lime"
            >
              noahext994@gmail.com
              <span className="text-[0.6em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                ↗
              </span>
            </a>

            <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.65] text-mute">
              Available for full-stack, AI integration and LLM deployment work — contract or
              full-time, remote or on-site in Pakistan.
            </p>

            <dl className="mt-16 grid gap-px border-t hairline md:grid-cols-2">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b hairline py-5 pr-6"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                    {detail.label}
                  </dt>
                  <dd className="text-[14px] text-chalk">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        {...(detail.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                        className="transition-colors duration-300 hover:text-lime"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <a
              href="/Ashar-Qaisar-CV.pdf"
              download
              className="group mt-14 inline-flex items-center gap-3 bg-lime px-6 py-3.5 text-[13px] font-medium text-void transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-chalk"
            >
              Download CV
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
