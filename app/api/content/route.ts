import { isAdmin } from '@/lib/auth';
import { getContent, saveContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getContent());
}

// Replaces the whole content document (admin only).
export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(await saveContent(await req.json()));
}
