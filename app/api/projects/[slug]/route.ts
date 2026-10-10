import { isAdmin } from '@/lib/auth';
import { getContent, saveContent } from '@/lib/store';
import type { Project } from '@/lib/defaults';
import { uniqueSlug } from '@/lib/slug';

type Ctx = { params: Promise<{ slug: string }> };

// Update one project. The slug may change; it is kept unique.
export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const content = await getContent();
  const i = content.projects.findIndex((p) => p.slug === slug);
  if (i < 0) return Response.json({ error: 'Project not found' }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as Partial<Project>;
  const title = String(body.title ?? content.projects[i].title).trim();
  if (!title) return Response.json({ error: 'A title is required' }, { status: 400 });

  const others = content.projects.filter((_, n) => n !== i).map((p) => p.slug);
  const wanted = String(body.slug ?? slug).trim() || slug;
  const nextSlug = wanted === slug ? slug : uniqueSlug(wanted, others);

  const updated: Project = { ...content.projects[i], ...body, title, slug: nextSlug };
  const projects = content.projects.map((p, n) => (n === i ? updated : p));
  await saveContent({ ...content, projects });
  return Response.json(updated);
}

export async function DELETE(_: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await params;
  const content = await getContent();
  const projects = content.projects.filter((p) => p.slug !== slug);
  if (projects.length === content.projects.length) {
    return Response.json({ error: 'Project not found' }, { status: 404 });
  }
  await saveContent({ ...content, projects: projects.map((p, n) => ({ ...p, order: n })) });
  return Response.json({ ok: true });
}
