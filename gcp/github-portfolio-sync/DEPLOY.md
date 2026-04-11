# GitHub Portfolio Sync

This folder contains the Cloud Functions source for a portfolio sync job that updates
`public/portfolio-updates.json` and `docs/portfolio-updates.json` from GitHub data.

The public repo intentionally omits environment-specific deployment details, secret values,
live endpoints, and shared-request-auth examples.

## Public notes

- Store GitHub credentials in your cloud secret manager, not in source control.
- Keep request authentication and scheduler configuration environment-specific.
- Treat repo owner, branch, file paths, and lookback windows as deploy-time configuration.
- If you expose an HTTP trigger, require authenticated access or an environment-managed secret.

## Deploy privately

Use your own cloud project, region, secret names, and request-auth configuration when deploying
this function. Keep those values in private ops documentation rather than the public repo.
