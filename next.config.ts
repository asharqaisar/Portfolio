import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow the sandboxed preview host and public tunnels to talk to the dev server.
  allowedDevOrigins: [
    '*.e2b.app',
    '*.arena.ai',
    '*.trycloudflare.com',
    '*.loca.lt',
    '*.bore.pub',
  ],
};

export default nextConfig;
