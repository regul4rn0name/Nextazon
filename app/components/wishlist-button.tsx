'use client';
import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function WishlistButton({ id, name, saved = false, compact = false }: { id: string; name: string; saved?: boolean; compact?: boolean }) {
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  function toggle() {
    startTransition(async () => {
      setError('');
      try {
        const response = await fetch(`/api/wishlist/${encodeURIComponent(id)}`, { method: saved ? 'DELETE' : 'PUT' });
        if (response.status === 401) {
          const next = pathname + (query.size ? `?${query}` : '');
          router.push(`/login?next=${encodeURIComponent(next)}`);
          return;
        }
        if (!response.ok) throw new Error((await response.json()).error);
        router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : 'Could not update wishlist.'); }
    });
  }
  return <>
    <button className={compact ? `heart ${saved ? 'saved' : ''}` : 'secondary'} type="button" onClick={toggle} disabled={pending} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${name} ${saved ? 'from' : 'to'} wishlist`}>
      {pending ? '…' : saved ? '♥' : '♡'}{!compact && (saved ? ' Saved to wishlist' : ' Save to wishlist')}
    </button>
    {error && <span className="action-error" role="alert">{error}</span>}
  </>;
}
