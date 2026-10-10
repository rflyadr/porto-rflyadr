'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PortfolioFilter, Project } from '@/lib/defaults';
import { slugify } from '@/lib/slug';
import { BlockEditor } from './BlockEditor';
import { Card, Column, Columns } from './Card';
import { CheckboxGroup, GalleryField, ImageField, ImageNotesField, TagsField, Text } from './fields';


/**
 * Keeps each image's description attached when its path changes (a replaced
 * upload) and drops notes for images that are gone.
 *
 * A reorder keeps the same paths, so it must not be mistaken for a
 * replacement: only a slot whose new path is not in the old list counts.
 */
function remapNotes(
  notes: Record<string, string> | undefined,
  before: string[],
  after: string[],
): Record<string, string> {
  const out: Record<string, string> = { ...(notes ?? {}) };
  const beforeSet = new Set(before.filter(Boolean));
  const afterSet = new Set(after.filter(Boolean));

  before.forEach((oldSrc, i) => {
    const newSrc = after[i];
    const replaced = oldSrc && newSrc && oldSrc !== newSrc
      && !afterSet.has(oldSrc)      // the old image really is gone
      && !beforeSet.has(newSrc);    // the new one really is new
    if (replaced && out[oldSrc] !== undefined) {
      out[newSrc] = out[oldSrc];
      delete out[oldSrc];
    }
  });

  // Forget notes whose image is no longer in the list at all.
  Object.keys(out).forEach((src) => {
    if (beforeSet.has(src) && !afterSet.has(src)) delete out[src];
  });
  return out;
}

const EMPTY: Project = {
  slug: '', title: '', category: '', image: '', gallery: [], filters: [], description: '',
  tech: [], features: [], date: '', client: '', liveUrl: '', blocks: [], order: 0,
};

export default function ProjectForm({ project, filters }: { project?: Project; filters: PortfolioFilter[] }) {
  const router = useRouter();
  const isNew = !project;
  const [p, setP] = useState<Project>(project ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; kind?: 'ok' | 'error' }>({ text: '' });
  const [dirty, setDirty] = useState(false);

  const set = (next: Partial<Project>) => { setP({ ...p, ...next }); setDirty(true); setStatus({ text: '' }); };
  const field = (f: keyof Project) => ({
    value: String(p[f] ?? ''),
    onChange: (v: string) => set({ [f]: v } as Partial<Project>),
  });

  async function save() {
    if (!p.title.trim()) { setStatus({ text: 'A title is required', kind: 'error' }); return; }
    setSaving(true);
    setStatus({ text: 'Saving…' });
    try {
      const res = await fetch(isNew ? '/api/projects' : `/api/projects/${project!.slug}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      const json = await res.json();
      if (res.status === 401) { router.refresh(); throw new Error('Session expired – sign in again'); }
      if (!res.ok) throw new Error(json.error ?? 'Server error');

      setDirty(false);
      // A new project (or a renamed slug) lives at a different URL.
      if (isNew || json.slug !== project!.slug) {
        router.replace(`/admin/projects/${json.slug}`);
        router.refresh();
        return;
      }
      setP(json);
      setStatus({ text: 'Saved', kind: 'ok' });
      router.refresh();
    } catch (e) {
      setStatus({ text: (e as Error).message, kind: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const previewSlug = p.slug || slugify(p.title) || 'project';

  return (
    <>
      <div className="admin-content">
        <Columns ratio="3">
          <Column>
            <Card title="Card (portfolio grid)" fill>
            <Text label="Title" {...field('title')} />
            <Text label="Category label" placeholder="e.g. IoT Project" {...field('category')} />
            <Text label="Short description" area help="Shown on the card and as the lead text on the detail page."
            {...field('description')} />
            <ImageField label="Main image" value={p.image}
              onChange={(image) => set({ image, imageNotes: remapNotes(p.imageNotes, [p.image], [image]) })} />
            <p className="small text-muted">Used on the portfolio card and shown first on the detail page.</p>
            <CheckboxGroup label="Show under these filters" options={filters}
              value={p.filters} onChange={(f) => set({ filters: f })} />

            <div className="mb-3">
              <span className="form-label small fw-semibold d-block">Project type</span>
              <div className="d-flex gap-3">
                {(['professional', 'personal'] as const).map((k) => (
                  <label key={k} className="form-check-label d-flex align-items-center gap-1 small">
                    <input type="radio" className="form-check-input mt-0" name="project-kind"
                      checked={(p.kind ?? 'personal') === k}
                      onChange={() => set({ kind: k })} />
                    {k === 'professional' ? 'Professional' : 'Personal'}
                  </label>
                ))}
              </div>
              <span className="form-text small">
                Shown as a badge so visitors can tell paid work from personal projects.
              </span>
            </div>

            <TagsField label="Tags" value={p.tags ?? []} onChange={(tags) => set({ tags })}
              help="One per line, e.g. Capstone or Open Source. Shown as small labels on the card." />
            </Card>

          </Column>

          <Column>
            <Card title="Detail page" fill>
            <Text label="URL slug" help={`The page will be /portfolio/${previewSlug}`}
            placeholder={slugify(p.title)} {...field('slug')} />
            <div className="row">
            <div className="col-md-6"><Text label="Date" placeholder="e.g. September 2024" {...field('date')} /></div>
            <div className="col-md-6"><Text label="Client" {...field('client')} /></div>
            </div>
            <Text label="Live project URL" placeholder="https://…" {...field('liveUrl')} />
            <GalleryField label="Sub images" value={p.gallery}
              onChange={(gallery) => set({ gallery, imageNotes: remapNotes(p.imageNotes, p.gallery, gallery) })} />
            <p className="small text-muted">
              Thumbnails under the main image. Drag them to change the order they
              appear and auto-rotate in on the detail page.
            </p>
            <TagsField label="Tech stack badges" value={p.tech} onChange={(tech) => set({ tech })} />
            <TagsField label="Key features" value={p.features} onChange={(features) => set({ features })} />

            <h3 className="admin-card-section">Write-up</h3>
            <p className="small text-muted">
            Build the detail page out of blocks — headings, paragraphs and images in any order.
            </p>
            <BlockEditor
            blocks={p.blocks}
            onChange={(update) => set({ blocks: update(p.blocks) })}
            />
            </Card>

          </Column>

          <Column>
            <Card title="Image descriptions" fill>
            <ImageNotesField
            images={[p.image, ...p.gallery].filter(Boolean)}
            notes={p.imageNotes ?? {}}
            onChange={(imageNotes) => set({ imageNotes })}
              />
            </Card>
          </Column>
        </Columns>
      </div>

      <div className="admin-savebar">
        <button className="btn btn-primary" onClick={save} disabled={saving || (!dirty && !isNew)}>
          {saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => router.push('/admin/projects')} disabled={saving}>
          Back to projects
        </button>
        {!isNew && (
          <a className="btn btn-outline-secondary" href={`/portfolio/${p.slug}`} target="_blank" rel="noreferrer">
            View page
          </a>
        )}
        <span className={`admin-status ${status.kind ?? ''}`}>
          {status.text || (dirty ? 'Unsaved changes' : isNew ? 'Fill in a title to start' : 'Up to date')}
        </span>
      </div>
    </>
  );
}
