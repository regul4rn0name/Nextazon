import { backendFetch } from '../../lib/backend';
export async function POST(request:Request) {
  const origin=request.headers.get('origin');
  if(!origin || new URL(origin).host!==request.headers.get('host')) return Response.json({error:'Origin not allowed.'},{status:403});
  try {
    const response=await backendFetch('/realtime-ticket',{method:'POST'});
    return Response.json(await response.json(),{status:response.status});
  } catch {return Response.json({error:'Chat unavailable.'},{status:503});}
}
