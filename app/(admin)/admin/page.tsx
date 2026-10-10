import Link from 'next/link';
import { getContent } from '@/lib/store';
import { EDIT_LINKS } from '@/components/admin/nav';

export default async function Dashboard() {
  const c = await getContent();

  const tiles = [
    { label: 'Projects', value: c.projects.length, href: '/admin/projects' },
    { label: 'Skill categories', value: c.skillCategories.length, href: '/admin/skills' },
    { label: 'Jobs', value: c.experience.length, href: '/admin/resume' },
    { label: 'Education entries', value: c.education.length, href: '/admin/resume' },
    { label: 'Timeline entries', value: c.timeline.length, href: '/admin/about' },
    { label: 'Social links', value: c.socials.length, href: '/admin/site' },
  ];

  return (
    <div className="admin-content">
      <section className="admin-card">
        <h2>Overview</h2>
        <div className="row g-3">
          {tiles.map((t) => (
            <div className="col-6 col-md-4" key={t.label}>
              <Link href={t.href} className="text-decoration-none text-reset">
                <div className="admin-list-item mb-0 h-100">
                  <div className="h4 mb-1">{t.value}</div>
                  <div className="small text-muted">{t.label}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <h2>Edit a section</h2>
        <div className="list-group">
          {EDIT_LINKS.filter((l) => l.href !== '/admin').map((l) => (
            <Link key={l.href} href={l.href} className="list-group-item list-group-item-action d-flex align-items-center gap-2">
              <i className={`bi ${l.icon}`}></i> {l.label}
              <i className="bi bi-chevron-right ms-auto small"></i>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <h2>How it works</h2>
        <ul className="small text-muted mb-0 ps-3">
          <li>Every section&apos;s text, list items and images are editable here.</li>
          <li>Section pages save when you press <strong>Save changes</strong>.</li>
          <li>Adding, deleting and reordering a project saves straight away.</li>
          <li>Each project gets its own page at <code>/portfolio/&lt;slug&gt;</code>.</li>
        </ul>
      </section>
    </div>
  );
}
