# Stack Research

**Domain:** Client-side bill splitting web application
**Researched:** 2026-03-11
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Preact | 10.x | UI framework | 3KB bundle size, React-compatible API, perfect for learning React patterns without the overhead. Official Vite integration. Ideal for small client-side apps. |
| Vite | 7.x | Build tool | Industry standard for modern web development. Instant HMR, native ES modules, first-class Preact support via `@preact/preset-vite`. Zero-config setup. |
| Preact Signals | 1.x | State management | Built into Preact, simpler than external libraries. Automatic fine-grained reactivity, no provider boilerplate. Perfect for small-medium apps like bill splitting. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 3.4.x | Utility-first styling | Use for rapid UI development. Alternative: vanilla CSS for learning fundamentals. |
| Vitest | 2.x | Unit testing | Vite-native, fast, Jest-compatible API. Use when adding test coverage. |
| TypeScript | 5.x | Type safety | Optional but recommended for learning. Adds compile-time safety. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Node.js | 20.19+ or 22.12+ | Required by Vite 7.x. Use LTS version. |
| pnpm | Package manager | Faster than npm, efficient disk usage. Alternative: npm. |

## Installation

```bash
# Create new Preact project with Vite
npm create vite@latest expense-splitter -- --template preact

# Or with pnpm
pnpm create vite expense-splitter --template preact

# Install dependencies
cd expense-splitter
npm install

# Add Tailwind CSS (optional)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add Vitest for testing
npm install -D vitest @vitest/ui
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Preact | React | If you need React's full ecosystem or are building for a team already using React |
| Preact | Svelte | If you prefer compile-time frameworks and want zero runtime overhead |
| Preact Signals | Zustand | If you need time-travel debugging, middleware, or are coming from React ecosystem |
| Tailwind CSS | Vanilla CSS | If you want to learn CSS fundamentals without abstractions |
| Vite | Parcel | If you want zero-configuration bundling (but Vite has better DX) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Create React App (CRA) | Deprecated, no longer maintained, slow builds | Vite with Preact or React template |
| Webpack (for new projects) | Complex configuration, slower than Vite | Vite (simpler, faster, modern) |
| Redux | Overkill for bill splitting app, excessive boilerplate | Preact Signals or Zustand |
| Next.js | Requires server-side, overkill for client-only app | Vite + Preact |
| jQuery | Outdated pattern, doesn't teach modern React concepts | Preact (modern, lightweight) |
| LocalStorage wrapper libraries | Adds unnecessary dependency for simple use case | Native `localStorage` API |

## Stack Patterns by Variant

**If prioritizing minimal bundle size:**
- Use Preact + Preact Signals + vanilla CSS
- Because: 3KB framework + 1KB state management + zero CSS runtime

**If prioritizing learning React ecosystem:**
- Use React + Zustand + Tailwind
- Because: Transferable skills to larger React codebases

**If prioritizing developer experience:**
- Use Preact + Preact Signals + Tailwind
- Because: Best balance of simplicity, speed, and modern tooling

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Vite 7.x | Node.js 20.19+ / 22.12+ | Required minimum Node version |
| Preact 10.x | Vite 7.x | Use `@preact/preset-vite` for optimal integration |
| Preact Signals 1.x | Preact 10.x | First-party, built for Preact |
| Tailwind 3.4.x | Vite 7.x | Use `postcss` plugin integration |
| Vitest 2.x | Vite 7.x | Shares Vite config automatically |

## Confidence Assessment

| Recommendation | Confidence | Rationale |
|----------------|------------|-----------|
| Preact | HIGH | Official docs recommend Vite, 3KB size verified, actively maintained |
| Vite 7.x | HIGH | Current version confirmed from official docs (v7.3.1) |
| Preact Signals | HIGH | First-party solution, simpler than alternatives for this use case |
| Tailwind CSS | MEDIUM | Popular choice but vanilla CSS equally valid for learning |
| Vitest | HIGH | Vite-native, industry standard for Vite projects |

## Sources

- Vite Official Docs (https://vite.dev/) - Current version 7.3.1, Node.js requirements - HIGH confidence
- Preact Official Docs (https://preactjs.com/) - Vite integration, Signals documentation - HIGH confidence
- Svelte Docs (https://svelte.dev/) - Verified Vite compatibility without SvelteKit - HIGH confidence
- Zustand GitHub (https://github.com/pmndrs/zustand) - Current version 5.0.11 - HIGH confidence
- Tailwind CSS Docs (https://tailwindcss.com/) - Current version 3.4.17 - HIGH confidence

---
*Stack research for: Client-side bill splitting web application*
*Researched: 2026-03-11*
