import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <Link className="footer-brand" href="/">nextazon.</Link>
      <span>A little more community. A little more island magic.</span>
      <small>Fan-made concept · Not affiliated with Nintendo</small>
    </footer>
  );
}
