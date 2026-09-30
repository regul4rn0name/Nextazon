import { cookies } from 'next/headers';
import { backendUrl, sessionCookie } from '../../lib/backend';

async function mutate(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host') || new URL(request.url).host;
  if (origin) {
    try { if (new URL(origin).host !== host) return Response.json({ error: 'Origin not allowed.' }, { status: 403 }); }
    catch { return Response.json({ error: 'Invalid origin.' }, { status: 403 }); }
  }
  const { path } = await context.params;
  const auth = path.length === 2 && path[0] === 'auth' && ['login', 'register', 'logout'].includes(path[1]) && request.method === 'POST';
  const valid = auth || (path.length === 1 && path[0] === 'listings' && request.method === 'POST') ||
    (path.length === 2 && ((path[0] === 'wishlist' && ['PUT', 'DELETE'].includes(request.method)) || (path[0] === 'listings' && request.method === 'DELETE')));
  if (!valid) return Response.json({ error: 'Not found.' }, { status: 404 });
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookie)?.value;
    if (!auth && !token) return Response.json({ error: 'Please sign in or create an account.' }, { status: 401 });
    const body = request.method === 'POST' ? await request.text() : undefined;
    if (body && body.length > 16384) return Response.json({ error: 'Request too large.' }, { status: 400 });
    const result = await fetch(new URL(`/${path.map(encodeURIComponent).join('/')}`, backendUrl()), {
      method: request.method, headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': request.headers.get('x-forwarded-for') || '127.0.0.1', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body, cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    const data = await result.json();
    if (auth && result.ok) {
      if (path[1] === 'logout') cookieStore.delete(sessionCookie);
      else {
        if (typeof data.token !== 'string') throw new Error('Invalid session');
        cookieStore.set(sessionCookie, data.token, { httpOnly: true, sameSite: 'lax', secure: request.headers.get('x-forwarded-proto') === 'https' || new URL(request.url).protocol === 'https:', path: '/', maxAge: 30 * 86400 });
      }
    }
    // Session tokens only go into the HttpOnly cookie, never browser JavaScript.
    delete data.token;
    return Response.json(data, { status: result.status });
  } catch { return Response.json({ error: 'The backend is unavailable. Please try again.' }, { status: 503 }); }
}
export const POST = mutate;
export const PUT = mutate;
export const DELETE = mutate;

export async function GET(request: Request, context: { params: Promise<{path:string[]}> }) {
  const {path}=await context.params;
  const valid=(path.length===1 && ['listings','catalog'].includes(path[0])) ||
    (path.length===2 && (path[0]==='listings' || (path[0]==='auth' && path[1]==='me')));
  if(!valid)return Response.json({error:'Not found.'},{status:404});
  try {
    const token=(await cookies()).get(sessionCookie)?.value;
    const response=await fetch(new URL(`/${path.map(encodeURIComponent).join('/')}${new URL(request.url).search}`,backendUrl()),{
      headers:token?{Authorization:`Bearer ${token}`}:{},cache:'no-store',signal:AbortSignal.timeout(10000)
    });
    return Response.json(await response.json(),{status:response.status});
  }catch{return Response.json({error:'Backend unavailable.'},{status:503});}
}
