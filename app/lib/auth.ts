import { cache } from 'react';
import { backendFetch } from './backend';

export interface Account { id: string; username: string }
export const getAccount = cache(async (): Promise<Account | null> => {
  try {
    const response = await backendFetch('/auth/me');
    if (!response.ok) return null;
    const data = await response.json();
    const user = data.user;
    return user && typeof user.id === 'string' && typeof user.username === 'string' ? user : null;
  } catch { return null; }
});

export function safeNext(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  if (/^\/(login|register)([/?#]|$)/.test(value)) return '/';
  return value;
}
