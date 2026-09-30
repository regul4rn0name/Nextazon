import { getAccount } from '../../lib/auth';
import { SignInPrompt } from '../../components/sign-in-prompt';
import Link from 'next/link';
import { CreateListingForm } from '../../components/create-listing-form';
import { PageShell } from '../../components/page-shell';

export default async function NewListing() {
  const account = await getAccount();
  if (!account) return <SignInPrompt title="Share your next island treasure." description="Sign in or create an account before creating a listing." next="/listings/new" />;
  return <PageShell active="/my-listings">
    <div className="page-intro"><Link href="/my-listings">← My listings</Link><h1>Share a little island magic.</h1><p>Create a listing and help someone find their next favorite thing.</p></div>
    <CreateListingForm username={account.username} />
  </PageShell>;
}
