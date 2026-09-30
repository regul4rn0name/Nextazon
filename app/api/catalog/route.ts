import { backendFetch } from '../../lib/backend';
export async function GET(request: Request) {
  try {
    const response = await backendFetch(`/catalog${new URL(request.url).search}`);
    return Response.json(await response.json(), {status:response.status});
  } catch { return Response.json({error:'Catalog temporarily unavailable.'},{status:503}); }
}
