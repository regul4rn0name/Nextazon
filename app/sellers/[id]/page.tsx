import { Marketplace } from '../../components/marketplace';
import { listingQuery } from '../../lib/query';
export default async function Seller({ params, searchParams }: PageProps<'/sellers/[id]'>) {
  const { id } = await params;
  return <Marketplace sellerId={id} basePath={`/sellers/${encodeURIComponent(id)}`} query={listingQuery(await searchParams)} />;
}
