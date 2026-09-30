import { backendFetch } from "./backend";
import type { ListingQuery } from "./query";
import type { ListingCardProps } from "../components/listing-card";

export interface ListingRecord {
  saved?: boolean;
  canManage?: boolean;
  description?: string;
  id: string;
  name: string;
  price: number | null;
  offerType?: 'price' | 'trade';
  tradeItem?: {itemId?:string;name:string;variant:string;image:string} | null;
  image?: string;
  category?: string;
  variant?: string;
  currency?: string;
  seller?: string;
  userId?: string | number;
  online?: boolean;
}

export interface ListingsPage {
  items: (ListingCardProps & { id: string })[];
  total: number;
  page: number;
  pageSize: number;
  categoryCounts: Record<string, number>;
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function listing(value: unknown): value is ListingRecord {
  if (!record(value)) return false;
  return typeof value.id === "string" && typeof value.name === "string" &&
    (value.offerType === "trade" ? value.price === null && record(value.tradeItem) && ["name","variant","image"].every(key => typeof (value.tradeItem as Record<string,unknown>)[key] === "string") : typeof value.price === "number" && Number.isFinite(value.price) && value.price >= 0) &&
    ["image", "category", "variant", "currency", "seller", "description"].every(key => value[key] === undefined || typeof value[key] === "string") &&
    ["online", "saved", "canManage"].every(key => value[key] === undefined || typeof value[key] === "boolean") &&
    (value.userId === undefined || typeof value.userId === "string" || typeof value.userId === "number");
}

export function parseListingsPage(value: unknown): ListingsPage {
  if (!record(value) || !Array.isArray(value.items) || !value.items.every(listing) ||
      !Number.isSafeInteger(value.total) || Number(value.total) < 0 ||
      !Number.isSafeInteger(value.page) || Number(value.page) < 1 ||
      !Number.isSafeInteger(value.pageSize) || Number(value.pageSize) < 1 ||
      !record(value.categoryCounts) ||
      !Object.values(value.categoryCounts).every(count => Number.isSafeInteger(count) && Number(count) >= 0)) {
    throw new Error("The listings API returned an invalid response.");
  }
  return {
    total: Number(value.total), page: Number(value.page), pageSize: Number(value.pageSize),
    categoryCounts: value.categoryCounts as Record<string, number>,
    items: value.items.map((item, index) => {
      const seller = item.seller || (item.userId !== undefined ? `Islander ${item.userId}` : "Islander");
      return {
        id: item.id, name: item.name, saved: item.saved === true, sellerId: String(item.userId ?? ""),
        image: item.image && /^https?:\/\//.test(item.image) ? item.image : "/item-placeholder.svg",
        category: item.category || "Other", variant: item.variant || "Original",
        priceLabel: item.offerType === "trade" ? `Trade for ${item.tradeItem?.name} · ${item.tradeItem?.variant}` : item.price!.toLocaleString("en-US"), currency: item.offerType === "trade" ? "" : item.currency === "Belle" ? "Bells" : item.currency || "Bells",
        seller, sellerInitial: seller.slice(0, 1).toUpperCase(),
        statusLabel: item.online ? "Online" : "Away", statusClass: item.online ? "is-online" : "",
        tone: index % 4,
      };
    }),
  };
}

export class ListingsError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function getListings(query: ListingQuery = {}): Promise<ListingsPage> {
  const params = new URLSearchParams({ ...query, limit: '20' });
  const response = await backendFetch(`/listings?${params}`);
  if (!response.ok) {
    const body = await response.json();
    throw new ListingsError(body.error || 'Could not load listings.', response.status);
  }
  return parseListingsPage(await response.json());
}

export async function getListing(id: string): Promise<ListingRecord | null> {
  const response = await backendFetch(`/listings/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Could not load this listing.');
  const data: unknown = await response.json();
  if (!listing(data)) throw new Error('Invalid listing response.');
  return data;
}
