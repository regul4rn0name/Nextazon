import Link from 'next/link';
import { Leaf } from './leaf';
import { listingUrl, type ListingQuery } from '../lib/query';
const categories = [['', 'All items', '✳'], ['Furniture', 'Furniture', '▥'], ['Villagers', 'Villagers', '☺'], ['Clothing', 'Clothing', '♧'], ['Materials', 'Materials', '✧'], ['Walls & floors', 'Walls & floors', '▦'], ['DIY recipes', 'DIY recipes', '✎'], ['Creatures', 'Creatures', '♧'], ['Other', 'Other', '⋯']];
interface Props { counts: Record<string, number>; query: ListingQuery; basePath: string }
export function CategorySidebar({ counts, query, basePath }: Props) {
  return (
    <aside className="sidebar"><div className="sidebar-title">BROWSE CATEGORIES</div>
      <nav aria-label="Item categories">{categories.map(([value, name, symbol]) => (
        <Link key={value} href={listingUrl(basePath, query, { category: value, page: '' })} className={`category ${(query.category || '') === value ? 'selected' : ''}`}>
          <span className="category-symbol">{symbol}</span>{name}
          <span className="category-count">{value ? counts[value] || 0 : Object.values(counts).reduce((sum, count) => sum + count, 0)}</span>
        </Link>
      ))}</nav>
      <div className="side-note"><Leaf small /><h3>Good trades. Happy islands.</h3><p>Be kind, agree on the details, and keep island codes private.</p><span>Made for the community ♡</span></div>
    </aside>
  );
}
