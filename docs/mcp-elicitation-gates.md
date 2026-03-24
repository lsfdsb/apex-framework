# MCP Elicitation — Structured Approval Gates

> Available in Claude Code v2.1.76+

## What Is MCP Elicitation?

MCP Elicitation lets an MCP server request **structured input** from the user during a Claude Code session. Instead of Claude presenting a text block and waiting for a free-form reply, an MCP server can surface a typed form — dropdowns, checkboxes, text fields — and get back a validated, machine-readable decision.

The user sees a native UI prompt (rendered by Claude Code). The result is returned to Claude as structured data, not parsed prose.

This is different from a tool call. Elicitation is initiated by the **server**, not by Claude. The server says "I need input from the user right now" and Claude Code pauses to collect it.

## How APEX Gates Can Use It

APEX has three hard gates in the autonomous pipeline:

| Gate | Current behavior | With Elicitation |
|---|---|---|
| PRD Approval | Claude presents markdown, waits for "yes/no" reply | Structured form: Approve / Reject / Request changes (with field for notes) |
| Architecture Approval | Claude presents markdown, waits for "yes/no" reply | Structured form: Approve / Reject / with optional dependency checklist |
| Ship (Merge) Approval | Claude presents PR URL, waits for user to say "merge" | Structured form: Approve with merge strategy (squash / rebase / merge commit) |

The key benefit is precision. "Approve with squash" is unambiguous. A free-text reply of "yeah go ahead with squash merge" requires parsing. Elicitation eliminates that ambiguity.

### PRD Gate Form (example schema)

```json
{
  "type": "object",
  "title": "PRD Review",
  "description": "Review the generated PRD before implementation begins.",
  "properties": {
    "decision": {
      "type": "string",
      "enum": ["approve", "reject", "request_changes"],
      "title": "Decision"
    },
    "notes": {
      "type": "string",
      "title": "Notes",
      "description": "Optional — scope changes, clarifications, or rejection reason."
    }
  },
  "required": ["decision"]
}
```

### Architecture Gate Form (example schema)

```json
{
  "type": "object",
  "title": "Architecture Review",
  "description": "Approve or reject the proposed architecture before the build team starts.",
  "properties": {
    "decision": {
      "type": "string",
      "enum": ["approve", "reject"],
      "title": "Decision"
    },
    "dependency_check_passed": {
      "type": "boolean",
      "title": "I have reviewed the dependency graph",
      "default": false
    },
    "notes": {
      "type": "string",
      "title": "Notes"
    }
  },
  "required": ["decision", "dependency_check_passed"]
}
```

### Ship Gate Form (example schema)

```json
{
  "type": "object",
  "title": "Ship Approval",
  "description": "Approve the PR and select a merge strategy.",
  "properties": {
    "decision": {
      "type": "string",
      "enum": ["approve", "reject"],
      "title": "Decision"
    },
    "merge_strategy": {
      "type": "string",
      "enum": ["squash", "rebase", "merge_commit"],
      "title": "Merge strategy",
      "default": "squash"
    }
  },
  "required": ["decision"]
}
```

## Implementation Pattern

MCP Elicitation uses two hook events: `Elicitation` (server initiates a request) and `ElicitationResult` (user response is returned). A gate MCP server would:

1. Expose a tool that Claude calls when a gate is reached (e.g., `request_prd_approval`)
2. The tool handler triggers an elicitation request with the appropriate JSON schema
3. Claude Code presents the form to the user
4. The result is returned to the tool handler
5. The handler returns a structured decision to Claude

### Minimal gate server (Node.js pseudocode)

```typescript
// gate-server.ts — reference pattern, not production code
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "apex-gates", version: "1.0.0" });

server.tool(
  "request_prd_approval",
  { prd_summary: z.string() },
  async ({ prd_summary }, { elicit }) => {
    // elicit() pauses Claude and presents the form to the user
    const result = await elicit({
      message: `Review the PRD before implementation begins:\n\n${prd_summary}`,
      requestedSchema: {
        type: "object",
        properties: {
          decision: {
            type: "string",
            enum: ["approve", "reject", "request_changes"],
          },
          notes: { type: "string" },
        },
        required: ["decision"],
      },
    });

    if (result.action === "cancel") {
      return { content: [{ type: "text", text: "Gate cancelled by user." }] };
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({ gate: "prd", ...result.content }),
      }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

The same pattern applies to architecture and ship gates — just swap the schema and tool name.

## Hook Configuration

No new hook types are needed in `settings.json` for basic elicitation. The `Elicitation` and `ElicitationResult` events are part of the MCP protocol layer, not the Claude Code hook system.

If you want to **log** elicitation events for audit purposes, you can add hooks:

```json
"hooks": {
  "Elicitation": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo \"[APEX GATE] Elicitation requested\" >> /tmp/apex-gates.log",
          "timeout": 2
        }
      ]
    }
  ],
  "ElicitationResult": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "echo \"[APEX GATE] Elicitation completed\" >> /tmp/apex-gates.log",
          "timeout": 2
        }
      ]
    }
  ]
}
```

Note: `Elicitation` and `ElicitationResult` hook support requires Claude Code v2.1.76+. Check `claude --version` before adding these hooks.

## MCP Server Config Entry

See `.mcp.json.template` for the commented-out entry. The short version:

```json
"apex-gates": {
  "command": "node",
  "args": ["./mcp-servers/apex-gates/dist/index.js"],
  "env": {}
}
```

Build the server in `./mcp-servers/apex-gates/` following the pattern above. The actual MCP server is per-project — this framework provides the pattern, not the implementation.

## When to Use This

Use MCP Elicitation gates when:
- The project has strict change control (regulated industries, multi-team orgs)
- You want an audit trail of gate decisions (log via `ElicitationResult` hook)
- The pipeline runs in a context where free-text parsing is unreliable
- You want to enforce a merge strategy across all PRs

For solo projects or fast-moving prototypes, the current text-based gates are sufficient. The elicitation pattern adds precision at the cost of a server to build and maintain.

## References

- MCP Elicitation spec: https://modelcontextprotocol.io/specification/2025-11-05/client/elicitation
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Claude Code hook events: `.claude/settings.json` in this repo
