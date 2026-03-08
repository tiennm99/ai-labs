# My Claude Code Aliases

## Aliases File: `~\Documents\PowerShell\alias.ps1`

Keep all Claude aliases in a dedicated file, sourced from `$PROFILE`.

### `~\Documents\PowerShell\alias.ps1`

```powershell
function zclaude {
    $env:ANTHROPIC_AUTH_TOKEN="your-api-key"
    $env:ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
    $env:API_TIMEOUT_MS="3000000"
    $env:ANTHROPIC_DEFAULT_OPUS_MODEL="GLM-5"
    $env:ANTHROPIC_DEFAULT_SONNET_MODEL="GLM-5"
    $env:ANTHROPIC_DEFAULT_HAIKU_MODEL="GLM-5"
    claude
}

# Skip permission prompts
function x { claude --dangerously-skip-permissions }

# Fast Haiku model
function h { claude --model claude-haiku-4-5-20251001 }

# Load diagrams from current project
function cdi {
    $diagrams = Get-Content .ai\diagrams\*.md -Raw -ErrorAction SilentlyContinue
    if ($diagrams) { claude --append-system-prompt $diagrams } else { claude }
}
```

## How to Install

1. Create the aliases file (Claude will write this for you, or paste manually):
   ```powershell
   New-Item -Path "$HOME\Documents\PowerShell\alias.ps1" -ItemType File -Force
   ```

2. Add one line to your `$PROFILE` to source it:
   ```powershell
   . "$HOME\Documents\PowerShell\alias.ps1"
   ```
   Open profile with: `notepad $PROFILE`

3. Reload your profile:
   ```powershell
   . $PROFILE
   ```

4. Test it - type `zclaude` in any PowerShell window.

## Notes

- Environment variables set inside functions are scoped to the current session only.
- Edit `alias.ps1` anytime to add new aliases - no need to touch `$PROFILE` again.
- You can version control `alias.ps1` separately from your profile.
