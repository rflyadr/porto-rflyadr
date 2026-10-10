import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import { adminConfigured, isAdmin } from '@/lib/auth';
import Login from '@/components/admin/Login';
import NotConfigured from '@/components/admin/NotConfigured';

export const metadata: Metadata = {
  title: 'Admin – Portfolio',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

// The admin area is its own shell: Bootstrap + icons only, none of the
// portfolio template CSS or its sidebar.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const configured = adminConfigured();
  const signedIn = configured && (await isAdmin());
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" />
        <link rel="stylesheet" href="/assets/css/admin.css" />
      </head>
      <body className="admin-page">
        {!configured ? <NotConfigured /> : !signedIn ? <Login /> : <AdminShell>{children}</AdminShell>}
      </body>
    </html>
  );
}
