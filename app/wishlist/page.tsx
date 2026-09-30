import { getAccount } from '../lib/auth';
import { SignInPrompt } from '../components/sign-in-prompt';
import { Marketplace } from '../components/marketplace';
import { listingQuery } from '../lib/query';
export default async function Wishlist({ searchParams }: PageProps<'/wishlist'>) {
  if (!await getAccount()) return <SignInPrompt title="Keep your favorite finds close." description="Sign in or create an account to save and view your wishlist." next="/wishlist" />;
  return <Marketplace scope="wishlist" basePath="/wishlist" query={listingQuery(await searchParams)} />;
}
