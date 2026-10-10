import { promises as fs } from 'fs';
import path from 'path';

// The full Bootstrap Icons name list, read from the bundled manifest so it
// always matches the font actually shipped in public/assets/vendor.
let cache: string[] | undefined;

export async function GET() {
  if (!cache) {
    const file = path.join(process.cwd(), 'public/assets/vendor/bootstrap-icons/bootstrap-icons.json');
    const manifest = JSON.parse(await fs.readFile(file, 'utf8')) as Record<string, number>;
    cache = Object.keys(manifest).sort();
  }
  return Response.json(cache, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}
