import ResumeEditor from '@/components/admin/ResumeEditor';
import { getContent } from '@/lib/store';

export default async function Page() {
  return <ResumeEditor initial={await getContent()} />;
}
