'use client';
import type { TradeOffer } from './chat-offer-card';
import Link from 'next/link';
import {createContext,useContext,useEffect,useRef,useState,useCallback,type ReactNode} from 'react';
export interface ChatMessage {offer?:TradeOffer;_id:string;conversationId:string;senderId:string;text:string;createdAt:string;readAt:string|null}
export interface Conversation {id:string;peerId:string;username:string;unread:number;lastMessage:string}
interface Realtime {connected:boolean;online:string[];conversations:Conversation[];subscribe:(listener:(message:ChatMessage)=>void)=>()=>void;authenticated:boolean;request:<T>(action:string,data?:Record<string,unknown>)=>Promise<T>;refresh:()=>Promise<void>}
const Context=createContext<Realtime|null>(null);
export const useRealtime=()=>useContext(Context);
export function RealtimeProvider({userId,url,children}:{userId?:string;url:string;children:ReactNode}) {
  const socket=useRef<WebSocket|null>(null);
  const pending=useRef(new Map<string,{resolve:(data:unknown)=>void;reject:(error:Error)=>void}>());
  const [connected,setConnected]=useState(false);
  const [online,setOnline]=useState<string[]>([]);
  const [conversations,setConversations]=useState<Conversation[]>([]);
  const listeners=useRef(new Set<(message:ChatMessage)=>void>());
  const subscribe=useCallback((listener:(message:ChatMessage)=>void)=>{listeners.current.add(listener);return ()=>{listeners.current.delete(listener);};},[]);
  const [notice,setNotice]=useState<{name:string;text:string;id:string}|null>(null);
  const request=useCallback(<T,>(action:string,data:Record<string,unknown>={}):Promise<T>=>new Promise((resolve,reject)=>{
    if(socket.current?.readyState!==WebSocket.OPEN) return reject(new Error('Chat is reconnecting. Please try again.'));
    const id=crypto.randomUUID();
    const timer=setTimeout(()=>{pending.current.delete(id);reject(new Error('Chat request timed out.'));},10000);
    pending.current.set(id,{resolve:value=>{clearTimeout(timer);resolve(value as T);},reject:error=>{clearTimeout(timer);reject(error);}});
    socket.current.send(JSON.stringify({action,id,...data}));
  }),[]);
  const refresh=useCallback(async()=>{setConversations(await request<Conversation[]>('conversations'));},[request]);
  useEffect(()=>{
    if(!userId) return;
    let stopped=false;
    let retry:ReturnType<typeof setTimeout>;
    let delay=1000;
    let ws:WebSocket;
    const connect=async()=>{
      try {
        const response=await fetch('/api/realtime-ticket',{method:'POST'});
        if(response.status===401) return;
        if(!response.ok) throw new Error('Unavailable');
        const {ticket}=await response.json();
        if(stopped)return;
        const address=url.startsWith('/') ? `${window.location.protocol==='https:'?'wss:':'ws:'}//${window.location.host}${url}` : url;
        ws=new WebSocket(address);socket.current=ws;
        ws.onopen=()=>ws.send(JSON.stringify({action:'authenticate',ticket}));
        ws.onmessage=event=>{
          const data=JSON.parse(event.data);
          if(data.type==='response') {const p=pending.current.get(data.id);pending.current.delete(data.id);if(data.error)p?.reject(new Error(data.error));else p?.resolve(data.data);}
          if(data.type==='ready') {setConnected(true);delay=1000;void refresh().catch(()=>{});}
          if(data.type==='presence')setOnline(data.ids);
          if(data.type==='changed')void refresh().catch(()=>{});
          if(data.type==='message') {
            listeners.current.forEach(listener=>listener(data.message));void refresh().catch(()=>{});
            if(data.message.senderId!==userId)setNotice({name:data.username,text:data.message.text,id:data.message.conversationId});
          }
        };
        ws.onclose=()=>{
          setConnected(false);setOnline([]);
          for(const p of pending.current.values())p.reject(new Error('Connection lost. Reopen the conversation before retrying.'));
          pending.current.clear();
          if(!stopped){retry=setTimeout(connect,delay);delay=Math.min(delay*2,15000);}
        };
      } catch {if(!stopped){retry=setTimeout(connect,delay);delay=Math.min(delay*2,15000);}}
    };
    void connect();
    return ()=>{stopped=true;clearTimeout(retry);ws?.close();};
  },[userId,url,refresh]);
  return <Context.Provider value={{connected,online,conversations,subscribe,authenticated:!!userId,request,refresh}}>{children}{notice && <aside className="chat-notice" role="status"><Link href={`/messages?conversation=${encodeURIComponent(notice.id)}`} onClick={()=>setNotice(null)}><strong>{notice.name}</strong><p>{notice.text}</p></Link><button aria-label="Dismiss notification" onClick={()=>setNotice(null)}>×</button></aside>}</Context.Provider>;
}
export function ChatUnread() {
  const realtime=useRealtime();
  const count=realtime?.conversations.reduce((sum,c)=>sum+c.unread,0) || 0;
  return count ? <span className="unread-badge" aria-label={`${count} unread messages`}>{count}</span>:null;
}
export function Presence({userId,initial=false}:{userId:string;initial?:boolean}) {
  const realtime=useRealtime();
  const online=realtime?.connected ? realtime.online.includes(userId):initial && !realtime?.authenticated;
  return <span className={`live-presence ${online?'is-online':''}`}><span className={`presence ${online?'is-online':''}`} />{online?'Online':'Offline'}</span>;
}
