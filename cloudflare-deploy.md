# Cloudflare Deployment (Pages)

This site is a static Vite build. Cloudflare Pages should serve the compiled `docs/` output with a root base path.

## 0) Prereqs
- Cloudflare account (free tier is fine).
- Node.js 18+.
- Optional: `wrangler` CLI (`npx wrangler ...`).

## 1) Build for Cloudflare
Cloudflare Pages needs a root base path (`/`), so set `VITE_BASE_PATH=/` for the build.

```bash
VITE_BASE_PATH=/ npm run build
```

Output directory remains `docs/`.

## 2) Deploy via Cloudflare Pages UI
- **Root directory:** repo root
- **Build command:** `npm ci && VITE_BASE_PATH=/ npm run build`
- **Build output directory:** `docs`
- **Environment variable:** `VITE_BASE_PATH=/`

Deploy through the Pages UI once the build settings are saved.

## 3) Deploy via Wrangler (optional)
```bash
npx wrangler login
```

If this is your first deploy, create the project:
```bash
npx wrangler pages project create <your-project-name>
```

```bash
VITE_BASE_PATH=/ npm run build
npx wrangler pages deploy docs --project-name <your-project-name>
```

## 4) Smoke checks
```bash
curl -I https://<pages-domain>
curl -I https://<pages-domain>/manifest.json
```

## 5) Live E2E (post-deploy)
```bash
PLAYWRIGHT_BASE_URL=https://<pages-domain> npm run test:e2e
```

## Notes
- GitHub Pages builds keep the default base path (`/docs/`). Cloudflare builds must override it to `/`.
