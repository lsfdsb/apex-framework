---
name: security
description: Runs a security audit on code handling authentication, authorization, payments, user data, file uploads, or external integrations. This skill should be used when the user mentions security, auth, login, password, token, API key, encryption, OWASP, vulnerability, injection, XSS, CSRF, or when reviewing sensitive code. Follows the Ionescu/Rutkowska philosophy — defense in depth, trust nothing.
argument-hint: '[component or file to audit]'
allowed-tools: Read, Grep, Glob, Bash
hooks:
  PreToolUse:
    - matcher: 'Bash'
      hooks:
        - type: command
          command: '$CLAUDE_PROJECT_DIR/.claude/scripts/block-dangerous-commands.sh'
          timeout: 5
---

# Security Audit — Trust Nothing

> "Security is a process, not a product." — Bruce Schneier

## Current Context

Dependencies with known issues: !`npm audit --audit-level=moderate 2>/dev/null | head -15`
Env files present: !`ls -la .env* 2>/dev/null || echo "No .env files found"`

## Scan Process

1. **Grep for danger patterns** in changed/relevant files:
   - SQL injection: raw queries, template literals with `${user_input}` in SQL
   - Secrets: hardcoded passwords, API keys (`sk-*`, `ghp_*`, `AKIA*`), tokens (`Bearer` hardcoded, `token=`)
   - Sensitive data in logs: `console.log` with password, token, secret, key variables
   - Dangerous functions: `eval()`, `new Function()`, `innerHTML =`, `dangerouslySetInnerHTML`, `exec()`
   - Open redirects: unvalidated URL redirects

2. **Review auth flows**: trace every authentication and authorization path

3. **Check API boundaries**: every endpoint must validate input + check permissions

4. **Dependency audit**: run `npm audit` or equivalent

## Checklist (OWASP Top 10 + Beyond)

**Injection**: Parameterized queries only. No user input in shell commands.
**Auth**: bcrypt/argon2 (cost ≥12). Session tokens ≥128 bits. Rate-limited login.
**Authorization**: Server-side checks on every endpoint. Object-level authorization (no IDOR).
**Data Protection**: PII encrypted at rest. TLS 1.2+ everywhere. Never log sensitive data.
**Input Validation**: Server-side always. Length limits. Content-Type on uploads. HTML escaped.
**Dependencies**: No known critical CVEs. Pinned versions. Lock files committed.
**Error Handling**: No stack traces to users. Security events logged. Generic user messages.
**Config**: No secrets in code. `.env` in `.gitignore`. Debug off in production. Security headers set.

## Zero Tolerance (always blocks release)

- SQL/XSS injection vulnerability
- Hardcoded secrets or credentials
- Missing auth on sensitive endpoints
- Missing authorization checks (IDOR)
- Unencrypted PII storage/transmission
- Known critical CVE in dependencies

## Detailed Reference

For grep commands, security headers config, Next.js vulnerability patterns, and env var security, read `$SKILL_DIR/reference.md`.

## Output

```markdown
## Security Audit: [Component]

**Risk Level**: 🔴 CRITICAL / 🟡 ELEVATED / 🟢 LOW

### Vulnerabilities

#### [VULN-001] [Title]

- Severity: Critical/High/Medium/Low
- Category: [OWASP category]
- Location: file:line
- Impact: What an attacker could do
- Fix: Exact remediation

### Posture Summary

Auth: ✅/⚠️/❌ | Authorization: ✅/⚠️/❌ | Input Validation: ✅/⚠️/❌
Data Protection: ✅/⚠️/❌ | Dependencies: ✅/⚠️/❌ | Config: ✅/⚠️/❌
```
