import AboutEditor from '@/components/admin/AboutEditor';
import { getContent } from '@/lib/store';

export default async function AboutPage() {
  return <AboutEditor initial={await getContent()} />;
}
