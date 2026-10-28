// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits .next/standalone -- a self-contained server.js plus only the
  // node_modules actually traced as reachable. Without this the runtime
  // image has to carry all ~981 MB of node_modules.
  output: 'standalone',
  // The app never uses next/image, so turn the optimizer off: /_next/image then
  // answers 404 before parsing anything, closing its unauthenticated RCE/DoS
  // surface (SCRUM-579). Re-enable only together with a patched Next.
  images: { unoptimized: true },
  // Pin tracing to this client folder. The repo-root package-lock (lefthook/knip)
  // would otherwise make Next 15 infer the parent as the workspace root and nest
  // the output at .next/standalone/<dir>/server.js, breaking the Dockerfile's
  // `node server.js`. (Next 14 ignored this top-level key; 15 honours it.)
  outputFileTracingRoot: __dirname,
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