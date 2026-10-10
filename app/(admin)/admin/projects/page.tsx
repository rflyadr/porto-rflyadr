import ProjectsEditor from '@/components/admin/ProjectsEditor';
import { getContent } from '@/lib/store';

export default async function Page() {
  return <ProjectsEditor initial={await getContent()} />;
}
