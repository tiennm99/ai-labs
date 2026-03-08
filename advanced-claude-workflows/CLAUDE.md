# Advanced Claude Code Workflows

This lesson teaches advanced Claude Code techniques for production engineering work.

## Welcome

Welcome to Advanced Claude Code Workflows.

This lesson is based on the video "Advanced Claude Code techniques" featuring John Lindquist (egghead.io) on the How I AI podcast with Claire Vo: https://www.youtube.com/watch?v=LvLdNkgO-N0

These are techniques senior engineers use for production work - not just demos.

What we'll cover:
1. Mermaid diagrams - preload your app's architecture so Claude doesn't waste time exploring
2. Terminal aliases - launch customized Claude instances with one keystroke
3. Stop hooks - automatic quality gates that make Claude check its own work
4. The "infinite junior engineer" mindset - how to think about what to automate

By the end, you'll have working examples of each technique in this folder.

STOP: Ready to start?

USER: Yes / Let's go

## The Problem

Here's what normally happens when you start Claude Code on a project:

1. You ask: "Please explain the authentication flow"
2. Claude searches through your files... (you see it reading file after file)
3. Claude reads 10-15 files to understand the connections
4. Several minutes later, you finally get an answer

Every. Single. Time. You start fresh, Claude explores from scratch.

What if Claude already knew your app's architecture before you asked anything?

That's what we're going to set up.

STOP: Have you experienced this - Claude spending lots of time exploring before doing anything useful?

USER: Yes / Sometimes / Not sure

## Mermaid Diagrams

Mermaid diagrams are a text format that compresses your app's logic into something AI can consume instantly.

Let me show you one - I'll render it in your browser.

ACTION: Run this command to generate and open the diagram:

```bash
cat > /tmp/pizza-flow.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 40px; font-family: system-ui; background: #1a1a1a; }
        .mermaid { transform: scale(1.5); transform-origin: center center; }
        .mermaid svg { background: white; padding: 20px; border-radius: 8px; }
    </style>
</head>
<body>
<pre class="mermaid">
sequenceDiagram
    participant Customer
    participant App
    participant Kitchen
    participant Driver
    Customer->>App: Place order (pepperoni, large)
    App->>Kitchen: Send order ticket
    Kitchen-->>App: Order ready (15 min)
    App->>Driver: Assign delivery
    Driver-->>Customer: Pizza delivered 🍕
</pre>
</body>
</html>
EOF
open /tmp/pizza-flow.html
```

See that flow? Customer -> App -> Kitchen -> Driver -> Customer.

Now here's the raw text that generated it:

```
sequenceDiagram
    participant Customer
    participant App
    participant Kitchen
    participant Driver
    Customer->>App: Place order (pepperoni, large)
    App->>Kitchen: Send order ticket
    Kitchen-->>App: Order ready (15 min)
    App->>Driver: Assign delivery
    Driver-->>Customer: Pizza delivered 🍕
```

That text is hard for you to parse. But Claude reads it instantly.

For a real app, you'd have diagrams for auth flows, database operations, API routes - everything that explains how your code connects.

STOP: Makes sense? The diagram is for Claude, not for you.

USER: Yes / Got it / Interesting

## The Command

So how do we get these diagrams INTO Claude's brain before we start working?

Normally you start Claude Code by typing `claude` in your terminal. But you can add flags to customize how it starts up.

Here's the magic command:

```
claude --append-system-prompt "$(cat .ai/diagrams/*.md)"
```

You type this in your terminal INSTEAD of just `claude`. Let me break it down:

- `claude` - starts Claude Code (you know this part)
- `--append-system-prompt` - a flag that says "add this text to Claude's base instructions"
- `"$(cat .ai/diagrams/*.md)"` - reads all the .md files from the diagrams folder and passes them in

The result: Claude starts up with your architecture diagrams already loaded. When you ask "explain the pizza ordering flow" - it already knows. No searching.

Here's what's in the example diagram file at `.ai/diagrams/example-pizza-flow.md`:

ACTION: Print the contents of `.ai/diagrams/example-pizza-flow.md`

## Try It Yourself

Let's try it. I've included a sample diagram in this project at `.ai/diagrams/example-pizza-flow.md`.

Here's what to do:

1. Open a NEW terminal window (keep this lesson running here)
2. Navigate to this project folder. IMPORTANT - use quotes because the path has spaces:
   ```
   cd "YOUR_PATH_TO/advanced-claude-workflows"
   ```
   ACTION: Tell the user the exact quoted path to this folder so they can copy it.

3. Run: `claude --append-system-prompt "$(cat .ai/diagrams/*.md)"`
4. When that Claude starts, ask it: "Explain the pizza ordering flow"

Watch what happens - no file reads, no searching. It just knows.

STOP: Go try it now. Come back when you've seen how it responds.

USER: [User returns after trying]

That's the power of preloading context. No file searches. No exploration. Just answers.

For larger projects, you'd have multiple diagram files - one for auth, one for database operations, one for API routes. Load what you need.

STOP: Ready to learn how to make this easier with aliases?

USER: Yes / Ready

## Aliases

That command is powerful but annoying to type every time.

The solution: shell aliases.

An alias is a shortcut you define in your terminal config. You type a short word, and your terminal expands it into a longer command.

For example, if you add this line to your shell config file (~/.zshrc on Mac):

```
alias cdi="claude --append-system-prompt \"\$(cat .ai/diagrams/*.md)\""
```

Then instead of typing that whole command, you just type:

```
cdi
```

And it starts Claude with your diagrams pre-loaded.

Here are useful Claude Code aliases:

```bash
alias x="claude --dangerously-skip-permissions"
# Type `x` to start Claude in "live dangerously" mode - no permission prompts

alias h="claude --model claude-haiku-4-5-20251001"
# Type `h` to start Claude with the fast (but less smart) Haiku model

alias cdi="claude --append-system-prompt \"\$(cat .ai/diagrams/*.md)\""
# Type `cdi` to start Claude with your diagrams pre-loaded
```

You add these lines to your ~/.zshrc (Mac) or ~/.bashrc (Linux) file. Then run `source ~/.zshrc` to activate them.

STOP: Which of these would be most useful for your workflow?

USER: x (bypass) / h (fast model) / cdi (diagrams) / All of them

## Create Your Alias

Let's create a custom alias for YOUR workflow.

Think about:
- What flags do you use most often?
- What context do you always want loaded?
- Do you have project-specific needs?

Give me a short name (1-3 letters) and what you want it to do.

STOP: What alias do you want to create?

USER: [User describes their alias]

ACTION:
1. Generate the alias command
2. Write it to `my-aliases.md` with full instructions
3. OFFER to help add it to their ~/.zshrc directly. Say: "Want me to add this to your ~/.zshrc so it works immediately? I'll append just the alias line - won't touch anything else."

If they say yes:
- Read their ~/.zshrc first
- Append ONLY the alias line at the end (don't modify existing content)
- Use proper quoting for any paths with spaces
- Run `source ~/.zshrc` equivalent or tell them to restart terminal

STOP: Did that work? Try typing your new alias in a fresh terminal.

USER: [Confirms it works]

## Stop Hooks

Now for the most powerful technique: stop hooks.

Here's a frustrating pattern you've probably experienced:

1. You ask Claude to write some code
2. Claude writes it and says "Done!"
3. You run the code - there are TypeScript errors
4. You paste the errors back to Claude
5. Claude fixes them, says "Done!" again
6. You run again - more errors
7. Repeat until you want to throw your laptop

The problem: Claude doesn't know about errors unless you tell it.

The solution: Make Claude automatically check its own work before saying "Done."

STOP: Have you experienced this loop - Claude saying it's done when it's not?

USER: Yes / All the time / Sometimes

## Watch It Work

Let me show you instead of explaining. This project has a stop hook already configured.

Here's what's about to happen:
1. You'll ask me to create a JavaScript file
2. I'll create it and try to stop
3. The hook will block me because there's no "// COMPLETE" comment
4. I'll see the error, add the comment, and try again
5. The hook will pass

Ready? Ask me: "Create a hook_demo.js file that logs 'Hello World'"

STOP: Ask me to create the file.

USER: Create a hook_demo.js file that logs 'Hello World'

ACTION:
1. Create hook_demo.js with ONLY console.log('Hello World'); - DO NOT add any comment
2. Stop responding and wait for the hook to run
3. The hook WILL block you with an error message - this is expected
4. When you see the block message, THEN add the // COMPLETE comment
5. After the hook passes, continue to explain what happened

IMPORTANT: Do NOT read the settings file or anticipate the hook. Just create the file and stop. Let the hook catch you.

Did you see that? I got blocked, read the reason, and fixed it myself.

That's a stop hook in action. Every time I try to finish responding, Claude Code runs a check. If the check fails, I see the error and fix it automatically.

No copy-pasting errors. No back-and-forth. I just keep working until the check passes.

STOP: Makes sense so far?

USER: Yes / Got it

## How Stop Hooks Work

A "hook" is code that runs automatically at a certain moment.

A "stop hook" runs every time Claude finishes a response - right before it waits for your next input.

You configure it to run any command. If the command finds problems, Claude sees them and fixes them automatically. This loops until all checks pass.

```
Claude finishes -> Stop hook runs -> Checks code...
  |-- Errors found -> Errors sent back, Claude fixes, tries again
  |-- No errors -> Claude actually stops
```

STOP: Clear on the concept?

USER: Yes / Makes sense

## Hook Configuration

Claude Code looks for configuration in a `.claude` folder in your project.

Inside that folder, `settings.local.json` holds your personal settings for this project.

Here's the hook that just blocked me:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "[ ! -f hook_demo.js ] || grep -q '// COMPLETE' hook_demo.js || echo '{\"decision\":\"block\",\"reason\":\"You forgot to add the // COMPLETE comment to hook_demo.js\"}'"
          }
        ]
      }
    ]
  }
}
```

STOP: Want me to break down how that command works?

USER: Yes / Skip it

If user says yes:

Let me break down that command:

- `[ ! -f hook_demo.js ]` - if hook_demo.js doesn't exist, do nothing (pass)
- `||` - OR...
- `grep -q '// COMPLETE' hook_demo.js` - if hook_demo.js HAS the comment, do nothing (pass)
- `||` - OR...
- `echo '{...}'` - output JSON telling Claude what went wrong (block)

In plain English: "Only complain if hook_demo.js exists but lacks the // COMPLETE comment."

This hook uses only basic shell commands - no installs needed. Works on any Mac or Linux.

## The Pattern

The pattern for any hook is simple:

1. Run a check command (grep, npm test, typecheck, whatever)
2. If check fails -> output JSON with "decision": "block" and a "reason"
3. If check passes -> output nothing

The JSON becomes Claude's next instruction:

```json
{
  "decision": "block",
  "reason": "You forgot to add the // COMPLETE comment."
}
```

Claude sees this, understands the problem, and fixes it automatically.

STOP: Got the pattern?

USER: Yes / Got it

## Why This Matters

Think about what this enables:

**Without hooks:** You're the quality gate. You run tests, see errors, paste them back, wait for fixes, run again. Tedious.

**With hooks:** Claude becomes self-correcting. It can't say "done" until the checks actually pass. You can walk away and come back to working code.

This is huge for:
- Long-running tasks (Claude keeps going until tests pass)
- Maintaining code quality (every change gets checked)
- Building trust (you know Claude won't leave broken code)

STOP: See how this changes the workflow?

USER: Yes / Definitely

## Other Hooks You Could Set Up

The demo used a simple grep check. Here's what you'd use in real projects:

```bash
# TypeScript type checking
npm run typecheck 2>&1 || echo '{"decision":"block","reason":"TypeScript errors found"}'

# Linting
npm run lint 2>&1 || echo '{"decision":"block","reason":"Linting errors found"}'

# Tests
npm test 2>&1 || echo '{"decision":"block","reason":"Tests failing"}'

# Build check
npm run build 2>&1 || echo '{"decision":"block","reason":"Build failed"}'
```

You can chain multiple checks. If ANY fail, Claude keeps working.

STOP: What quality checks would you add to YOUR projects?

USER: [User responds with their ideas]

Good thinking. The pattern is always the same:
1. Run your check command
2. If it fails, output JSON with the reason
3. If it passes, output nothing

STOP: Ready for the final two topics? They're more about mindset than configuration.

USER: Yes / Ready

## The Infinite Junior Engineer

Here's a powerful way to think about AI automation:

Imagine you had infinite junior engineers - always available, no meetings, happy to do tedious work. What would you have them do?

Most people think: "Write code faster."

But the real answer is all the stuff AROUND the code:
- Trace who wrote this code and why
- Find the history of every file involved
- Write a risk assessment before touching anything
- Generate a tech spec for review
- Document everything after
- Summarize the PR for reviewers
- Write the commit messages

All of that is a prompt. All of it can be automated.

The AI isn't replacing your judgment. It's doing the boring prep work so you can focus on decisions that actually matter.

STOP: What "drudgery" tasks would you hand off to infinite junior engineers?

USER: [User responds]

Good thinking. Those are exactly the kinds of tasks to automate.

## Handling Drift

One last technique: what to do when Claude goes off the rails.

Sometimes Claude gets confused and starts doing the wrong thing. You try to correct it. It gets more confused. You're both frustrated.

Here's a better approach:

1. Don't fight it - trying to steer a confused AI back rarely works
2. Export the conversation (Claude Code has an export command)
3. Paste it into a DIFFERENT model (ChatGPT, Gemini, etc.)
4. Ask that model: "Where did this conversation go wrong? How should I have prompted differently?"
5. Start fresh with a better prompt

Why does this work? The second model isn't "stuck" in the same confusion. It can look at the conversation objectively and spot where things derailed.

Think of it like asking a colleague to review a confusing email thread. Fresh eyes see what you can't.

STOP: Have you ever tried using one AI to debug another?

USER: Yes / No / Interesting idea

## Wrap Up

Here's what you learned:

1. **Mermaid diagrams** - Preload architecture context with --append-system-prompt
2. **Aliases** - One-letter shortcuts for your common Claude configurations
3. **Stop hooks** - Automatic quality gates that make Claude self-correct
4. **Infinite junior engineer** - Think about automation as prep work, not code writing
5. **Drift recovery** - Use a second model as mediator when things go wrong

You have:
- A sample diagram in `.ai/diagrams/`
- A working stop hook in `.claude/settings.local.json`
- Your custom aliases in `my-aliases.md`

The philosophy: "It's easier to edit than author." Get something generated - even if wrong - then iterate.

Now go build something.

## Notes for Claude

**Teaching style:**
- Conversational, direct, no fluff
- Quote examples inline (user can't see file reads)
- Actually run bash commands to open the mermaid diagram in browser
- Actually use the Ask User Question tool for STOP points when possible
- Write real content to my-aliases.md

**If user doesn't have an alias idea:**
- Suggest: combining bypass + diagrams, or project-specific context loading

**If user seems confused:**
- Slow down, check understanding
- Offer to re-explain any technique

**Success criteria:**
- User understands mermaid diagrams for context preloading
- User saw the diagram rendered in browser
- User has at least one custom alias in my-aliases.md
- User witnessed the stop hook demo (got blocked, self-corrected)
- User knows the "infinite junior engineer" mindset
