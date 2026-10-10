'use client';

import { useState } from 'react';
import { Media } from '../Media';
import { IconPicker } from './IconPicker';

/** Single-line or multi-line text input. */
export function Text({ label, value, onChange, area, placeholder, help }: {
  label: string; value: string; onChange: (v: string) => void;
  area?: boolean; placeholder?: string; help?: string;
}) {
  return (
    <label className="d-block mb-3">
      <span className="form-label small fw-semibold">{label}</span>
      {area
        ? <textarea className="form-control" rows={4} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className="form-control" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
      {help && <span className="form-text small">{help}</span>}
    </label>
  );
}

export function NumberField({ label, value, onChange, min = 0, max = 100 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <label className="d-block mb-3">
      <span className="form-label small fw-semibold">{label}</span>
      <input type="number" className="form-control" value={value} min={min} max={max}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} />
    </label>
  );
}

/** Icon chooser: searchable grid of the bundled Bootstrap Icons. */
export function IconField({ value, onChange, label = 'Icon' }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  return <IconPicker value={value} onChange={onChange} label={label} />;
}

/** Comma- or newline-separated list stored as string[]. */
export function TagsField({ label, value, onChange, help }: {
  label: string; value: string[]; onChange: (v: string[]) => void; help?: string;
}) {
  const [text, setText] = useState(value.join('\n'));
  return (
    <label className="d-block mb-3">
      <span className="form-label small fw-semibold">{label}</span>
      <textarea className="form-control" rows={3} value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split('\n').map((t) => t.trim()).filter(Boolean));
        }} />
      <span className="form-text small">{help ?? 'One per line.'}</span>
    </label>
  );
}

/** POSTs one file to the upload route and returns its stored path. */
async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Upload failed');
  return json.path as string;
}

/** Pulls image files out of a paste or drop. */
function filesFrom(e: React.ClipboardEvent | React.DragEvent): File[] {
  const dt = 'clipboardData' in e ? e.clipboardData : e.dataTransfer;
  if (!dt) return [];
  // A screenshot arrives as an item with kind "file", not in dt.files on paste.
  const out = Array.from(dt.items ?? [])
    .filter((i) => i.kind === 'file')
    .map((i) => i.getAsFile())
    .filter((f): f is File => f !== null);
  return out.length ? out : Array.from(dt.files ?? []);
}

/**
 * A zone that accepts a pasted screenshot or a dragged file.
 * Click it to focus, then press Ctrl/Cmd+V.
 */
function DropZone({ onFiles, busy, multiple, hint }: {
  onFiles: (files: File[]) => void; busy: boolean; multiple?: boolean; hint?: string;
}) {
  const [over, setOver] = useState(false);
  const [armed, setArmed] = useState(false);

  const take = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    if (imgs.length) onFiles(multiple ? imgs : imgs.slice(0, 1));
  };

  return (
    <div
      tabIndex={0}
      className={`admin-dropzone${over ? ' is-over' : ''}${armed ? ' is-armed' : ''}`}
      onFocus={() => setArmed(true)}
      onBlur={() => setArmed(false)}
      onPaste={(e) => { const f = filesFrom(e); if (f.length) { e.preventDefault(); take(f); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(filesFrom(e)); }}
    >
      <i className="bi bi-clipboard-plus"></i>
      <span>
        {busy ? 'Uploading…'
          : over ? 'Drop to upload'
          : armed ? `Press ${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+V to paste`
          : hint ?? 'Click here, then paste a screenshot — or drop a file'}
      </span>
    </div>
  );
}

/** Uploads to the server (data/uploads) and stores the returned path. /assets paths also work. */
export function ImageField({ label, value, onChange, accept = 'image/*' }: {
  label: string; value: string; onChange: (v: string) => void; accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const isImage = accept.startsWith('image');

  async function upload(file: File) {
    setBusy(true);
    try {
      onChange(await uploadFile(file));
    } catch (e) {
      alert('Upload failed: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-3">
      <span className="form-label small fw-semibold d-block">{label}</span>
      {isImage && value && (
        <div className="admin-gallery-item d-inline-block mb-2">
          <Media path={value} style={{ maxHeight: 110, borderRadius: 8, display: 'block' }} />
          <button type="button" className="btn btn-sm btn-danger admin-gallery-remove"
            title="Remove image" onClick={() => onChange('')}>×</button>
        </div>
      )}
      <input className="form-control mb-2" value={value} onChange={(e) => onChange(e.target.value)} placeholder="path or uploaded file" />
      <input type="file" accept={accept} className="form-control form-control-sm" disabled={busy}
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      {isImage && <DropZone busy={busy} onFiles={(f) => upload(f[0])} />}
      {busy && <small className="text-muted">Uploading…</small>}
    </div>
  );
}

/** Several images: upload, paste or drop adds to the list. */
export function GalleryField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Images show (and auto-rotate) on the site in this order.
  const drop = (to: number) => {
    if (dragFrom === null || dragFrom === to) return;
    const next = [...value];
    const [moved] = next.splice(dragFrom, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setDragFrom(null);
    setDragOver(null);
  };

  async function upload(files: File[]) {
    setBusy(true);
    try {
      const added: string[] = [];
      for (const file of files) added.push(await uploadFile(file));
      onChange([...value, ...added]);
    } catch (e) {
      alert('Upload failed: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-3">
      <span className="form-label small fw-semibold d-block">{label}</span>
      {value.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {value.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`admin-gallery-item${dragFrom === i ? ' is-dragging' : ''}${dragOver === i && dragFrom !== i ? ' is-over' : ''}`}
              draggable
              onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; }}
              onDragEnter={() => setDragOver(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); drop(i); }}
              onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
              title="Drag to reorder"
            >
              <Media path={src} style={{ height: 70, borderRadius: 6, display: 'block', pointerEvents: 'none' }} />
              <button type="button" className="btn btn-sm btn-danger admin-gallery-remove"
                title="Remove" onClick={() => onChange(value.filter((_, n) => n !== i))}>×</button>
              <span className="admin-gallery-pos">{i + 1}</span>
              {/* Swap this one image without losing its place in the order. */}
              <label className="admin-gallery-replace" title="Replace this image">
                <i className="bi bi-arrow-repeat"></i>
                <input type="file" accept="image/*" hidden disabled={busy}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    e.target.value = '';
                    setBusy(true);
                    try {
                      const path = await uploadFile(f);
                      onChange(value.map((x, n) => (n === i ? path : x)));
                    } catch (err) {
                      alert('Upload failed: ' + (err as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }} />
              </label>
            </div>
          ))}
        </div>
      )}
      <input type="file" accept="image/*" multiple className="form-control form-control-sm" disabled={busy}
        onChange={(e) => e.target.files?.length && upload(Array.from(e.target.files))} />
      <DropZone busy={busy} multiple onFiles={upload} hint="Click here, then paste screenshots — or drop files" />
      {busy && <small className="text-muted">Uploading…</small>}
    </div>
  );
}


/**
 * The detail-page images with a description for each. The image list itself is
 * owned by the caller; this only edits the notes keyed by image path.
 */
export function ImageNotesField({ images, notes, onChange }: {
  images: string[];
  notes: Record<string, string>;
  onChange: (notes: Record<string, string>) => void;
}) {
  if (images.length === 0) {
    return <p className="small text-muted">Add a main image or sub images first.</p>;
  }
  return (
    <div>
      <p className="small text-muted">
        Shown under the image when a visitor clicks its thumbnail on the detail page.
      </p>
      {images.map((src, i) => (
        <div className="admin-list-item d-flex gap-3" key={`${src}-${i}`}>
          <Media path={src} style={{ width: 84, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
          <div className="flex-grow-1" style={{ minWidth: 0 }}>
            <div className="small text-muted text-truncate mb-1">
              {i === 0 ? 'Main image' : `Sub image ${i}`} · {src.split('/').pop()}
            </div>
            <textarea className="form-control form-control-sm" rows={3}
              placeholder="What does this screen show?"
              value={notes[src] ?? ''}
              onChange={(e) => onChange({ ...notes, [src]: e.target.value })} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tick which portfolio filters a project belongs to. */
export function CheckboxGroup({ label, options, value, onChange }: {
  label: string; options: { key: string; label: string }[]; value: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div className="mb-3">
      <span className="form-label small fw-semibold d-block">{label}</span>
      {options.length === 0 && <p className="small text-muted mb-0">No filters defined yet.</p>}
      <div className="d-flex flex-wrap gap-3">
        {options.map((o) => (
          <label key={o.key} className="form-check-label d-flex align-items-center gap-1 small">
            <input type="checkbox" className="form-check-input mt-0" checked={value.includes(o.key)}
              onChange={(e) => onChange(e.target.checked ? [...value, o.key] : value.filter((k) => k !== o.key))} />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
