import { Reveal } from './Reveal';

const groups = [
  {
    label: 'Programming',
    items: ['Python', 'SQL', 'JavaScript (ES6+)'],
  },
  {
    label: 'ML & AI',
    items: [
      'Scikit-learn',
      'TensorFlow',
      'PyTorch',
      'Deep Learning',
      'NLP',
      'Computer Vision',
      'Prompt Engineering',
      'LLM Deployment',
      'Agent Frameworks',
    ],
  },
  {
    label: 'AI Platforms',
    items: [
      'Ollama',
      'Open WebUI',
      'NVIDIA NIM API',
      'Hermes Agent',
      'OpenClaw',
      'REST API Integration',
    ],
  },
  {
    label: 'Tools',
    items: ['Jupyter', 'Git', 'GitHub', 'Docker', 'VS Code', 'PM2', 'Linux (Ubuntu, Kali)'],
  },
  {
    label: 'Deployment',
    items: ['SSH', 'Cloud Deployment', 'Netlify', 'Vercel', 'Containerization'],
  },
];

export function Stack() {
  return (
    <section id="stack" className="border-t hairline py-28 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 md:grid-cols-12 md:gap-10 md:px-10">
        <div className="md:col-span-4">
          <h2 className="sticky top-28 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em]">
            Stack
          </h2>
        </div>

        <ul className="border-t hairline md:col-span-8">
          {groups.map((group, i) => (
            <li key={group.label} className="border-b hairline py-7 md:py-8">
              <Reveal
                delay={i * 60}
                className="grid gap-3 md:grid-cols-[13rem_1fr] md:gap-10"
              >
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-lime">
                  {group.label}
                </h3>
                <p className="text-[15px] leading-[1.7] text-mute">
                  {group.items.join(' · ')}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
