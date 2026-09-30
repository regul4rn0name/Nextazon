import Link from 'next/link';
import { PageShell } from './components/page-shell';
export default function NotFound() {
  return <PageShell><div className="empty page-intro"><h1>This treasure has wandered off.</h1><p>The page or listing could not be found.</p><Link className="primary" href="/">Back to explore</Link></div></PageShell>;
}
