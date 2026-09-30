'use client';
import {useEffect,useState} from 'react';
import {useRealtime,type ChatMessage} from './realtime-provider';

export function AirportCodeBanner({conversationId,userId}:{conversationId:string;userId:string}) {
  const {connected,request,subscribe}=useRealtime()!;
  const [offers,setOffers]=useState<ChatMessage[]>([]);
  const [now,setNow]=useState(()=>Date.now());
  const [error,setError]=useState('');
  const [pending,setPending]=useState(false);
  useEffect(()=>{
    const timer=setInterval(()=>setNow(Date.now()),1000);
    return ()=>clearInterval(timer);
  },[]);
  useEffect(()=>{
    if(!connected)return;
    let cancelled=false;
    const load=()=>request<ChatMessage[]>('offer.list',{conversationId}).then(rows=>{if(!cancelled)setOffers(rows);}).catch(error=>{if(!cancelled)setError(error.message);});
    void load();
    const unsubscribe=subscribe(message=>{if(message.conversationId===conversationId && message.offer)void load();});
    return ()=>{cancelled=true;unsubscribe();};
  },[connected,conversationId,request,subscribe]);
  if(!offers.length)return error?<p role="alert">{error}</p>:null;
  return <aside className="airport-code-banner" aria-label="Airport codes">
    {offers.map(message=>{
      const offer=message.offer!;
      const availableAt=offer.codeRequestAvailableAt?Date.parse(offer.codeRequestAvailableAt):0;
      const seconds=Math.max(0,Math.ceil((availableAt-now)/1000));
      const valid=!!offer.dodoCode;
      const seller=offer.sellerId===userId;
      return <section key={message._id}><h3>Airport visit · {offer.listingName}</h3>
        {valid?<><p>Dodo Code: <strong className="dodo-code">{offer.dodoCode}</strong></p><p>{seller?'Your buyer can see this code.':'Enter this code at your in-game airport.'}</p></>:<p role="status">{seller?'Offer accepted! Open your gates in-game and enter your Dodo Code below.':'Waiting for the seller to share a Dodo Code.'}</p>}
        {offer.codeRequested && <p role="status">{seller?'The buyer asked for a new Dodo Code. Enter an updated code below when ready.':'New code requested. Waiting for the seller; the current code remains visible.'}</p>}
        {!seller && valid && <><button className="secondary" disabled={!connected || pending || seconds>0 || offer.codeRequested} onClick={async()=>{
          setPending(true);setError('');
          try {const updated=await request<ChatMessage>('offer.requestCode',{messageId:message._id,version:offer.version});setOffers(rows=>rows.map(row=>row._id===updated._id?updated:row));}
          catch(error){setError(error instanceof Error?error.message:'Could not request a code.');}finally{setPending(false);}
        }}>{offer.codeRequested?'New code requested':'Ask for a new code'}</button>{seconds>0 && !offer.codeRequested && <p>You can ask for a new code in {seconds}s.</p>}</>}
        {seller && <form key={`${message._id}-${offer.version}-${valid}`} onSubmit={async event=>{
          event.preventDefault();const code=new FormData(event.currentTarget).get('code');setPending(true);setError('');
          try {const updated=await request<ChatMessage>('offer.code',{messageId:message._id,version:offer.version,code});setOffers(rows=>rows.map(row=>row._id===updated._id?updated:row));setNow(Date.now());}
          catch(error){setError(error instanceof Error?error.message:'Could not share code.');}finally{setPending(false);}
        }}><label>Dodo Code from the game<input name="code" autoComplete="off" minLength={5} maxLength={5} pattern="[A-Za-z0-9]{5}" placeholder="ABCDE" required/></label><button className="primary" disabled={!connected || pending}>{pending?'Sharing…':valid?'Update code':'Share fresh code'}</button></form>}
        <small>The code stays visible until the seller updates it. After 120 seconds, the buyer can ask for a replacement.</small>
      </section>;
    })}{error && <p role="alert">{error}</p>}
  </aside>;
}
