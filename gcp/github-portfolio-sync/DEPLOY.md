# Deploy: GitHub Portfolio Sync (Cloud Functions Gen 2)

This function scans recent GitHub repos and updates `public/portfolio-updates.json` and `docs/portfolio-updates.json` via the GitHub API.

## Environment variables
- `DEV_CM_GITHUB_TOKEN` (secret) – GitHub token with repo read/write access for the portfolio repo.
- `GITHUB_OWNER` – GitHub username to scan (default: `zack-dev-cm`).
- `GITHUB_REPO` – Portfolio repo name (default: `zack-dev-cm.github.io`).
- `GITHUB_BRANCH` – Branch to update (default: `main`).
- `NEW_REPO_LOOKBACK_DAYS` – Lookback window (default: `90`).
- `PROJECT_PROMOTION_DAYS` – Promote to projects after N days (default: `30`).
- `PROBES_BASE_URL` – Probes base URL (default: empty).
- `PORTFOLIO_UPDATES_PATH` – File to update (default: `public/portfolio-updates.json`).
- `PORTFOLIO_UPDATES_DOCS_PATH` – GitHub Pages file (default: `docs/portfolio-updates.json`).
- `EXCLUDE_REPOS` – Comma/space-separated repo names or full names to skip.
- `INCLUDE_PRIVATE_REPOS` – Set `false` to skip private repos.
- `SYNC_SECRET` – Optional shared secret checked via `x-sync-secret` header.

## Deploy (example)
```bash
PROJECT_ID=your-gcp-project
REGION=us-east1

gcloud config set project $PROJECT_ID

gcloud secrets create dev-cm-github-token --data-file=- <<<"$DEV_CM_GITHUB_TOKEN"

gcloud functions deploy github-portfolio-sync \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=./gcp/github-portfolio-sync \
  --entry-point=githubPortfolioSync \
  --trigger-http \
  --set-secrets DEV_CM_GITHUB_TOKEN=dev-cm-github-token:latest \
  --set-env-vars GITHUB_OWNER=zack-dev-cm,GITHUB_REPO=zack-dev-cm.github.io,GITHUB_BRANCH=main,PROBES_BASE_URL=https://probes-zlvmfsrm6a-ue.a.run.app
```

If you use `SYNC_SECRET`, add:
```
--set-env-vars SYNC_SECRET=your_shared_secret
```

## Manual run
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-sync-secret: your_shared_secret" \
  "https://REGION-PROJECT_ID.cloudfunctions.net/github-portfolio-sync?dryRun=true"
```

## Scheduler (optional)
Create a Cloud Scheduler job to hit the function daily. Use an HTTP target and include the `x-sync-secret` header if set.
