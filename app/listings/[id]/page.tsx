import { ListingOfferActions } from '../../components/listing-offer-actions';
import { Presence } from '../../components/realtime-provider';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getListing } from '../../lib/listings';
import { PageShell } from '../../components/page-shell';
import { WishlistButton } from '../../components/wishlist-button';
import { DeleteListingButton } from '../../components/delete-listing-button';

export default async function ListingDetails({ params }: PageProps<'/listings/[id]'>) {
  const { id } = await params;
  const item = await getListing(id);
  if (!item) notFound();
  const image = item.image && /^https?:\/\//.test(item.image) ? item.image : '/item-placeholder.svg';
  return <PageShell>
    <div className="page-intro"><Link href="/">← Back to explore</Link></div>
    <article className="detail-layout">
      <div className="detail-picture"><Image src={image} alt={item.name} width={400} height={400} unoptimized /></div>
      <div className="detail-copy">
        <div className="eyebrow">{item.category || 'Other'} · {item.variant || 'Original'}</div>
        <h1>{item.name}</h1>
        <div className="detail-price">{item.offerType === 'trade' ? <>Trade for {item.tradeItem?.name}<p>{item.tradeItem?.variant}</p>{item.tradeItem && <Image src={item.tradeItem.image} alt={item.tradeItem.name} width={100} height={100} unoptimized />}</> : <>{item.price!.toLocaleString('en-US')} {item.currency === 'Belle' ? 'Bells' : item.currency || 'Bells'}</>}</div>
        <p>Listed by <Link className="text-link" href={`/sellers/${encodeURIComponent(String(item.userId ?? 'unknown'))}`}>{item.seller || 'Islander'}</Link> · <Presence userId={String(item.userId)} initial={item.online}/></p>
        <p className="listing-description">{item.description || 'A little treasure looking for a new island home.'}</p>
        <WishlistButton id={id} name={item.name} saved={item.saved} />
        {!item.canManage && <ListingOfferActions listingId={id} initial={item.offerType==='trade' ? {kind:'item',itemId:item.tradeItem?.itemId || '',name:item.tradeItem?.name,variant:item.tradeItem?.variant} : {kind:'price',amount:item.price!,currency:item.currency==='Belle'?'Bells':item.currency || 'Bells'}}/>}
        {!item.canManage && <Link className="primary" href={`/messages?seller=${encodeURIComponent(String(item.userId))}`}>Message seller</Link>}
        {item.canManage && <DeleteListingButton id={id} />}
      </div>
    </article>
  </PageShell>;
}
