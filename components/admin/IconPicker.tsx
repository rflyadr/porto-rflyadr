'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// The icon list is fetched once per page load and shared by every picker.
let cached: string[] | undefined;
let inFlight: Promise<string[]> | undefined;

function loadIcons(): Promise<string[]> {
  if (cached) return Promise.resolve(cached);
  inFlight ??= fetch('/api/icons')
    .then((r) => r.json())
    .then((list: string[]) => (cached = list))
    .catch(() => (cached = []));
  return inFlight;
}

/** A few sensible starting points, shown before you type anything. */
const SUGGESTED = ['cloud', 'code-slash', 'cpu', 'database', 'server', 'terminal', 'tools', 'gear',
  'github', 'linkedin', 'twitter-x', 'instagram', 'facebook', 'whatsapp', 'envelope', 'telephone',
  'geo-alt', 'globe', 'briefcase', 'mortarboard', 'award', 'star', 'robot', 'bar-chart'];

export function IconPicker({ value, onChange, label = 'Icon' }: {
  value: string; onChange: (v: string) => void; label?: string;
}) {
  const [icons, setIcons] = useState<string[]>(cached ?? []);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { loadIcons().then(setIcons); }, []);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Stored values carry the "bi-" prefix; the manifest names do not.
  const bare = (name: string) => name.replace(/^bi-/, '');
  const shown = useMemo(() => {
    const q = bare(query.trim().toLowerCase());
    if (!q) {
      const picks = SUGGESTED.filter((n) => icons.length === 0 || icons.includes(n));
      return picks.length ? picks : icons.slice(0, 60);
    }
    // Names starting with the query first, then any that contain it.
    const starts: string[] = [];
    const contains: string[] = [];
    for (const n of icons) {
      if (n.startsWith(q)) starts.push(n);
      else if (n.includes(q)) contains.push(n);
      if (starts.length >= 120) break;
    }
    return [...starts, ...contains].slice(0, 120);
  }, [query, icons]);

  const pick = (name: string) => {
    onChange(`bi-${name}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="mb-3" ref={box} style={{ position: 'relative' }}>
      <span className="form-label small fw-semibold d-block">{label}</span>

      <div className="input-group">
        <span className="input-group-text" style={{ minWidth: 42, justifyContent: 'center' }}>
          <i className={`bi ${value}`}></i>
        </span>
        <input className="form-control" value={value} placeholder="bi-star"
          onChange={(e) => onChange(e.target.value)} onFocus={() => setOpen(true)} />
        <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(!open)}>
          Browse
        </button>
      </div>

      {open && (
        <div className="icon-picker-pop">
          <input className="form-control form-control-sm mb-2" autoFocus placeholder={`Search ${icons.length || ''} icons…`}
            value={query} onChange={(e) => setQuery(e.target.value)} />

          {icons.length === 0 && <p className="small text-muted mb-0">Loading icons…</p>}

          {icons.length > 0 && shown.length === 0 && (
            <p className="small text-muted mb-0">Nothing matches “{query}”.</p>
          )}

          <div className="icon-picker-grid">
            {shown.map((name) => (
              <button type="button" key={name} title={name}
                className={`icon-picker-cell ${value === `bi-${name}` ? 'selected' : ''}`}
                onClick={() => pick(name)}>
                <i className={`bi bi-${name}`}></i>
              </button>
            ))}
          </div>

          {!query && <p className="small text-muted mt-2 mb-0">Common picks. Type to search all {icons.length}.</p>}
        </div>
      )}
    </div>
  );
}
