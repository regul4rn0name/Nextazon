import { getAccount } from './lib/auth';
import { RealtimeProvider } from './components/realtime-provider';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nextazon — Your next island treasure",
  description: "Discover, wishlist, and trade Animal Crossing treasures with fellow islanders. An ad-free community marketplace concept.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const account=await getAccount();
  const url=process.env.WS_URL || process.env.NEXT_PUBLIC_WS_URL || (process.env.NODE_ENV === 'production' ? '/api/realtime' : 'ws://127.0.0.1:3002/realtime');
  return <html lang="en"><body><RealtimeProvider key={account?.id || "guest"} userId={account?.id} url={url}>{children}</RealtimeProvider></body></html>;
}
