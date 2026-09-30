import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function PageShell({ children, active }: { children: ReactNode; active?: string }) {
  return <><SiteHeader active={active} /><main className="shell">{children}<SiteFooter /></main></>;
}
