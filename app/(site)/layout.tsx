import { ContentProvider } from '@/components/ContentProvider';
import Effects from '@/components/Effects';
import Sidebar from '@/components/Sidebar';
import { getContent } from '@/lib/store';

// GitHub Pages serves from /<repo>/, so these absolute paths need the prefix.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const css = [
  '/assets/vendor/bootstrap/css/bootstrap.min.css',
  '/assets/vendor/bootstrap-icons/bootstrap-icons.css',
  '/assets/vendor/aos/aos.css',
  '/assets/vendor/glightbox/css/glightbox.min.css',
  '/assets/css/main.css',
];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Quicksand:wght@300;400;500;600;700&display=swap" />
        {css.map((href) => <link key={href} rel="stylesheet" href={`${base}${href}`} />)}
      </head>
      <body className="index-page">
        <ContentProvider content={content}>
          <Sidebar />
          {children}
          <Effects />
        </ContentProvider>
      </body>
    </html>
  );
}
