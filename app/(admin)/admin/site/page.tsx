import SiteEditor from '@/components/admin/SiteEditor';
import { getContent } from '@/lib/store';

export default async function SitePage() {
  return <SiteEditor initial={await getContent()} />;
}
