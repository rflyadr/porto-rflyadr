'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EDIT_LINKS, SITE_LINKS } from './nav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  // Mobile: the sidebar slides over the page, so close it on navigation.
  useEffect(() => setNavOpen(false), [pathname]);
  useEffect(() => {
    document.body.classList.toggle('admin-nav-open', navOpen);
  }, [navOpen]);

  // /admin/projects/foo should still highlight (and title) Projects.
  const current = [...EDIT_LINKS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((l) => pathname === l.href || pathname.startsWith(l.href + '/'));

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <i className="bi bi-sliders"></i>
          <span>Portfolio admin</span>
        </div>

        <div className="admin-nav-label">Content</div>
        <nav className="admin-nav">
          {EDIT_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={current?.href === l.href ? 'active' : ''}>
              <i className={`bi ${l.icon}`}></i>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-nav-label">View site</div>
        <nav className="admin-nav">
          {SITE_LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              <i className={`bi ${l.icon}`}></i>
              <span>{l.label}</span>
              <i className="bi bi-box-arrow-up-right ms-auto" style={{ fontSize: '.7rem', opacity: .6 }}></i>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button type="button" onClick={signOut}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button type="button" className="admin-burger" aria-label="Menu" onClick={() => setNavOpen(!navOpen)}>
            <i className="bi bi-list"></i>
          </button>
          <h1>{current?.label ?? 'Admin'}</h1>
          <span className="admin-hint ms-auto d-none d-sm-inline">Changes go live as soon as you save.</span>
        </header>
        {children}
      </div>
    </>
  );
}
