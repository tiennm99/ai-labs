# My Claude Code Aliases

## zclaude (Windows PowerShell)

Launches Claude with the Z.ai API endpoint and custom model settings.

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
```

## How to Install

1. Open your PowerShell profile:
   ```powershell
   notepad $PROFILE
   ```
   If the file doesn't exist, create it first:
   ```powershell
   New-Item -Path $PROFILE -ItemType File -Force
   ```

2. Paste the function above at the bottom of the file and save.

3. Reload your profile:
   ```powershell
   . $PROFILE
   ```

4. Test it - type `zclaude` in any PowerShell window.

## Notes

- Environment variables set this way are scoped to the current session only - they won't leak to other terminals.
- To also load your Mermaid diagrams, extend the function:
  ```powershell
  function zclaude {
      $env:ANTHROPIC_AUTH_TOKEN="your-api-key"
      $env:ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
      $env:API_TIMEOUT_MS="3000000"
      $env:ANTHROPIC_DEFAULT_OPUS_MODEL="GLM-5"
      $env:ANTHROPIC_DEFAULT_SONNET_MODEL="GLM-5"
      $env:ANTHROPIC_DEFAULT_HAIKU_MODEL="GLM-5"
      $diagrams = Get-Content .ai\diagrams\*.md -Raw -ErrorAction SilentlyContinue
      if ($diagrams) {
          claude --append-system-prompt $diagrams
      } else {
          claude
      }
  }
  ```

## Other Useful Aliases (Optional)

```powershell
# Skip permission prompts
function x { claude --dangerously-skip-permissions }

# Fast Haiku model
function h { claude --model claude-haiku-4-5-20251001 }

# Load diagrams
function cdi {
    $diagrams = Get-Content .ai\diagrams\*.md -Raw
    claude --append-system-prompt $diagrams
}
```
