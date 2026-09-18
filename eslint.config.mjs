import nextConfig from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', '.cache/**', 'next-env.d.ts'] },
  ...nextConfig,
];

export default config;
