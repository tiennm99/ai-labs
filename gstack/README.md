# Hình Học Sống

Interactive Vietnamese THCS (lớp 7–9) geometry visualizer. Drag the points; watch the theorems hold. Aligned to the SGK curriculum.

> Sandbox repo currently doubling as a [gstack](https://github.com/garrytan/gstack) trial — see `CLAUDE.md`.

## Status

Scaffold only (v0.0.1.0). Modules are placeholders — landing page lists three grades with "Sắp ra mắt" badges. See the design doc at `~/.gstack/projects/tiennm99-try-gstack/` for the full plan.

## Develop

```sh
bun install
bun run dev          # http://localhost:4321/try-gstack/
bun run test         # Vitest (geom-engine unit tests)
bun run typecheck    # Astro check + TS strict
bun run build        # Static output to dist/
```

## Deploy

Auto-deploys to GitHub Pages from `main` via `actions/deploy-pages@v4`. See `RUNBOOK.md` for rollback + domain-migration procedure.

## Architecture (locked decisions, per autoplan review)

- **Static**: Astro SSG, `base: '/try-gstack/'`, output `dist/`
- **Typography**: Be Vietnam Pro single family, weights 400/500/700, woff2 only, Vietnamese subset
- **Math engine**: pure `src/geom-engine/` module (no DOM imports), Vitest unit tests; property tests with `fast-check` to be added with first canvas module
- **Canvas**: vanilla SVG + Pointer Events + `setPointerCapture` (no Konva) — to be added with first canvas module
- **Math rendering**: KaTeX, bundled locally + SSR-rendered — to be added with first canvas module
- **Animation**: Web Animations API + `requestAnimationFrame` (no GSAP / Motion One / Lottie)
- **Analytics**: Cloudflare Web Analytics, deferred until 50+ daily sessions
- **i18n**: every string via `t()` from `src/i18n/vi.ts`; English added by adding `en.ts`

## License

TBD.
