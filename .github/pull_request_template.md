## Summary

- 

## Validation

- [ ] `npm run validate`
- [ ] `npm run build`
- [ ] `npm run security:gate`
- [ ] `PLAYWRIGHT_SKIP_BUILD=true npm run test:e2e`
- [ ] `npm run check:links` if links, resume files, or public pages changed
- [ ] `npm run audit:codex` (`python3 -m codex_harness audit . --strict --min-score 90`)

## Public-Surface Review

- [ ] No secrets, local paths, private URLs, or private operational notes were added.
- [ ] Security and leak risks were reviewed.
- [ ] Metrics are dated and described without unsupported user-count claims.
- [ ] Resume, homepage, generated project pages, and crawlable files stay consistent.
