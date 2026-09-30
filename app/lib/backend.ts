import { cookies } from 'next/headers';

export const sessionCookie = 'nextazon-session';
export const backendUrl = () => process.env.BACKEND_URL || 'http://127.0.0.1:3002';

export async function backendFetch(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get(sessionCookie)?.value;
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(new URL(path, backendUrl()), { ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(5000) });
}
