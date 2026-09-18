const links = [
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#stack' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Credentials', href: '#credentials' },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <a href="#top" className="group flex items-center gap-3 py-2 text-chalk">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden
            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90"
          >
            <path
              d="M7 0.7 13.3 7 7 13.3 0.7 7Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
            />
            <circle cx="7" cy="7" r="1.85" fill="var(--color-lime)" />
          </svg>
          <span className="text-[13px] font-medium tracking-[0.26em]">ASHAR QAISAR</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-2 text-[13px] text-mute transition-colors duration-300 hover:text-chalk"
            >
              {link.label}
              <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/Ashar-Qaisar-CV.pdf"
            download
            className="group hidden items-center gap-2 border-b border-chalk/25 pb-1.5 pt-2 text-[12px] text-mute transition-colors duration-300 hover:border-lime hover:text-chalk sm:inline-flex"
          >
            CV
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <a
            href="#contact"
            className="border border-chalk/15 px-4 py-2 text-[12px] text-chalk transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-void"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
