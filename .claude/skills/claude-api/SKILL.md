---
name: claude-api
description: "Build apps with the Claude API or Anthropic SDK. TRIGGER when: code imports `anthropic`/`@anthropic-ai/sdk`/`claude_agent_sdk`, or user asks to use Claude API, Anthropic SDKs, or Agent SDK. DO NOT TRIGGER when: code imports `openai`/other AI SDK, general programming, or ML/data-science tasks."
allowed-tools: Read, Glob, Grep, Bash, WebFetch, WebSearch
---

# Claude API / Anthropic SDK Integration

ultrathink

## Cardinal Rule

> **Always WebFetch the official docs before writing any API integration code.**
> Anthropic's API evolves frequently. Never rely on training data for endpoints, parameters, or SDK methods.

## Before Writing Code — Verify

```
WebFetch("https://docs.anthropic.com/en/api/messages")
WebFetch("https://docs.anthropic.com/en/docs/initial-setup")
```

Check current SDK version:
```bash
npm view @anthropic-ai/sdk version
```

## Current SDKs (verify before use)

| SDK | Package | Verified |
|-----|---------|----------|
| **TypeScript/JS** | `@anthropic-ai/sdk` | `npm view @anthropic-ai/sdk version` |
| **Python** | `anthropic` | `pip show anthropic` |
| **Agent SDK** | `@anthropic-ai/claude-agent-sdk` | `npm view @anthropic-ai/claude-agent-sdk version` |

## TypeScript SDK — Quick Reference

**Install:**
```bash
npm install @anthropic-ai/sdk
```

**Basic usage (ALWAYS verify against official docs):**
```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello, Claude" }
  ],
});
```

## Current Model IDs (verify at docs.anthropic.com)

Always WebFetch to confirm current model IDs before hardcoding:
```
WebFetch("https://docs.anthropic.com/en/docs/about-claude/models")
```

| Family | Model ID pattern | Notes |
|--------|-----------------|-------|
| Claude 4.5/4.6 Opus | `claude-opus-4-*` | Most capable |
| Claude 4.5/4.6 Sonnet | `claude-sonnet-4-*` | Best balance |
| Claude 4.5 Haiku | `claude-haiku-4-5-*` | Fastest, cheapest |

**IMPORTANT:** Model IDs include date suffixes (e.g., `20250514`). Always check the docs for the latest dated version. Using `claude-sonnet-4-latest` is acceptable for non-production code.

## Tool Use (Function Calling)

WebFetch the tool use docs before implementing:
```
WebFetch("https://docs.anthropic.com/en/docs/build-with-claude/tool-use")
```

**Pattern (verify against docs):**
```typescript
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [
    {
      name: "get_weather",
      description: "Get current weather for a location",
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string", description: "City name" }
        },
        required: ["location"]
      }
    }
  ],
  messages: [{ role: "user", content: "What's the weather in São Paulo?" }]
});
```

## Streaming

```
WebFetch("https://docs.anthropic.com/en/api/messages-streaming")
```

## Extended Thinking

```
WebFetch("https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking")
```

## Agent SDK

For building custom AI agents:
```bash
npm view @anthropic-ai/claude-agent-sdk version
```

WebFetch the agent SDK docs:
```
WebFetch("https://docs.anthropic.com/en/docs/claude-code/agent-sdk")
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API authentication |
| `ANTHROPIC_BASE_URL` | Custom API base URL (optional) |

**NEVER hardcode API keys.** Always use environment variables.
Store in `.env.local` (git-ignored), reference via `process.env.ANTHROPIC_API_KEY`.

## Rate Limits & Pricing

Always check current limits:
```
WebFetch("https://docs.anthropic.com/en/api/rate-limits")
WebFetch("https://docs.anthropic.com/en/docs/about-claude/pricing")
```

## Error Handling

```typescript
import Anthropic from "@anthropic-ai/sdk";

try {
  const message = await client.messages.create({ /* ... */ });
} catch (error) {
  if (error instanceof Anthropic.APIError) {
    console.error(`API Error: ${error.status} ${error.message}`);
    // Handle specific status codes:
    // 400 = bad request, 401 = auth, 429 = rate limit, 500 = server error
  }
}
```

## Integration Rules

1. **WebFetch docs first** — every endpoint, parameter, and pattern must be verified
2. **Check SDK version** — `npm view @anthropic-ai/sdk version` before writing code
3. **Never hardcode model IDs** — use environment variables or constants that can be updated
4. **Never expose API keys** — `.env.local` only, never in client-side code
5. **Handle all errors** — rate limits, auth failures, API errors
6. **Use streaming** for user-facing responses — better perceived performance
7. **Set max_tokens explicitly** — never rely on defaults
