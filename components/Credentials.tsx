import { Reveal } from './Reveal';

const certifications = [
  { name: 'AI Fluency for Builders', issuer: 'Claude Academy' },
  { name: 'AI Capabilities and Limitations', issuer: 'Claude Academy' },
  { name: 'AI Fluency for Creative Work', issuer: 'Claude Academy' },
  { name: 'NASA Open Science 101', issuer: 'Credly Verified' },
  { name: 'Ethical Hacking', issuer: 'Cisco · Credly Verified' },
  { name: 'Technology Job Simulation', issuer: 'Deloitte · via Forage' },
];

const education = [
  {
    qualification: 'HSSC — Pre-Engineering (Intermediate)',
    institution: 'Allama Iqbal Open University (AIOU) / BISE Gujranwala Board',
  },
  {
    qualification: 'Matriculation',
    institution: 'Government College, Gujranwala',
  },
];

export function Credentials() {
  return (
    <section id="credentials" className="border-t hairline py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-none tracking-[-0.02em]">
          Credentials
        </h2>

        <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Reveal>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
                Certifications
              </h3>
            </Reveal>
            <ul className="mt-6 border-t hairline">
              {certifications.map((cert, i) => (
                <Reveal
                  key={cert.name}
                  delay={i * 50}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b hairline py-5"
                >
                  <span className="text-[15px] text-chalk">{cert.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                    {cert.issuer}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={80}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
                Education
              </h3>
            </Reveal>
            <ul className="mt-6 border-t hairline">
              {education.map((entry, i) => (
                <Reveal
                  key={entry.qualification}
                  delay={100 + i * 60}
                  className="border-b hairline py-5"
                >
                  <p className="text-[15px] leading-snug text-chalk">
                    {entry.qualification}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-mute">
                    {entry.institution}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
