import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { getContent } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = (await getContent()).projects.find((x) => x.slug === id);
  return p ? { title: p.title, description: p.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projects } = await getContent();
  const i = projects.findIndex((p) => p.slug === id);
  if (i < 0) notFound();
  return <ProjectDetail project={projects[i]} nextSlug={projects[(i + 1) % projects.length].slug} />;
}
