import { ChatUnread } from './realtime-provider';
import Link from 'next/link';
import { Leaf } from './leaf';
import { getAccount } from '../lib/auth';
import { SignOutButton } from './sign-out-button';

export async function SiteHeader({ active = '/' }: { active?: string }) {
  const account = await getAccount();
  return <header className="header"><div className="header-inner">
    <Link className="brand" href="/" aria-label="Nextazon home"><span className="brand-icon"><Leaf /></span>nextazon<span className="brand-dot">.</span></Link>
    <nav className="top-nav" aria-label="Main navigation">
      {[['/', 'Explore'], ['/wishlist', 'Wishlist'], ['/messages', 'Chat'], ['/my-listings', 'My listings']].map(([href, label]) => (
        <Link key={href} href={href} className={active === href ? 'active' : ''} aria-current={active === href ? 'page' : undefined}>{label}{href === "/messages" && <ChatUnread />}</Link>
      ))}
    </nav>
    <div className="header-actions">
      <Link className="secondary create-link" href="/listings/new">＋ <span>Create a listing</span></Link>
      {account ? <><Link className="account-name" href={`/sellers/${encodeURIComponent(account.id)}`}>{account.username}</Link><SignOutButton /></> : <Link className="primary sign-in-link" href="/login">Sign in</Link>}
    </div>
  </div></header>;
}
