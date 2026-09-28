// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone -- a self-contained server.js plus only the
  // node_modules actually traced as reachable. Without this the runtime
  // image has to carry all ~981 MB of node_modules.
  output: 'standalone',
  transpilePackages: ['@univerjs/presets', '@univerjs/preset-sheets-core'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        /^@univerjs/,
        'rxjs',
      ];
    }
    return config;
  },
};

export default nextConfig;