'use client';
import Image from 'next/image';
import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { CatalogPicker, type CatalogItem } from './catalog-picker';
export function CreateListingForm({ username }: { username: string }) {
  const [selected, setSelected] = useState<CatalogItem|null>(null);
  const [tradeItem, setTradeItem] = useState<CatalogItem|null>(null);
  const [offerType, setOfferType] = useState('price');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      setError('');
      try {
        const response = await fetch('/api/listings', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId: selected?.id, offerType, tradeItemId: tradeItem?.id, currency: form.get('currency'), price: Number(form.get('price')), description: form.get('description') }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not create listing.');
        router.push(`/listings/${encodeURIComponent(result.id)}`);
        router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : 'Please try again.'); }
    });
  }
  return (
    <div className="create-layout">
      <form className="listing-form" onSubmit={submit} aria-busy={pending}>
        <fieldset disabled={pending}>
          <p>Listing as <strong>{username}</strong></p>
          <CatalogPicker label="Item you are offering" value={selected} onChange={setSelected} />
          <label>What would you like in return?<select value={offerType} onChange={event=>setOfferType(event.target.value)}><option value="price">Bells or Nook Miles Tickets</option><option value="trade">Another item</option></select></label>
          {offerType === 'trade' ? <CatalogPicker label="Item you want in exchange" value={tradeItem} onChange={setTradeItem} /> : <>
            <label>Currency<select name="currency"><option>Bells</option><option>Nook Miles Tickets</option></select></label>
            <label>Asking price<input name="price" type="number" min="1" max="999999999" step="1" placeholder="5000" required /></label>
          </>}
          <label>Trade details<textarea name="description" rows={5} maxLength={1000} placeholder="Availability, item details, or anything your fellow islander should know." /></label>
          <p>Online status updates automatically while you are connected.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary" type="submit" disabled={!selected || (offerType === 'trade' && !tradeItem)}>{pending ? 'Publishing…' : 'Publish listing ↗'}</button>
        </fieldset>
      </form>
      <aside className="listing-preview">
        <div className="eyebrow">YOUR NEXT ISLAND TREASURE</div>
        {selected && <><Image src={selected.image} width={240} height={240} alt={selected.name} unoptimized /><h2>{selected.name}</h2><p>{selected.category} · {selected.variant}</p></>}
        <p>Your listing will be stored in the database and managed through your account.</p>
      </aside>
    </div>
  );
}
