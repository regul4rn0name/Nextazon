import Link from 'next/link';
import { PageShell } from './page-shell';
import { Leaf } from './leaf';

export function SignInPrompt({ title, description, next }: { title: string; description: string; next: string }) {
  const destination = encodeURIComponent(next);
  return <PageShell active={next}>
    <section className="auth-card auth-prompt">
      <span className="auth-leaf"><Leaf /></span>
      <div className="eyebrow">YOUR ISLAND COMMUNITY</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="auth-actions">
        <Link className="primary" href={`/login?next=${destination}`}>Sign in</Link>
        <Link className="secondary" href={`/register?next=${destination}`}>Create an account</Link>
      </div>
      <Link className="auth-back" href="/">Keep exploring →</Link>
    </section>
  </PageShell>;
}
