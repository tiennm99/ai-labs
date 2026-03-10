# Skill: Email Curator

## Purpose
Scan a batch of emails and identify which ones are worth turning into a blog post. Filters for tech, AI, and Java/Go content that is genuinely interesting — not just any email on the topic.

## Trigger
Use this when Tien wants to go through his emails and find the ones worth writing about.

## Input
A list or dump of emails — can be:
- Pasted email content directly in the chat
- A text file with multiple emails
- A folder of .txt or .eml files

## What "Interesting" Means for Tien
An email is interesting if it contains:
- **AI/ML news** – new models, research, tools, surprising capabilities or limitations
- **Java or Go** – language updates, patterns, libraries, performance tips, ecosystem news
- **Tech industry** – engineering culture, system design, developer tools, open source
- **"Huh, I didn't know that"** signal – something surprising, counterintuitive, or newly discovered

Skip emails that are:
- Purely promotional/sales
- Generic newsletters with no depth
- Already well-known news with nothing new to add

## Output
A curated shortlist formatted like this:

---
**Interesting Emails for [Date]**

1. **[Subject or derived title]**
   - Source: [sender/newsletter name]
   - Why interesting: [1–2 sentences on what makes it worth writing about]
   - Key idea: [The core point in one sentence]

2. [repeat for each interesting email]

---
Skipped: [count] emails (not relevant or not interesting enough)

## Notes
- Aim for quality over quantity — 2–5 good picks per batch is ideal
- If unsure, err toward including it (Tien can decide)
- Don't summarize everything — just enough to jog memory when writing the post
