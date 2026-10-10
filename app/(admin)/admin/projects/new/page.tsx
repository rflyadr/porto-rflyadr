import ProjectForm from '@/components/admin/ProjectForm';
import { getContent } from '@/lib/store';

export default async function NewProjectPage() {
  const { portfolioFilters } = await getContent();
  return <ProjectForm filters={portfolioFilters} />;
}
