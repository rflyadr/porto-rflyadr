import { notFound } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';
import { getContent } from '@/lib/store';

export default async function EditProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { projects, portfolioFilters } = await getContent();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectForm project={project} filters={portfolioFilters} />;
}
