# Runbook — Hình Học Sống

## Deployment

Production deploys from `main` via GitHub Actions (`.github/workflows/deploy.yml`).

- Live URL: `https://tiennm99.github.io/try-gstack/`
- Build: `bun run build` (Astro static, output to `dist/`)
- Deploy mechanism: `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
- Concurrency: `pages-deploy` group, cancel-in-progress disabled (so a force-pushed retry doesn't abort an in-flight rollback)

## Rollback

GitHub Pages keeps the last successful deployment. To roll back:

1. Find the offending commit on `main`: `git log --oneline main`
2. Revert it: `git revert <sha>` and push to `main`
3. The next workflow run rebuilds and re-deploys the prior good state
4. Verify the live site

If the workflow itself is broken (e.g., bad `deploy.yml` change), use the GitHub UI to re-run a previous successful deployment from the **Deployments** tab.

## CI

- `.github/workflows/ci.yml` runs typecheck + Vitest + build on every PR and push to `main`. Build failure on `main` blocks the deploy job.
- Local equivalent: `bun install && bun run typecheck && bun run test && bun run build`

## Domain migration trigger

Per autoplan plan, buy a `.vn` / `.com.vn` domain only when ANY of:

1. **500 unique sessions** in any rolling 30-day window post-launch, OR
2. **1 organic teacher share** (Facebook group, Zalo, or school chat — verified, not founder-initiated), OR
3. **≥5 modules shipped** (signals content sustainability and amortizes the domain cost)

If none hit within 90 days of soft launch, stay on `tiennm99.github.io/try-gstack/`.

When the trigger fires:

1. Register the domain (VN registration: passport scan + address proof + MIC filing, 7–14 days)
2. Add `CNAME` file at repo root with the new domain (e.g. `hinhhocsong.vn`)
3. Configure custom domain in GitHub Pages settings (Settings → Pages → Custom domain)
4. Update `astro.config.mjs`: change `SITE_BASE` env from `/try-gstack` to `/`, point `SITE_URL` at the new domain. Or update the workflow `env:` block.
5. Update OpenGraph + canonical URLs (handled automatically once `astro.config.mjs` reflects the new domain)
6. Wait 24h, then update sitemap submission in Google Search Console
7. Set up 301 redirects (GitHub Pages handles this automatically once the custom domain is the primary)

## Things to NOT do

- Never `git push --force` to `main`.
- Never edit `VERSION` or `package.json.version` independently — they must agree (`/ship` enforces this).
- Never change `astro.config.mjs` `base` without simultaneously updating the deploy workflow `env:` and any hardcoded internal links.
