import { redirect } from 'next/navigation';
import { getAccount, safeNext } from '../lib/auth';
import { PageShell } from '../components/page-shell';
import { AuthForm } from '../components/auth-form';
export default async function Register({ searchParams }: PageProps<'/register'>) {
  const next = safeNext((await searchParams).next);
  if (await getAccount()) redirect(next === '/login' || next === '/register' ? '/' : next);
  return <PageShell><AuthForm mode="register" next={next} /></PageShell>;
}
