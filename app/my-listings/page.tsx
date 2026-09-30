import { getAccount } from '../lib/auth';
import { SignInPrompt } from '../components/sign-in-prompt';
import { Marketplace } from '../components/marketplace';
import { listingQuery } from '../lib/query';
export default async function MyListings({ searchParams }: PageProps<'/my-listings'>) {
  if (!await getAccount()) return <SignInPrompt title="Your little island shop." description="Sign in or create an account to view and manage your listings." next="/my-listings" />;
  return <Marketplace scope="mine" basePath="/my-listings" query={listingQuery(await searchParams)} />;
}
