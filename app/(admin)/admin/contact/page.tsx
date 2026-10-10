import ContactEditor from '@/components/admin/ContactEditor';
import { getContent } from '@/lib/store';

export default async function Page() {
  return <ContactEditor initial={await getContent()} />;
}
