export type SearchParams = Record<string, string | string[] | undefined>;
export type ListingQuery = Record<string, string>;
const keys = ['q', 'category', 'online', 'sort', 'minPrice', 'maxPrice', 'currency', 'page'];

export function listingQuery(params: SearchParams): ListingQuery {
  return Object.fromEntries(keys.flatMap(key => typeof params[key] === 'string' && params[key] !== '' ? [[key, params[key]]] : []));
}

export function listingUrl(basePath: string, query: ListingQuery, patch: ListingQuery = {}): string {
  const merged = { ...query, ...patch };
  const params = new URLSearchParams(Object.entries(merged).filter(([, value]) => value !== ''));
  return `${basePath}${params.size ? `?${params}` : ''}`;
}
