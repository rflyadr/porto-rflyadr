import { promises as fs } from 'fs';
import path from 'path';
import { isAdmin } from '@/lib/auth';
import { UPLOAD_DIR } from '@/lib/store';

const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.pdf']);
const MAX_BYTES = 10 * 1024 * 1024;

// A pasted screenshot often has no usable filename ("blob", or empty), so fall
// back to the content type the browser reports.
const EXT_BY_TYPE: Record<string, string> = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp',
  'image/gif': '.gif', 'image/svg+xml': '.svg', 'application/pdf': '.pdf',
};

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const file = (await req.formData()).get('file');
  if (!(file instanceof File)) return Response.json({ error: 'No file' }, { status: 400 });
  const ext = (path.extname(file.name) || EXT_BY_TYPE[file.type] || '').toLowerCase();
  if (!ALLOWED.has(ext)) return Response.json({ error: 'File type not allowed' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'File too large (10 MB max)' }, { status: 400 });

  const base = (path.basename(file.name, ext).replace(/[^\w-]/g, '_').slice(0, 60) || 'pasted');
  const name = `${Date.now()}-${base}${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ path: `/uploads/${name}` });
}
