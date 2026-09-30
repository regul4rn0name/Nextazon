import { ListingCard, type ListingCardProps } from "./listing-card";

interface Props {
  items: (ListingCardProps & { id: string })[];
}

export function ListingGrid({ items }: Props) {
  if (items.length === 0) {
    return <div className="empty"><h3>No listings on this page</h3><p>Check another page or come back soon.</p></div>;
  }
  return (
    <>
      <div className="item-grid">
        {items.map(item => <ListingCard key={item.id} {...item} />)}
      </div>
      <p className="market-end">Find a little something for your island.</p>
    </>
  );
}
