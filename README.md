# Nextazon
# Vibe Coded AF (will refactor later)
Next.js marketplace with an Express/MongoDB backend. All reusable UI components
live in `app/components`; server-side HTTP and query helpers live in `app/lib`.

## Run

In `../nextazonjs`, configure `.env` with `MONGO_URI`, then run `pnpm seed` and
`pnpm start`. In this project, optionally set `BACKEND_URL` in `.env.local`
(default `http://127.0.0.1:3002`) and run `pnpm dev`.

## Pages

- `/`: browse and filter listings.
- `/wishlist`: saved listings for this browser profile.
- `/my-listings`: listings created by this browser profile.
- `/listings/new`: create a database listing from the item catalog.
- `/listings/[id]`: item details, save/unsave, seller link, and owner-only removal.
- `/sellers/[id]`: listings from one seller, with the same filters.
- Custom loading, error, and not-found states handle unavailable services/pages.

Search, category, online-only, minimum/maximum Bells, sorting, and pagination are
server-side. Their values live in the URL. Applying filters resets pagination;
pagination and category links preserve the remaining filters. Category counts
reflect the current search/price/availability/scope, before category selection.

## Accounts and sign-in prompts

Wishlist, Chat (`/messages`), My Listings, and Create Listing show a sign-in /
create-account prompt for visitors. The header includes a right-side Sign in
button and a Chat link. Item hearts send visitors to login, preserving the URL.
`/login` and `/register` return users to a validated local destination.

Auth writes go through Next.js `/api/auth/...`. Passwords are scrypt-hashed in
MongoDB; random sessions use an HttpOnly, SameSite cookie (Secure on HTTPS),
with only token hashes stored server-side. Logout invalidates the session.
Guest sessions no longer grant access to account-only features. Existing guest
wishlists/listings migrate when the visitor signs in or registers. Wishlists
belong to the account and work across signed-in browser sessions.

Chat currently has a sign-in gate and an account-only placeholder; sending
messages is not implemented. Email verification and password recovery are not
implemented. Login/registration have a basic single-process rate limit.

## Checks

- `pnpm lint`
- `pnpm exec next build --webpack` (includes TypeScript checks)
- Backend: `pnpm test` (MongoDB integration uses a unique temporary test database)
