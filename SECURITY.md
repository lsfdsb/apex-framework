# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 5.x     | Yes       |
| < 5.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in the APEX Framework, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead:

1. Email the details to the maintainer (see GitHub profile)
2. Include a description of the vulnerability and steps to reproduce
3. Allow up to 72 hours for an initial response

## What We Consider Security Issues

- Hardcoded secrets or credentials in framework code
- Hook scripts that could be exploited for command injection
- Permission bypasses in the safety net (block-dangerous-commands, protect-files)
- Agent isolation failures that could leak data between projects
- Install script vulnerabilities (path traversal, arbitrary code execution)

## Security Architecture

APEX implements defense in depth:

1. **Permission layer** — `settings.json` allowlists specific tools and commands
2. **Hook layer** — PreToolUse hooks block dangerous patterns (`rm -rf`, force push, `DROP TABLE`)
3. **File protection** — `.env`, `.git/`, `.claude/settings.json` are write-protected
4. **Secret scanning** — PreToolUse scans for hardcoded API keys, tokens, and credentials
5. **Sandbox** — Network restricted to approved domains, filesystem denies access to `~/.ssh`, `~/.aws`
6. **Dependency verification** — `/verify-lib` checks every package before installation

## Patch Timeline

- **Critical**: Patch within 24 hours
- **High**: Patch within 72 hours
- **Medium**: Patch in next release
- **Low**: Tracked and prioritized
