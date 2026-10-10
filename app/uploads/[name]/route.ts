import { promises as fs } from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/store';

const TYPES: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
};

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = path.basename((await params).name); // no path traversal
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(data, {
      headers: {
        'Content-Type': TYPES[path.extname(name).toLowerCase()] ?? 'application/octet-stream',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'", // neutralise uploaded SVG scripts
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
