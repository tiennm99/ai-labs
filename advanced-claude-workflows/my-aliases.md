# My Claude Code Aliases

## Your Alias

```bash
alias h="claude --model claude-haiku-4-5-20251001"
```

Type `h` to start Claude with the fast Haiku model - great for quick tasks where speed matters.

## How to Install

1. Open your shell config:
   ```bash
   open ~/.zshrc
   ```

2. Add this line at the bottom:
   ```bash
   alias h="claude --model claude-haiku-4-5-20251001"
   ```

3. Save the file and reload:
   ```bash
   source ~/.zshrc
   ```

4. Test it - just type `h` in any directory to start Claude with Haiku.

## When to Use Haiku

- Quick questions and lookups
- Simple file edits
- Code formatting or renaming
- Tasks where speed matters more than depth
- Exploratory work before diving deep

## Other Useful Aliases (Optional)

```bash
# Skip permission prompts (use with caution)
alias x="claude --dangerously-skip-permissions"

# Load architecture diagrams at startup
alias cdi="claude --append-system-prompt \"\$(cat .ai/diagrams/*.md)\""

# Combo: Haiku + skip permissions
alias xh="claude --model claude-haiku-4-5-20251001 --dangerously-skip-permissions"

# Combo: Haiku + diagrams
alias hdi="claude --model claude-haiku-4-5-20251001 --append-system-prompt \"\$(cat .ai/diagrams/*.md)\""
```

## When to Use Each

| Alias | Use When |
|-------|----------|
| `h` | Quick questions, simple tasks |
| `x` | You trust Claude and want no prompts |
| `cdi` | Starting work on a documented project |
| `xh` | Fast + no prompts |
| `hdi` | Fast + full context |
