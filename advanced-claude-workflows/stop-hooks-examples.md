# Stop Hook Examples

## How It Works

Every time Claude finishes a response, the hook runs. If it outputs JSON with `"decision": "block"`, Claude sees the reason and keeps working until the check passes.

```
Claude finishes → hook runs → check fails → Claude fixes → tries again
                                          → check passes → Claude stops
```

## Pattern

```bash
<your-check-command> 2>&1 || echo '{"decision":"block","reason":"<what went wrong>"}'
```

- Check passes → output nothing → Claude stops
- Check fails → output JSON → Claude fixes and retries

## Common Examples

```bash
# TypeScript type checking
npx tsc --noEmit 2>&1 || echo '{"decision":"block","reason":"TypeScript errors found"}'

# Linting
npm run lint 2>&1 || echo '{"decision":"block","reason":"Linting errors found"}'

# Tests
npm test 2>&1 || echo '{"decision":"block","reason":"Tests failing"}'

# Build
npm run build 2>&1 || echo '{"decision":"block","reason":"Build failed"}'
```

## Chaining Multiple Checks

```bash
npm run typecheck 2>&1 || echo '{"decision":"block","reason":"Typecheck failed"}' && \
npm run lint 2>&1 || echo '{"decision":"block","reason":"Lint failed"}' && \
npm test 2>&1 || echo '{"decision":"block","reason":"Tests failing"}'
```

## Configuration

Add hooks to `.claude/settings.local.json` in your project:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run typecheck 2>&1 || echo '{\"decision\":\"block\",\"reason\":\"TypeScript errors found\"}'"
          }
        ]
      }
    ]
  }
}
```
