'use client';
import { useState } from 'react';
import { CatalogPicker, type CatalogItem } from './catalog-picker';
export type OfferTerms = {kind:'price';amount:number;currency:string} | {kind:'item';itemId:string;name?:string;variant?:string};
export function OfferTermsForm({initial,onSubmit,pending,label}:{initial?:OfferTerms;onSubmit:(terms:OfferTerms)=>void;pending:boolean;label:string}) {
  const [kind,setKind]=useState(initial?.kind || 'price');
  const [item,setItem]=useState<CatalogItem|null>(null);
  return <form className="offer-form" onSubmit={event=>{
    event.preventDefault();const data=new FormData(event.currentTarget);
    if(kind==='item') {const itemId=item?.id || (initial?.kind==='item'?initial.itemId:'');if(itemId)onSubmit({kind:'item',itemId});}
    else onSubmit({kind:'price',amount:Number(data.get('amount')),currency:String(data.get('currency'))});
  }}><fieldset disabled={pending}>
    <label>Offer type<select value={kind} onChange={event=>setKind(event.target.value as 'price'|'item')}><option value="price">Bells or Nook Miles Tickets</option><option value="item">An item</option></select></label>
    {kind==='price'?<><label>Amount<input name="amount" type="number" min="1" max="999999999" step="1" defaultValue={initial?.kind==='price'?initial.amount:1} required/></label><label>Currency<select name="currency" defaultValue={initial?.kind==='price'?initial.currency:'Bells'}><option>Bells</option><option>Nook Miles Tickets</option></select></label></>:<>{initial?.kind==='item' && !item && <p>Current item: {initial.name || initial.itemId} · {initial.variant}</p>}<CatalogPicker label="Item offered" value={item} onChange={setItem}/></>}
    <button className="primary" disabled={pending || (kind==='item' && !item && initial?.kind!=='item')}>{pending?'Sending…':label}</button>
  </fieldset></form>;
}
export function offerLabel(terms:OfferTerms) {
  return terms.kind==='price'?`${terms.amount.toLocaleString()} ${terms.currency}`:`${terms.name || 'Item'}${terms.variant?` · ${terms.variant}`:''}`;
}
