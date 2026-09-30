'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
export function DeleteListingButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function remove() {
    startTransition(async () => {
      setError('');
      try {
        const result = await fetch(`/api/listings/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!result.ok) throw new Error((await result.json()).error);
        router.push('/my-listings');router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : 'Could not delete listing.'); }
    });
  }
  return <div className="manage-listing">
    {confirming ? <><p>Remove this listing permanently?</p><button className="secondary" onClick={remove} disabled={pending}>{pending ? 'Removing…' : 'Yes, remove listing'}</button> <button onClick={() => setConfirming(false)} disabled={pending}>Cancel</button></> : <button className="secondary" onClick={() => setConfirming(true)}>Remove my listing</button>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
