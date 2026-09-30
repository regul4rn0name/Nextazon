import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <Link className="footer-brand" href="/">nextazon.</Link>
      <span>A little more community. A little more island magic.</span>
      <nav className="footer-contribute" aria-label="Contribute on GitHub">
        <span>Help build Nextazon on GitHub:</span>
        <a href="https://github.com/regul4rn0name/Nextazon">Frontend</a>
        <a href="https://github.com/regul4rn0name/nextazonbackend">Backend</a>
      </nav>
      <small>Fan-made concept · Not affiliated with Nintendo</small>
    </footer>
  );
}
