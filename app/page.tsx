import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Credentials } from '@/components/Credentials';
import { Experience } from '@/components/Experience';
import { Grain } from '@/components/Grain';
import { Hero } from '@/components/Hero';
import { Nav } from '@/components/Nav';
import { Projects } from '@/components/Projects';
import { Stack } from '@/components/Stack';

function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-6 py-10 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim md:px-10">
        <span>© 2026 Ashar Qaisar</span>
        <span className="flex gap-7">
          <a href="mailto:noahext994@gmail.com" className="transition-colors hover:text-bone">
            Email
          </a>
          <a
            href="https://github.com/noah-zipit"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-bone"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/ashar-qaisar-47110337b"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-bone"
          >
            LinkedIn
          </a>
        </span>
        <span>Next.js · WebGL</span>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <>
      <Grain />
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
