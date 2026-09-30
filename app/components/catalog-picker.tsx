'use client';
import Image from 'next/image';
import { useEffect, useId, useState } from 'react';
export interface CatalogItem { id:string; name:string; image:string; category:string; variant:string }
interface CatalogPage {items:CatalogItem[];total:number;page:number;pageSize:number}
export function CatalogPicker({label,value,onChange}:{label:string;value:CatalogItem|null;onChange:(item:CatalogItem)=>void}) {
  const id=useId();
  const [query,setQuery]=useState('');
  const [page,setPage]=useState(1);
  const [data,setData]=useState<CatalogPage|null>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const controller=new AbortController();
    const timer=setTimeout(async()=>{
      setLoading(true);setError('');
      try {
        const response=await fetch(`/api/catalog?${new URLSearchParams({q:query,page:String(page),limit:'12'})}`,{signal:controller.signal});
        const result=await response.json();
        if(!response.ok) throw new Error(result.error || 'Could not search catalog.');
        setData(result);
      } catch(error) {if(!controller.signal.aborted)setError(error instanceof Error?error.message:'Search failed.');}
      finally {if(!controller.signal.aborted)setLoading(false);}
    },250);
    return ()=>{clearTimeout(timer);controller.abort();};
  },[query,page]);
  return <section className="catalog-picker" aria-busy={loading}>
    <label htmlFor={id}>{label}</label>
    {value && <p className="catalog-selection">Selected: <strong>{value.name}</strong> · {value.variant}</p>}
    <input id={id} value={query} maxLength={100} placeholder="Search item names in any supported language" onChange={event=>{setQuery(event.target.value);setPage(1);setLoading(true);}} />
    <p className="catalog-status" role="status">{loading?'Searching…':error || `${data?.total.toLocaleString() || 0} catalog entries`}</p>
    {!error && <div className="catalog-results">{data?.items.map(item=><button type="button" key={item.id} disabled={loading} aria-pressed={value?.id===item.id} onClick={()=>onChange(item)}>
      <Image src={item.image} alt="" width={48} height={48} unoptimized/><span><strong>{item.name}</strong><small>{item.category} · {item.variant}</small></span>
    </button>)}</div>}
    <div className="catalog-pagination"><button type="button" disabled={page===1 || loading} onClick={()=>{setPage(page-1);setLoading(true);}}>Previous</button><span>Page {page}</span><button type="button" disabled={loading || !data || page*data.pageSize>=data.total} onClick={()=>{setPage(page+1);setLoading(true);}}>Next</button></div>
  </section>;
}
