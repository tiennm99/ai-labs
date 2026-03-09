# cowork-complete-guide
Practices on [Complete Guide to Claude Cowork](https://ccforeveryone.com/cowork)

---

## File Processing System

A simple, repeatable system for managing files with Claude.

### How It Works

Files flow through four folders:

```
inbox/      ← Drop new files here (the chaos landing zone)
processed/  ← Files Claude has organized, renamed, and sorted
outputs/    ← Reports and new files Claude creates
reference/  ← Read-only context (templates, guidelines, etc.)
```

### How to Use It

1. Drop files into `inbox/`
2. Tell Claude: *"Read the file-processor skill and process my inbox"*
3. Check `processed/` for organized files and `outputs/` for the processing log

### Skills

Skills live in `skills/` — they're instruction files Claude follows.

- `skills/file-processor.md` – Instructions for processing the inbox

Edit any skill file to customize behavior for your needs.
