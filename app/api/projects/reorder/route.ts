import { isAdmin } from '@/lib/auth';
import { getContent, saveContent } from '@/lib/store';

// Reorder the project list. Body: { slugs: string[] } in the wanted order.
export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { slugs } = (await req.json().catch(() => ({}))) as { slugs?: string[] };
  if (!Array.isArray(slugs)) return Response.json({ error: 'slugs must be an array' }, { status: 400 });

  const content = await getContent();
  const bySlug = new Map(content.projects.map((p) => [p.slug, p]));
  const ordered = slugs.map((s) => bySlug.get(s)).filter((p) => p !== undefined);
  // Anything the client did not mention keeps its place at the end.
  const rest = content.projects.filter((p) => !slugs.includes(p.slug));

  const projects = [...ordered, ...rest].map((p, n) => ({ ...p, order: n }));
  await saveContent({ ...content, projects });
  return Response.json({ ok: true, projects });
}
