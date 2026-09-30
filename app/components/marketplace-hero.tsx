import Image from "next/image";
import { Leaf } from "./leaf";

interface Props { chairImage: string; plantImage: string }

export function MarketplaceHero({ chairImage, plantImage }: Props) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="tiny-leaf"><Leaf small /></span>
          A LITTLE SOMETHING FOR YOUR ISLAND
        </div>
        <h1>Your next favorite find<br />is just a trade away.</h1>
        <p>
          A cozy corner to discover, wishlist, and trade<br className="desktop-break" />
          Animal Crossing treasures with fellow islanders.
        </p>
        <a className="hero-link" href="#marketplace">Find your next treasure <span>↗</span></a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <span className="art-circle" />
        <span className="spark spark-one">✦</span>
        <span className="spark spark-two">✧</span>
        <span className="art-dot" />
        <Image className="hero-chair" src={chairImage} alt="" width={240} height={240} unoptimized priority />
        <Image className="hero-plant" src={plantImage} alt="" width={160} height={160} unoptimized priority />
        <span className="art-label">a little island magic ✨</span>
      </div>
    </section>
  );
}
