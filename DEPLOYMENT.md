# Production deployment

The public application is one Spring Boot deployment. Its Docker build packages the
React SPA into the backend JAR, so the browser and REST API share one HTTPS origin.
This keeps the session cookie same-origin and avoids mobile cross-site-cookie issues.

## Deploy the API

Create a Render web service from this repository using `render.yaml` (or use its
equivalent settings in Railway). Configure every value in `backend/.env.example`.
Use a managed MySQL database and import `database/schema.sql` before the first
production deploy. The first production admin is created once from
`BOOTSTRAP_ADMIN_USERNAME`, `BOOTSTRAP_ADMIN_EMAIL`, and a 12+ character
`BOOTSTRAP_ADMIN_PASSWORD`; remove that password variable after the account exists.
Do not enable `dev`; it intentionally contains demo-only data seeding. The health
check is `GET /api/health`.

## Single-app deployment

There is no separate frontend deployment. The root `Dockerfile` builds the React
client and embeds it in Spring Boot's static resources. Deploy the repository root
as one Render web service using `render.yaml`; users receive a single service URL.
Leave `VITE_API_BASE_URL=/api`. No Vercel configuration or public CORS origin is
required for the normal browser flow.

## Post-deploy smoke test

1. Open the service URL directly and refresh `/login` and a protected route.
2. Create a student account, refresh, sign out, and confirm `/student` redirects
   only after the session check completes.
3. Sign in on a mobile browser, add an item, place an order, and refresh the order page.
4. Confirm `GET https://API-ORIGIN/api/health` returns `{ "success": true }`.
