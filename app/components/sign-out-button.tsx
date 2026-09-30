'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const router = useRouter();
  return <div>
    <button className="sign-out" disabled={pending} onClick={() => startTransition(async () => {
      setError('');
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (!response.ok) throw new Error('Sign out failed. Try again.');
        router.replace('/');router.refresh();
      } catch { setError('Sign out failed. Try again.'); }
    })}>{pending ? 'Signing out…' : 'Sign out'}</button>
    {error && <span className="form-error" role="alert">{error}</span>}
  </div>;
}
