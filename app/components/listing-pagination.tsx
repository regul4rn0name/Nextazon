import Link from 'next/link';
import { listingUrl, type ListingQuery } from '../lib/query';
interface Props { page: number; pageSize: number; total: number; query: ListingQuery; basePath: string }
export function ListingPagination({ page, pageSize, total, query, basePath }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <nav className="filter-row" aria-label="Listing pages">
      {page > 1 ? <Link className="secondary" href={listingUrl(basePath, query, { page: String(Math.min(page - 1, pages)) })}>← Previous</Link> : <span />}
      <span>Page {page} of {pages} · {total} listings</span>
      {page < pages ? <Link className="secondary" href={listingUrl(basePath, query, { page: String(page + 1) })}>Next →</Link> : <span />}
    </nav>
  );
}
