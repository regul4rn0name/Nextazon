'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRealtime,type ChatMessage} from './realtime-provider';
import {OfferTermsForm,type OfferTerms,offerLabel} from './offer-terms-form';
export interface TradeOffer {listingId:string;listingName:string;buyerId:string;sellerId:string;proposerId:string;recipientId:string;terms:OfferTerms;status:'pending'|'accepted'|'declined';version:number;hostId?:string;dodoCode?:string;codeRequestAvailableAt?:string;codeRequested?:boolean}
export function ChatOfferCard({message,userId,onUpdate}:{message:ChatMessage;userId:string;onUpdate:(message:ChatMessage)=>void}) {
  const offer=message.offer!;
  const rt=useRealtime()!;
  const [counter,setCounter]=useState(false);
  const [pending,setPending]=useState(false);
  const [error,setError]=useState('');
  async function act(action:string,data:Record<string,unknown>={}) {
    setPending(true);setError('');
    try {const updated=await rt.request<ChatMessage>(action,{messageId:message._id,version:offer.version,...data});onUpdate(updated);setCounter(false);}
    catch(error){setError(error instanceof Error?error.message:'Could not update offer.');}finally{setPending(false);}
  }
  return <section className="chat-offer-card"><h3><Link href={`/listings/${encodeURIComponent(offer.listingId)}`}>{offer.listingName}</Link></h3><p><strong>{offerLabel(offer.terms)}</strong></p><p>Status: {offer.status}</p>
    {offer.status==='pending' && (offer.recipientId===userId?<><div className="offer-buttons"><button className="primary" disabled={pending || !rt.connected} onClick={()=>void act('offer.accept')}>Accept offer</button><button className="secondary" disabled={pending} onClick={()=>setCounter(!counter)}>Counteroffer</button><button className="secondary" disabled={pending || !rt.connected} onClick={()=>void act('offer.decline')}>Decline</button></div>{counter && <OfferTermsForm initial={offer.terms} pending={pending || !rt.connected} onSubmit={terms=>void act('offer.counter',{terms})} label="Send counteroffer"/>}</>:<p>Waiting for the other player to accept or counter.</p>)}
    {offer.status==='accepted' && <p>Offer accepted. Use the airport-code banner above this chat to arrange your visit.</p>}
    {error && <p role="alert" className="form-error">{error}</p>}
  </section>;
}
