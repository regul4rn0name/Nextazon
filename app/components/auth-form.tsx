'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type FormEvent } from 'react';

export function AuthForm({ mode, next }: { mode: 'login' | 'register'; next: string }) {
  const register = mode === 'register';
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError('');
    if (register && form.get('password') !== form.get('confirmPassword')) { setError('The passwords do not match.'); return; }
    startTransition(async () => {
      try {
        const response = await fetch(`/api/auth/${mode}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: form.get('password'),username: form.get('username') }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Please try again.');
        router.replace(next);
        router.refresh();
      } catch (error) { setError(error instanceof Error ? error.message : 'Could not connect. Please try again.'); }
    });
  }
  return <section className="auth-card">
    <div className="eyebrow">WELCOME TO NEXTAZON</div>
    <h1>{register ? 'Find your island people.' : 'Welcome back, islander.'}</h1>
    <p>{register ? 'Create an account to save favorites and share your island treasures.' : 'Sign in to your wishlist, listings, and island community.'}</p>
    <form className="listing-form auth-fields" onSubmit={submit} aria-busy={pending}>
      <fieldset disabled={pending}>
        <label>Username<input name="username" autoComplete="username" required minLength={3} maxLength={24} pattern="[a-zA-Z0-9_]+" title="Letters, numbers, and underscores only" /></label>
        <label>Password<input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 8 : undefined} maxLength={128} required /></label>
        {register && <><small>Use at least 8 characters.</small><label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label></>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary" type="submit">{pending ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
      </fieldset>
    </form>
    <p className="auth-switch">{register ? 'Already have an account?' : 'New to Nextazon?'} <Link href={`/${register ? 'login' : 'register'}?next=${encodeURIComponent(next)}`}>{register ? 'Sign in' : 'Sign up'}</Link></p>
  </section>;
}
