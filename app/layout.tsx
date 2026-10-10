import type { Metadata } from 'next';
import { getContent } from '@/lib/store';

export const dynamic = 'force-dynamic'; // content comes from the store on every request

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    title: settings.pageTitle,
    description: 'Portfolio of Rafly Adriansyah – Full Stack Engineer building web applications, real-time monitoring platforms and IoT systems.',
    icons: {
      icon: [
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

// The public site and the admin area bring their own <head> links and <body> class,
// so the root layout stays empty on purpose.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
