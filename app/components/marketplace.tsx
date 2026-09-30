import Link from 'next/link';
import { CategorySidebar } from './category-sidebar';
import { ListingFilters } from './listing-filters';
import { ListingGrid } from './listing-grid';
import { MarketplaceHero } from './marketplace-hero';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { getListings, ListingsError } from '../lib/listings';
import type { ListingQuery } from '../lib/query';
import { ListingPagination } from './listing-pagination';

interface Props { query?: ListingQuery; scope?: 'wishlist' | 'mine'; sellerId?: string; basePath?: string }
export async function Marketplace({ query = {}, scope, sellerId, basePath = '/' }: Props) {
  let listings = null;
  let error = '';
  try { listings = await getListings({ ...query, ...(scope ? { scope } : {}), ...(sellerId ? { seller: sellerId } : {}) }); }
  catch (failure) { error = failure instanceof ListingsError && failure.status === 400 ? failure.message : 'Listings are temporarily unavailable. Please try again.'; }
  const title = scope === 'wishlist' ? 'Your wishlist' : scope === 'mine' ? 'Your listings' : sellerId ? 'Shop this islander’s listings' : 'Discover your next find';
  return <>
    <SiteHeader active={basePath} />
    <main className="shell">
      {!scope && !sellerId && <MarketplaceHero chairImage="https://acnhcdn.com/latest/FtrIcon/FtrStarMoonChairL_Remake_0_0.png" plantImage="https://acnhcdn.com/latest/FtrIcon/FtrPlantMonstera_Remake_0_0.png" />}
      {(scope || sellerId) && <div className="page-intro"><div className="eyebrow">YOUR ISLAND COMMUNITY</div><h1>{title}</h1><p>{scope ? 'Saved to your account, ready whenever you sign in.' : 'Browse items from this seller and find your next island treasure.'}</p>{scope === 'mine' && <Link className="primary" href="/listings/new">＋ Create a listing</Link>}</div>}
      <div className="market-layout" id="marketplace">
        <CategorySidebar counts={listings?.categoryCounts ?? {}} query={query} basePath={basePath} />
        <section className="market-content" aria-label="Marketplace listings">
          <div className="section-heading"><div><div className="eyebrow muted">THE COMMUNITY MARKETPLACE</div><h2>{title}</h2></div></div>
          <ListingFilters key={JSON.stringify(query)} count={listings?.total ?? 0} query={query} basePath={basePath} />
          {listings ? <><ListingGrid items={listings.items} /><ListingPagination page={listings.page} pageSize={listings.pageSize} total={listings.total} query={query} basePath={basePath} /></> : <div className="empty" role="alert"><h3>{error}</h3><Link className="secondary" href={basePath}>Reset and try again</Link></div>}
        </section>
      </div>
      <SiteFooter />
    </main>
  </>;
}
