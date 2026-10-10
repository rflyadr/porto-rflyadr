import SkillsEditor from '@/components/admin/SkillsEditor';
import { getContent } from '@/lib/store';

export default async function Page() {
  return <SkillsEditor initial={await getContent()} />;
}
