'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="shell"><div className="empty page-intro" role="alert"><h1>We couldn’t load this page.</h1><p>The service may be temporarily unavailable.</p><button className="primary" onClick={reset}>Try again</button> <Link className="secondary" href="/">Back to explore</Link></div></main>;
}
