import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const grotesk = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jb',
  display: 'swap',
});

// TODO: replace with the real domain before deploy — it makes OG/Twitter URLs absolute.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asharqaisar.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ashar Qaisar — Full-Stack Developer & AI Integration Engineer',
  description:
    'I put language models into production: local inference with Ollama, hosted endpoints on NVIDIA NIM, autonomous agent frameworks, and the full-stack work around them.',
  openGraph: {
    title: 'Ashar Qaisar — Full-Stack Developer & AI Integration Engineer',
    description:
      'LLM deployment, autonomous agents, and full-stack delivery. Gujranwala, Pakistan — remote.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashar Qaisar — Full-Stack Developer & AI Integration Engineer',
    description:
      'LLM deployment, autonomous agents, and full-stack delivery. Gujranwala, Pakistan — remote.',
  },
};

export const viewport: Viewport = {
  themeColor: '#020617',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrument.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-bone antialiased">{children}</body>
    </html>
  );
}
