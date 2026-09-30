'use client';
import { AirportCodeBanner } from './airport-code-banner';
import { ChatOfferCard } from './chat-offer-card';
import { ChatPrivacyNotice } from './chat-privacy-notice';
import {useEffect,useState,useRef} from 'react';
import {useRealtime,Presence,type ChatMessage} from './realtime-provider';
export function ChatPanel({userId,peerId,conversationId}:{userId:string;peerId?:string;conversationId?:string}) {
  const rt=useRealtime()!;
  const {connected,request,refresh,subscribe}=rt;
  const [active,setActive]=useState(conversationId || '');
  const [messages,setMessages]=useState<ChatMessage[]>([]);
  const [text,setText]=useState('');
  const [error,setError]=useState('');
  const [sending,setSending]=useState(false);
  const [loading,setLoading]=useState(true);
  const [more,setMore]=useState(false);
  const bottom=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(!connected || !peerId)return;
    let cancelled=false;
    request<{id:string}>('start',{peerId}).then(async c=>{if(!cancelled)setActive(c.id);await refresh();}).catch(e=>setError(e.message));
    return ()=>{cancelled=true;};
  },[connected,peerId,request,refresh]);
  useEffect(()=>{
    if(!connected || !active)return;
    let cancelled=false;
    request<ChatMessage[]>('history',{conversationId:active}).then(rows=>{if(!cancelled){setMessages(current=>[...rows,...current.filter(m=>m.conversationId===active && !rows.some(r=>r._id===m._id))]);setMore(rows.length===50);}}).catch(e=>{if(!cancelled)setError(e.message);}).finally(()=>{if(!cancelled)setLoading(false);});
    return ()=>{cancelled=true;};
  },[active,connected,request]);
  useEffect(()=>subscribe(message=>{
    if(message.conversationId===active)setMessages(rows=>rows.some(m=>m._id===message._id)?rows.map(m=>m._id===message._id && (m.offer?.version || 0)<=(message.offer?.version || 0)?message:m):[...rows,message]);
  }),[subscribe,active]);
  useEffect(()=>{
    const read=()=>{
      const ids=messages.filter(m=>m.senderId!==userId && !m.readAt).map(m=>m._id);
      if(connected && document.visibilityState==='visible' && ids.length)void request('read',{conversationId:active,ids:ids.slice(-100)}).catch(()=>{});
    };
    read();document.addEventListener('visibilitychange',read);
    bottom.current?.scrollIntoView({block:'nearest'});
    return ()=>document.removeEventListener('visibilitychange',read);
  },[messages,active,userId,connected,request]);
  async function send(event:React.FormEvent) {
    event.preventDefault();setSending(true);setError('');
    try {const message=await request<ChatMessage>('send',{conversationId:active,text});setMessages(rows=>rows.some(m=>m._id===message._id)?rows.map(m=>m._id===message._id && (m.offer?.version || 0)<=(message.offer?.version || 0)?message:m):[...rows,message]);setText('');}
    catch(e){setError(e instanceof Error?e.message:'Could not send.');}finally{setSending(false);}
  }
  const current=rt.conversations.find(c=>c.id===active);
  return <section className="chat-layout">
    <aside className="chat-sidebar"><h2>Conversations</h2><p>{connected?'Connected':'Reconnecting…'}</p>{!rt.conversations.length && <p>Open a listing and choose “Message seller” to start.</p>}{rt.conversations.map(c=><button key={c.id} className={active===c.id?'selected':''} onClick={()=>{setActive(c.id);setLoading(true);setMessages([]);setError('');}}><strong>{c.username} {c.unread>0 && <span className="unread-badge">{c.unread}</span>}</strong><Presence userId={c.peerId}/><small>{c.lastMessage || 'Start a conversation'}</small></button>)}</aside>
    <div className="chat-thread"><ChatPrivacyNotice />{active ? <><header><h2>{current?.username || 'Conversation'}</h2>{current && <Presence userId={current.peerId}/>}</header><AirportCodeBanner key={active} conversationId={active} userId={userId}/><div className="chat-messages" aria-live="polite">{loading && <p>Loading messages…</p>}{more && <button type="button" onClick={async()=>{try {const older=await request<ChatMessage[]>('history',{conversationId:active,before:messages[0]?._id});setMessages(rows=>[...older,...rows]);setMore(older.length===50);}catch(e){setError(e instanceof Error?e.message:'Could not load history.');}}}>Load older messages</button>}{messages.filter(m=>m.conversationId===active).map(m=><article key={m._id} className={`chat-bubble ${m.senderId===userId?'mine':''}`}><p>{m.text}</p>{m.offer && <ChatOfferCard message={m} userId={userId} onUpdate={updated=>setMessages(rows=>rows.map(row=>row._id===updated._id?updated:row))}/>}<time>{new Date(m.createdAt).toLocaleString()}</time></article>)}<div ref={bottom}/></div><form onSubmit={send}><label className="sr-only" htmlFor="chat-message">Message</label><textarea aria-describedby="chat-privacy-description" id="chat-message" maxLength={2000} value={text} onChange={e=>setText(e.target.value)} placeholder="Arrange your trade…" required/><button className="primary" disabled={!connected || sending || loading || !text.trim()}>{sending?'Sending…':'Send'}</button></form></>:<p>Select a conversation to start chatting.</p>}{error && <p role="alert" className="form-error">{error}</p>}</div>
  </section>;
}
