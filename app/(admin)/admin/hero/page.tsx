import HeroEditor from '@/components/admin/HeroEditor';
import { getContent } from '@/lib/store';

export default async function HeroPage() {
  return <HeroEditor initial={await getContent()} />;
}
