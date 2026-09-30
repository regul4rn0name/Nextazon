# Server deployment
Check out Nextazon and nextazonbackend as sibling directories. This Compose project uses only loopback ports 3100/3102 and the existing `docker-db_default` network; it never recreates the existing MongoDB service.

Create `deploy/.env` (mode 600) with `MONGO_URI` for a dedicated MongoDB user with readWrite on `nextazon_app_prod`. Do not commit credentials.

Run `docker compose -f deploy/compose.yaml up -d --build`, then `docker compose -f deploy/compose.yaml exec backend node scripts/import-catalog.js`. Example listings are optional: `node scripts/seed-listings.js` inside the backend container.

Install nginx.conf as a separate site, test with `nginx -t`, then reload nginx. Issue a certificate using Certbot webroot `/var/www/nextazon-acme` and configure HTTPS for this hostname only. HTTP API routes are `/api/*`; WebSockets upgrade at `/api/realtime`.

The code is served by a single backend process. Scaling chat requires a shared broker. Stop only this Compose project when rolling back; do not stop or prune other containers or networks. Keep prior Git revisions and nginx configuration backups for rollback.
