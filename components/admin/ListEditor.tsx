'use client';

import { IconField, TagsField, Text } from './fields';

export type FieldDef<T> = { key: keyof T & string; label: string; type?: 'text' | 'area' | 'icon' | 'tags' };

// Add / edit / remove / reorder rows. Saving is handled by the parent form.
export function ListEditor<T extends { order: number }>({
  title, items, onChange, fields, blank, itemLabel, grid,
}: {
  title: string; items: T[]; onChange: (update: (items: T[]) => T[]) => void;
  fields: FieldDef<T>[]; blank: () => T; itemLabel: (item: T) => string;
  /** Lay the rows out in a grid of this many per row (wide screens only). */
  grid?: 2 | 3;
}) {
  const renumber = (list: T[]) => list.map((it, n) => ({ ...it, order: n }));
  // Every change is expressed against the current list, not the rendered one.
  const patch = (i: number, p: Partial<T>) =>
    onChange((list) => list.map((it, n) => (n === i ? { ...it, ...p } : it)));
  const move = (i: number, d: number) => {
    onChange((list) => {
      const j = i + d;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return renumber(next);
    });
  };

  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="h6 mb-0 fw-semibold">{title}</h3>
        <button type="button" className="btn btn-sm btn-outline-primary"
          onClick={() => onChange((list) => renumber([...list, blank()]))}>
          + Add
        </button>
      </div>

      {items.length === 0 && <p className="text-muted small">Nothing here yet.</p>}

      <div className={grid ? `admin-list-grid admin-list-grid-${grid}` : undefined}>
      {items.map((item, i) => (
        <div key={`row-${i}`} className="admin-list-item">
          <div className="d-flex justify-content-between mb-2">
            <strong className="small">{itemLabel(item) || 'New item'}</strong>
            <span className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-secondary" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="btn btn-outline-secondary" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="btn btn-outline-danger"
                onClick={() => onChange((list) => renumber(list.filter((_, n) => n !== i)))}>Delete</button>
            </span>
          </div>

          {fields.map((f) => {
            const raw = item[f.key];
            const set = (v: unknown) => patch(i, { [f.key]: v } as Partial<T>);
            if (f.type === 'icon') return <IconField key={f.key} label={f.label} value={String(raw ?? '')} onChange={set} />;
            if (f.type === 'tags') {
              return <TagsField key={f.key} label={f.label} value={Array.isArray(raw) ? raw as string[] : []} onChange={set} />;
            }
            return <Text key={f.key} label={f.label} value={String(raw ?? '')} onChange={set} area={f.type === 'area'} />;
          })}
        </div>
      ))}
      </div>
    </div>
  );
}
