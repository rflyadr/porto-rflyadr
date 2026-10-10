import { isAdmin } from '@/lib/auth';
import { getContent, saveContent } from '@/lib/store';
import type { Project } from '@/lib/defaults';
import { uniqueSlug } from '@/lib/slug';

// Create a project. Returns the saved project so the client knows its slug.
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as Partial<Project>;
  const title = String(body.title ?? '').trim();
  if (!title) return Response.json({ error: 'A title is required' }, { status: 400 });

  const content = await getContent();
  const slug = uniqueSlug(String(body.slug || title), content.projects.map((p) => p.slug));

  const project: Project = {
    slug,
    title,
    category: body.category ?? '',
    image: body.image ?? '',
    gallery: body.gallery ?? [],
    filters: body.filters ?? [],
    description: body.description ?? '',
    tech: body.tech ?? [],
    features: body.features ?? [],
    date: body.date ?? '',
    client: body.client ?? '',
    liveUrl: body.liveUrl ?? '',
    kind: body.kind ?? 'personal',
    tags: body.tags ?? [],
    blocks: body.blocks ?? [],
    order: content.projects.length,
  };

  await saveContent({ ...content, projects: [...content.projects, project] });
  return Response.json(project, { status: 201 });
}
