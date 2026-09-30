'use client';
import Link from 'next/link';
import {useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {useRealtime,type ChatMessage} from './realtime-provider';
import {OfferTermsForm,type OfferTerms,offerLabel} from './offer-terms-form';
export function ListingOfferActions({listingId,initial}:{listingId:string;initial:OfferTerms}) {
  const rt=useRealtime()!;
  const router=useRouter();
  const [mode,setMode]=useState<'buy'|'offer'|null>(null);
  const [pending,setPending]=useState(false);
  const [error,setError]=useState('');
  const requestId=useRef('');
  async function send(terms?:OfferTerms) {
    setPending(true);setError('');
    if(!requestId.current)requestId.current=crypto.randomUUID();
    try {const message=await rt.request<ChatMessage>('offer.create',{listingId,buy:mode==='buy',terms,requestId:requestId.current});router.push(`/messages?conversation=${encodeURIComponent(message.conversationId)}`);}
    catch(error){setError(error instanceof Error?error.message:'Could not send offer.');}
    finally{setPending(false);}
  }
  if(!rt.authenticated)return <Link className="primary" href={`/login?next=${encodeURIComponent(`/listings/${listingId}`)}`}>Sign in to buy or make an offer</Link>;
  return <section className="listing-offer-actions"><div className="offer-buttons"><button className="primary" onClick={()=>{setMode('buy');requestId.current='';}}>{initial.kind==='item'?'Offer requested item':'Buy'}</button><button className="secondary" onClick={()=>{setMode('offer');requestId.current='';}}>Make offer</button></div>
    {mode && <div className="offer-prompt"><h3>{mode==='buy'?'Send a purchase request':'Make an offer'}</h3><p>This sends an automated offer message to the seller. They can accept, decline, or counter. You’ll exchange the items in-game.</p>
    {mode==='buy'?<><p><strong>{offerLabel(initial)}</strong></p><button className="primary" disabled={pending || !rt.connected} onClick={()=>void send()}>{pending?'Sending…':'Send request to seller'}</button></>:<OfferTermsForm initial={initial} pending={pending || !rt.connected} onSubmit={terms=>void send(terms)} label="Send offer to seller"/>}
    {!rt.connected && <p>Connecting to chat…</p>}<button className="secondary" disabled={pending} onClick={()=>setMode(null)}>Cancel</button>{error && <p role="alert">{error}</p>}</div>}
  </section>;
}
