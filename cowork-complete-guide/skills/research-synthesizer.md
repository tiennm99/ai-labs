# Research Synthesizer Skill

## When to Use
Use this skill whenever you need to extract meaning from multiple documents — not just summarize them individually, but find patterns, contradictions, and insights *across* the full set.

Ideal triggers:
- "Analyze these [N] documents and tell me what they say collectively"
- "Research [topic] and give me a synthesis"
- "What are the key themes across all of this?"
- "Compare these sources and find contradictions"
- "Give me strategic recommendations based on this research"

---

## Input Requirements

**Minimum viable input:**
- 2+ documents (files, URLs, or pasted content)
- A clear question or goal ("what should we do about X?" or "what patterns emerge?")

**Better inputs include:**
- The decision or action this research will inform
- The audience for the output (executive, team, personal reference)
- Any specific angles or perspectives to prioritize

**Supported input types:**
- Local files (any format: .txt, .md, .pdf, .docx)
- Folder paths ("analyze everything in /research/")
- Web URLs (for current/public information)
- Mixed local + web sources

---

## When to Request Sub-Agents

Use parallel sub-agents when:
- **5+ documents** — process batches simultaneously instead of sequentially
- **Vendor/option comparison** — assign one agent per vendor so analyses are independent and unbiased
- **Multi-perspective analysis** — assign one agent per perspective (financial, customer, operational) so each goes deep without anchoring on others
- **Large corpus (20+)** — split into thematic batches, synthesize batch outputs into final report

You can explicitly request this:
> "Analyze these documents using parallel processing"
> "Research each vendor independently, then compare"
> "Analyze this decision from financial, customer, and operational perspectives simultaneously"

---

## Output Format

### Standard Research Synthesis
1. **Executive Summary** — 3–5 sentence answer to the core question
2. **Key Themes** — dominant patterns across documents (with source citations)
3. **Supporting Data** — statistics, quotes, and specific facts compiled in one place
4. **Contradictions & Tensions** — where sources disagree or create trade-offs
5. **Strategic Recommendations** — what to do, in priority order
6. **Questions for Further Research** — what the documents don't answer

### Vendor Comparison Output
- Individual vendor profiles (price, performance, reliability, service, fit)
- Side-by-side comparison table
- Clear recommendation with rationale
- Conditions under which the recommendation changes

### Multi-Perspective Output
- One section per perspective (each argued independently)
- Synthesis section showing cross-perspective patterns
- Single overall recommendation
- Conditions/triggers that change the recommendation

---

## How to Incorporate Web Research

Combine local files + web search for the most complete picture:

- **Local files** = proprietary data, historical records, internal strategy, meeting notes
- **Web search** = current market conditions, competitor moves, public data, recent news

When to add web research:
- Local files are more than 12 months old (market conditions may have shifted)
- You need competitor or industry context not in internal documents
- You want to pressure-test internal assumptions against external reality

How to request it:
> "Analyze my internal documents AND search for recent [topic] news to add external context"
> "After synthesizing the local files, search for what competitors are doing on [topic]"

---

## Example Prompts

**Large document set:**
> "I have 40 customer interview transcripts in /research/interviews/. What are the top 5 themes about why customers churn? Use parallel processing and create a synthesis report."

**Vendor comparison:**
> "Compare these three CRM vendors — Salesforce, HubSpot, and Pipedrive — based on the files in /vendor-research/. Research each independently then give me a recommendation for a 10-person sales team."

**Multi-perspective:**
> "Should we launch in the European market? Analyze this decision from financial, legal/compliance, and customer adoption perspectives simultaneously. Then synthesize."

**Local + web:**
> "Read our internal competitive analysis from last year and add current web research on [Competitor X]. Tell me what's changed and update our positioning recommendations."
