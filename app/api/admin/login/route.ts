import { checkPassword, startSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!checkPassword(String(password ?? ''))) {
    await new Promise((r) => setTimeout(r, 500)); // slow down guessing
    return Response.json({ error: 'Wrong password' }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}
