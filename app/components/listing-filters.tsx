import Link from 'next/link';
import type { ListingQuery } from '../lib/query';

interface Props { count: number; query: ListingQuery; basePath: string }
export function ListingFilters({ count, query, basePath }: Props) {
  return (
    <form action={basePath} method="get" className="listing-filter-form">
      {query.category && <input type="hidden" name="category" value={query.category} />}
      <div className="search-row">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input name="q" aria-label="Search items" placeholder="Search furniture, villagers, and little treasures…" defaultValue={query.q || ''} maxLength={100} />
        </label>
        <label className="sort"><span className="sr-only">Sort listings</span>
          <select name="sort" defaultValue={query.sort || 'newest'}>
            <option value="newest">Newest first</option><option value="priceAsc">Price: low to high (by currency)</option>
            <option value="priceDesc">Price: high to low (by currency)</option><option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>
      <div className="price-filters">
        <label>Offer<select name="currency" defaultValue={query.currency || ""}><option value="">All offers</option><option>Bells</option><option>Nook Miles Tickets</option><option value="trade">Item trades</option></select></label>
        <label>Min amount<input name="minPrice" type="number" min="0" max="999999999" step="1" defaultValue={query.minPrice || ''} placeholder="Any" /></label>
        <label>Max amount<input name="maxPrice" type="number" min="0" max="999999999" step="1" defaultValue={query.maxPrice || ''} placeholder="Any" /></label>
        <label className="online-toggle"><input name="online" value="true" type="checkbox" defaultChecked={query.online === 'true'} /><span className="toggle-track" />Online sellers only</label>
        <button className="primary" type="submit">Apply filters</button>
        <Link className="reset-link" href={basePath}>Reset</Link>
      </div>
      <div className="filter-row"><span className="filter-chip">{query.category || 'All items'}</span><span>{count} matching listings</span></div>
    </form>
  );
}
