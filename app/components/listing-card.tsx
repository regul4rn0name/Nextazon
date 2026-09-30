import { Presence } from './realtime-provider';
import Link from "next/link";
import { WishlistButton } from "./wishlist-button";
import Image from "next/image";

export interface ListingCardProps {
  id: string;
  saved?: boolean;
  sellerId?: string;
  name: string;
  image: string;
  category: string;
  variant: string;
  priceLabel: string;
  currency?: string;
  seller: string;
  sellerInitial: string;
  statusLabel: string;
  statusClass: string;
  tone: number;
}

export function ListingCard({
  id, saved, sellerId, name, image, category, variant, priceLabel, currency = "Bells",
  seller, sellerInitial, statusClass, tone,
}: ListingCardProps) {
  return (
    <article className="item-card">
      <div className={`item-art tone-${tone}`}>
        <span className="item-type">{category}</span>
        <WishlistButton id={id} name={name} saved={saved} compact />
        <Link className="item-image-button" href={`/listings/${encodeURIComponent(id)}`}>
          <Image src={image} width={150} height={150} alt={name} unoptimized />
        </Link>
      </div>
      <div className="item-info">
        <h3 className="item-name"><Link href={`/listings/${encodeURIComponent(id)}`}>{name}</Link></h3>
        <p className="variant">{variant}</p>
        <div className="price">
          <span className="bell">●</span>{priceLabel} <span>{currency}</span>
        </div>
        <div className="seller">
          <span className={`seller-avatar seller-${tone}`}>{sellerInitial}</span>
          <Link href={`/sellers/${encodeURIComponent(sellerId || "unknown")}`}>{seller}</Link>
          <Presence userId={sellerId || ""} initial={statusClass === "is-online"} />
        </div>
      </div>
    </article>
  );
}
