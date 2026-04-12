---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain-skipped', 'step-06-innovation-skipped', 'step-07-project-type']
inputDocuments:
  - '_bmad-output/brainstorming/brainstorming-session-2026-04-12-001.md'
workflowType: 'prd'
classification:
  projectType: 'web_app'
  domain: 'general'
  complexity: 'low'
  projectContext: 'greenfield'
---

# Product Requirements Document - try-bmad

**Author:** MiTi
**Date:** 2026-04-12

## Executive Summary

2048 Clone is a faithful web-based recreation of Gabriele Cirulli's 2048 puzzle game, built with Svelte, Tailwind CSS, and Vite. The player slides numbered tiles on a 4x4 grid, merging identical values to reach the 2048 tile. This is a personal exploration project — the goal is to learn modern web tooling while building a complete, polished, playable game that matches the original's mechanics and feel.

### What Makes This Special

This project prioritizes craft over novelty. Rather than adding twists or unique features, the focus is on deeply understanding and faithfully reproducing every detail of the original — the 90/10 tile spawn probability, the leading-edge merge order, the 100ms slide transitions, the satisfying merge bounce. The result is a clean, well-structured Svelte codebase that serves as both a playable game and a learning artifact.

## Project Classification

- **Project Type:** Web application (single-page app)
- **Domain:** General / entertainment
- **Complexity:** Low — single-player, no backend, no auth, localStorage only
- **Project Context:** Greenfield — new project from scratch
- **Tech Stack:** Svelte + Vanilla JS + Tailwind CSS + Vite + GitHub Pages

## Success Criteria

### User Success

- Player can slide tiles in all 4 directions with responsive, satisfying feedback
- Merge mechanics match the original exactly (leading-edge order, once-per-move rule)
- Tile spawning follows the original's 90/10 probability split
- Game feels smooth — animations at original timing (100ms slide, 200ms pop/bounce)
- Score and best score tracked accurately across sessions
- Playable on both desktop (keyboard) and mobile (touch/swipe)

### Business Success

Not applicable — this is a personal exploration/learning project with no business metrics. Success is measured by:
- Completing a fully functional 2048 clone
- Learning Svelte, Tailwind, and Vite through hands-on building
- Deploying a playable game to GitHub Pages

### Technical Success

- Clean Svelte component architecture (App, Grid, Tile, ScoreBoard, GameMessage)
- Game logic separated from UI (pure JS module, testable independently)
- All CSS animations matching original timings
- Responsive layout (500px desktop, 280px mobile)
- localStorage persistence working correctly (game state + best score)

### Measurable Outcomes

- All original 2048 mechanics faithfully reproduced (merge rules, spawn rules, win/lose detection)
- Game playable end-to-end: start → play → win/lose → restart
- "Keep playing" mode works after reaching 2048
- No visual glitches during slide/merge/spawn animations
- Game state survives page refresh

## Product Scope

### MVP - Minimum Viable Product

- 4x4 grid with tile sliding and merging
- Score and best score display
- Keyboard input (arrows)
- Win/lose detection with overlays
- New Game button
- Basic tile colors matching original

### Growth Features (Post-MVP)

- Touch/swipe input for mobile
- Full animation suite (slide, pop, bounce, score float)
- localStorage persistence (game state + best score)
- Responsive design (desktop + mobile)
- WASD and Vim key support
- "Keep playing" mode after winning

### Vision (Future)

- Deploy to GitHub Pages
- Tile glow effects on 128+ values
- Polish: exact color matching, font sizing tiers, overlay fade timing

## User Journeys

### Journey 1: First-Time Player — Discovery

**Persona:** Alex, a casual gamer who heard about 2048 and wants to try it.

**Opening Scene:** Alex finds the game link and opens it in their browser. They see a clean grid with two tiles and the instruction "Join the numbers and get to the 2048 tile!"

**Rising Action:** Alex presses arrow keys and watches tiles slide and merge. They quickly grasp the mechanic — same numbers combine. They experiment with strategies, building tiles toward 64, then 128. The score climbs. They start to feel the tension of a filling board.

**Climax:** Alex gets a 512 tile and the board is getting tight. Every move matters. They make a wrong slide — the board fills up. Game over. The score is saved as their best. They immediately hit "New Game."

**Resolution:** Alex is hooked. The "one more try" loop kicks in. They now have a best score to beat and understand the strategy needed to push further.

### Journey 2: Returning Player — Chasing the Win

**Persona:** Alex returns the next day, opens the game.

**Opening Scene:** The game loads their previous in-progress game from localStorage. Their best score shows in the corner. They pick up where they left off.

**Rising Action:** Alex plays more deliberately now. They keep high tiles in a corner, build chains. They reach 1024. The glow effect on the tile signals they're close.

**Climax:** Two 1024 tiles sit adjacent. Alex merges them — 2048 appears. "You win!" overlay fades in. Alex sees the "Keep going" button.

**Resolution:** Alex clicks "Keep going" to see how far they can push it. The score keeps climbing. Eventually the board fills — game over with a new best score. Satisfaction.

### Journey 3: Mobile Player — On the Go

**Persona:** Sam opens the game on their phone during a commute.

**Opening Scene:** The responsive layout fits the phone screen. Sam swipes up — tiles slide. The touch controls feel natural.

**Rising Action:** Sam plays with quick swipes, building tiles. The animations are smooth even on mobile. Score updates with each merge.

**Climax:** A bump on the train causes an accidental swipe. The board fills up. Game over.

**Resolution:** Sam hits "New Game" and starts fresh. The best score persists. Quick, satisfying gameplay that fits a commute perfectly.

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| First-Time Player | Grid rendering, tile mechanics, keyboard input, score display, game over detection, New Game button |
| Returning Player | localStorage persistence, best score tracking, win detection, "Keep going" mode, tile glow effects |
| Mobile Player | Responsive layout, touch/swipe input, smooth animations on mobile, state persistence |

## Web App Specific Requirements

### Project-Type Overview

Single-page application (SPA) — a self-contained puzzle game with no routing, no server-side rendering, and no SEO requirements. The entire game runs client-side with Svelte + Vite.

### Technical Architecture Considerations

- **SPA vs MPA:** SPA — single page, no navigation needed
- **Browser Support:** Modern evergreen browsers (Chrome, Firefox, Safari, Edge). No IE11 support needed.
- **SEO:** Not required — this is a game, not content. No SSR/SSG needed.
- **Real-time:** No server communication. All game logic runs client-side.
- **Accessibility:** Basic keyboard support inherently provided through arrow key controls. Focus management for overlays (win/lose messages).

### Responsive Design

- **Desktop:** 500px game container width, centered layout
- **Mobile:** 280px game container at viewport width < 520px
- **Touch:** Single-finger swipe support with 10px minimum threshold
- **Breakpoint:** Single breakpoint at 520px (matching original)

### Performance Targets

- **Initial load:** < 1s (small bundle — Svelte compiles away, minimal JS)
- **Animation framerate:** 60fps for all CSS transitions
- **Input latency:** < 16ms response to keyboard/touch events
- **Bundle size:** < 50KB gzipped (Svelte + Tailwind purged)

### Implementation Considerations

- No backend, API, or database
- No authentication or user accounts
- No analytics or tracking
- All state management via Svelte reactivity + localStorage
- Static site deployment (GitHub Pages)
