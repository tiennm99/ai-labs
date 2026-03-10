# Skill: Hugo Post Writer

## Purpose
Turn a curated list of interesting emails into a Hugo blog draft — ready to drop into the content folder and release when enough drafts have accumulated.

## Trigger
Use this after running the Email Curator skill, or when Tien has a set of interesting emails he wants turned into a post.

## Input
- The curated email shortlist from the Email Curator skill, OR
- Raw interesting emails pasted directly

## Output
A Hugo markdown file with proper frontmatter, saved as a draft.

## Hugo Frontmatter Format
```markdown
---
title: "[Generated title]"
date: [today's date in YYYY-MM-DD format]
draft: true
tags: [relevant tags from: ai, java, go, tech, engineering]
---
```

## Post Structure

### 1. The Intro (most important part)
Write an interesting, opinionated opening — NOT a summary. Options:
- Start with a provocative question
- Start with a surprising fact from one of the emails
- Start with a short personal take ("I've been thinking about X...")
- Make it feel like something Tien would actually say, not a newsletter blurb

Aim for 2–3 sentences max. Make the reader want to keep going.

### 2. The Items
For each curated email, write a short section:

**[Topic title]**
2–4 sentences covering: what it is, why it matters, and optionally a quick personal angle or question it raises.

Keep each item punchy. No padding.

### 3. Closing (optional)
If there's a natural thread connecting the items, end with a one-liner that ties them together. Skip if it feels forced.

## Tone
- Conversational, not formal
- Direct — say what's interesting, don't hedge
- Tech-native — no need to explain what Java or LLMs are
- Tien's voice, not a content marketer's voice

## File Naming
`[YYYY-MM-DD]-digest.md`
Example: `2026-03-10-digest.md`

Save to: the Hugo content/posts folder (or ask Tien where if unsure)

## Notes
- Draft = true always. Tien releases manually when he has enough posts.
- If only 1–2 items, still write it — small posts are fine
- If something has a natural headline moment (big release, surprising news), lean into it in the intro
