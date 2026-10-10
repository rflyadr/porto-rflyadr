'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SiteContent } from '@/lib/defaults';
import { Media } from '../Media';
import { Card, Column, Columns } from './Card';
import { Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function ProjectsEditor({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial.projects);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  // Project add/delete/reorder write straight away, so the list and the
  // per-project pages can never disagree.
  async function call(url: string, init: RequestInit, done: string) {
    setBusy(true);
    setNote('');
    try {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error((await res.json()).error ?? 'Request failed');
      setNote(done);
      router.refresh();
      return await res.json();
    } catch (e) {
      alert((e as Error).message);
      setProjects(initial.projects); // put the list back
    } finally {
      setBusy(false);
    }
  }

  function move(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    setProjects(next);
    call('/api/projects/reorder', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: next.map((p) => p.slug) }),
    }, 'Order saved');
  }

  function remove(slug: string, title: string) {
    if (!confirm(`Delete “${title}”? Its detail page goes too. This cannot be undone.`)) return;
    setProjects(projects.filter((p) => p.slug !== slug));
    call(`/api/projects/${slug}`, { method: 'DELETE' }, 'Project deleted');
  }

  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const p = (f: keyof SiteContent['portfolio']) => ({
          value: d.portfolio[f] ?? '',
          onChange: (v: string) => patch((d) => ({ portfolio: { ...d.portfolio, [f]: v } })),
        });
        return (
          <>
            <Columns ratio="1-2">
              <Column>
                  <Card title="Section heading">
                    <Text label="Title" {...p('sectionTitle')} />
                    <Text label="Subtitle" area {...p('sectionSubtitle')} />
                    <Text label="“All” filter label" {...p('allLabel')} />
                  </Card>

                  <Card title="Filters">
                    <p className="small text-muted">
                      The tabs above the project grid. <code>Key</code> is what each project ticks – if you change a key,
                      re-tick the projects that used it.
                    </p>
                    <ListEditor
                      title="Filter tabs"
                      items={d.portfolioFilters}
                      onChange={(update) => patch((d) => ({ portfolioFilters: update(d.portfolioFilters) }))}
                      fields={[{ key: 'label', label: 'Label' }, { key: 'key', label: 'Key (lowercase, no spaces)' }]}
                      blank={() => ({ key: '', label: '', order: d.portfolioFilters.length })}
                      itemLabel={(i) => i.label}
                    />
                  </Card>
              </Column>

              <Column>
                  <Card title="Projects" fill>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="small text-muted mb-0">
                        {projects.length} project{projects.length === 1 ? '' : 's'}, each with its own detail page.
                        {note && <span className="text-success ms-2">{note}</span>}
                      </p>
                      <Link href="/admin/projects/new" className="btn btn-sm btn-primary">+ New project</Link>
                    </div>

                    {projects.length === 0 && <p className="text-muted small">No projects yet.</p>}

                    {projects.map((proj, i) => (
                      <div className="admin-list-item d-flex align-items-center gap-3" key={proj.slug}>
                        {proj.image
                          ? <Media path={proj.image} style={{ width: 64, height: 46, objectFit: 'cover', borderRadius: 5 }} />
                          : <div style={{ width: 64, height: 46, borderRadius: 5, background: '#e9edf5' }} />}

                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="fw-semibold small text-truncate">{proj.title || '(untitled)'}</div>
                          <div className="text-muted text-truncate" style={{ fontSize: '.78rem' }}>
                            {proj.category || 'no category'} · /portfolio/{proj.slug}
                          </div>
                        </div>

                        <div className="btn-group btn-group-sm flex-shrink-0">
                          <button type="button" className="btn btn-outline-secondary" disabled={busy || i === 0}
                            onClick={() => move(i, -1)} title="Move up">↑</button>
                          <button type="button" className="btn btn-outline-secondary" disabled={busy || i === projects.length - 1}
                            onClick={() => move(i, 1)} title="Move down">↓</button>
                          <Link href={`/admin/projects/${proj.slug}`} className="btn btn-outline-secondary">Edit</Link>
                          <a href={`/portfolio/${proj.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline-secondary">View</a>
                          <button type="button" className="btn btn-outline-danger" disabled={busy}
                            onClick={() => remove(proj.slug, proj.title)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </Card>
              </Column>
            </Columns>
          </>
        );
      }}
    </SectionForm>
  );
}
