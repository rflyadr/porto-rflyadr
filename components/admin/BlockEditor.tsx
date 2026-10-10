'use client';

import type { ProjectBlock } from '@/lib/defaults';
import { GalleryField, IconField, ImageField, Text } from './fields';

const newId = () => Math.random().toString(36).slice(2, 9);

const LABELS: Record<ProjectBlock['type'], string> = {
  heading: 'Heading',
  text: 'Paragraph',
  image: 'Image',
  gallery: 'Image row',
};

function blank(type: ProjectBlock['type']): ProjectBlock {
  const id = newId();
  switch (type) {
    case 'heading': return { type, id, text: '', icon: 'bi-record-circle' };
    case 'text': return { type, id, text: '' };
    case 'image': return { type, id, src: '', caption: '' };
    case 'gallery': return { type, id, images: [], caption: '' };
  }
}

/** Short preview of a block, for its row header. */
function summary(b: ProjectBlock): string {
  if (b.type === 'heading' || b.type === 'text') {
    return b.text.slice(0, 60) || `(empty ${LABELS[b.type].toLowerCase()})`;
  }
  if (b.type === 'image') return b.src ? b.src.split('/').pop()! : '(no image)';
  return `${b.images.length} image${b.images.length === 1 ? '' : 's'}`;
}

/**
 * Builds a project write-up out of ordered blocks, so a detail page can read
 * like a blog post rather than three fixed sections.
 */
export function BlockEditor({ blocks, onChange }: {
  blocks: ProjectBlock[];
  onChange: (update: (b: ProjectBlock[]) => ProjectBlock[]) => void;
}) {
  const patch = (i: number, next: Partial<ProjectBlock>) =>
    onChange((list) => list.map((b, n) => (n === i ? { ...b, ...next } as ProjectBlock : b)));

  const move = (i: number, d: number) =>
    onChange((list) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return list;
      const out = [...list];
      [out[i], out[j]] = [out[j], out[i]];
      return out;
    });

  const add = (type: ProjectBlock['type']) => onChange((list) => [...list, blank(type)]);

  return (
    <div>
      {blocks.length === 0 && (
        <p className="text-muted small">
          No write-up yet. Add a heading, a paragraph or an image below — they appear on the
          detail page in this order.
        </p>
      )}

      {blocks.map((b, i) => (
        <div key={b.id} className="admin-list-item">
          <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
            <span className="small" style={{ minWidth: 0 }}>
              <span className="badge text-bg-light me-2">{LABELS[b.type]}</span>
              <span className="text-muted">{summary(b)}</span>
            </span>
            <span className="btn-group btn-group-sm flex-shrink-0">
              <button type="button" className="btn btn-outline-secondary" disabled={i === 0}
                onClick={() => move(i, -1)} title="Move up">↑</button>
              <button type="button" className="btn btn-outline-secondary" disabled={i === blocks.length - 1}
                onClick={() => move(i, 1)} title="Move down">↓</button>
              <button type="button" className="btn btn-outline-danger"
                onClick={() => onChange((list) => list.filter((_, n) => n !== i))}>Delete</button>
            </span>
          </div>

          {b.type === 'heading' && (
            <>
              <Text label="Heading" value={b.text} onChange={(text) => patch(i, { text })} />
              <IconField label="Icon (optional)" value={b.icon ?? ''} onChange={(icon) => patch(i, { icon })} />
            </>
          )}

          {b.type === 'text' && (
            <Text label="Paragraph" area value={b.text} onChange={(text) => patch(i, { text })}
              help="Blank lines start a new paragraph." />
          )}

          {b.type === 'image' && (
            <>
              <ImageField label="Image" value={b.src} onChange={(src) => patch(i, { src })} />
              <Text label="Caption (optional)" value={b.caption ?? ''} onChange={(caption) => patch(i, { caption })} />
            </>
          )}

          {b.type === 'gallery' && (
            <>
              <GalleryField label="Images" value={b.images} onChange={(images) => patch(i, { images })} />
              <Text label="Caption (optional)" value={b.caption ?? ''} onChange={(caption) => patch(i, { caption })} />
            </>
          )}
        </div>
      ))}

      <div className="d-flex flex-wrap gap-2 mt-2">
        {(Object.keys(LABELS) as ProjectBlock['type'][]).map((t) => (
          <button key={t} type="button" className="btn btn-sm btn-outline-primary" onClick={() => add(t)}>
            + {LABELS[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
