'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      });
      if (res.ok) router.refresh();
      else setError('Wrong password');
    } catch {
      setError('Could not reach the server');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={submit}>
        <h1 className="h5 mb-1">Portfolio admin</h1>
        <p className="text-muted small mb-4">Sign in to edit the site content.</p>
        <label className="form-label small fw-semibold">Password</label>
        <input type="password" className="form-control mb-3" autoFocus autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-danger small">{error}</p>}
        <button className="btn btn-primary w-100" disabled={busy || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <a href="/" className="d-block text-center small mt-3 text-decoration-none">← Back to the site</a>
      </form>
    </div>
  );
}
