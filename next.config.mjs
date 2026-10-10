/** @type {import('next').NextConfig} */
const isStatic = process.env.STATIC_EXPORT === '1';

// Two builds from one codebase:
//  - default: the full app (admin + API) for the EC2 server
//  - STATIC_EXPORT=1: a read-only export of the public pages for GitHub Pages,
//    reading content/site.json instead of the database.
const nextConfig = isStatic
  ? {
      output: 'export',
      images: { unoptimized: true },
      // Served from https://<user>.github.io/<repo>/
      basePath: process.env.PAGES_BASE_PATH || '',
      assetPrefix: process.env.PAGES_BASE_PATH || undefined,
      trailingSlash: true,
    }
  : {};

export default nextConfig;
