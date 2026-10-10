import { getContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

/**
 * The whole site content as JSON, for the static GitHub Pages build.
 * Copy this into content/site.json in the repo, commit, and push.
 *
 * Public on purpose: it returns exactly what the public pages already show.
 */
export async function GET() {
  const content = await getContent();
  return new Response(JSON.stringify(content, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'inline; filename="site.json"',
      'Cache-Control': 'no-store',
    },
  });
}
