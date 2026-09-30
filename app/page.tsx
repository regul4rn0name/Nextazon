import { Marketplace } from './components/marketplace';
import { listingQuery } from './lib/query';
export default async function Home({ searchParams }: PageProps<'/'>) {
  return <Marketplace query={listingQuery(await searchParams)} />;
}
