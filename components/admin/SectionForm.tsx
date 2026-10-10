'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteContent } from '@/lib/defaults';

/**
 * Wraps one admin page: holds a working copy of the whole content document,
 * saves it, and renders the sticky save bar. Each page decides which parts of
 * the draft it shows.
 */
export function SectionForm({
  initial,
  children,
}: {
  initial: SiteContent;
  children: (
    draft: SiteContent,
    patch: (p: Partial<SiteContent> | ((d: SiteContent) => Partial<SiteContent>)) => void,
  ) => React.ReactNode;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<SiteContent>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ text: string; kind?: 'ok' | 'error' }>({ text: '' });

  // Takes either an object or a function of the *current* draft. The function
  // form matters: several fields can change before React re-renders, and
  // building a patch from a captured `draft` would discard the earlier ones.
  const patch = (p: Partial<SiteContent> | ((d: SiteContent) => Partial<SiteContent>)) => {
    setDraft((d) => ({ ...d, ...(typeof p === 'function' ? p(d) : p) }));
    setDirty(true);
    setStatus({ text: '' });
  };

  async function save() {
    setSaving(true);
    setStatus({ text: 'Saving…' });
    try {
      const res = await fetch('/api/content', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft),
      });
      if (res.status === 401) {
        router.refresh();
        throw new Error('Session expired – sign in again');
      }
      if (!res.ok) throw new Error('Server error');
      setDraft(await res.json());
      setDirty(false);
      setStatus({ text: 'Saved', kind: 'ok' });
      router.refresh(); // so the public pages pick the new content up
    } catch (e) {
      setStatus({ text: (e as Error).message, kind: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-content">{children(draft, patch)}</div>
      <div className="admin-savebar">
        <button className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => { setDraft(initial); setDirty(false); setStatus({ text: '' }); }}
          disabled={saving || !dirty}>
          Discard
        </button>
        <span className={`admin-status ${status.kind ?? ''}`}>
          {status.text || (dirty ? 'Unsaved changes' : 'Up to date')}
        </span>
      </div>
    </>
  );
}
