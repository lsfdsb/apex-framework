#!/usr/bin/env node
/**
 * APEX Observatory — The Watchtower
 *
 * Zero-dependency Node.js server for framework health visualization.
 * Reads .claude/ directory at runtime and exposes structured JSON APIs.
 *
 * Usage:
 *   node dashboard/server.js              # default port 3000
 *   PORT=8080 node dashboard/server.js    # custom port
 *
 * by L.B. & Claude · São Paulo, 2026
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PORT = parseInt(process.env.PORT || "3000", 10);
const ROOT = path.resolve(__dirname, "..");

// ── Helpers ──────────────────────────────────────────────────

function readFile(p) {
  try { return fs.readFileSync(path.join(ROOT, p), "utf-8"); }
  catch { return null; }
}

function run(cmd, timeout = 30000) {
  try { return execSync(cmd, { cwd: ROOT, timeout, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }); }
  catch (e) { return e.stdout || e.stderr || e.message; }
}

function respond(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ timestamp: new Date().toISOString(), data }));
}

function parseVersion() {
  return readFile("VERSION")?.trim() || "unknown";
}

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
}

// ── Frontmatter Parser ───────────────────────────────────────

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return {
    raw: m[1],
    get: (key) => {
      const r = m[1].match(new RegExp(`^${key}:\\s*(.+)`, "m"));
      return r ? r[1].trim() : null;
    },
  };
}

// ── Collectors ───────────────────────────────────────────────

function collectAgents() {
  const dir = path.join(ROOT, ".claude", "agents");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).filter(f => f.endsWith(".md")).map(f => {
    const content = fs.readFileSync(path.join(dir, f), "utf-8");
    const fm = parseFrontmatter(content);
    if (!fm) return { file: f, name: f.replace(".md", ""), valid: false, issues: ["No frontmatter"] };

    const name = fm.get("name");
    const description = fm.get("description");
    const model = fm.get("model");
    const tools = fm.get("tools");
    const disallowed = fm.get("disallowedTools");
    const background = fm.get("background");
    const permissionMode = fm.get("permissionMode");
    const skills = fm.get("skills");

    const issues = [];
    if (!name) issues.push("Missing name");
    if (!description) issues.push("Missing description");
    if (!model) issues.push("Missing model");
    if (!tools) issues.push("Missing tools");
    if (model && !["opus", "sonnet", "haiku"].includes(model)) issues.push(`Invalid model: ${model}`);

    if (tools && disallowed) {
      const tl = tools.split(",").map(t => t.trim());
      const dl = disallowed.split(",").map(t => t.trim());
      const overlap = tl.filter(t => dl.includes(t));
      if (overlap.length) issues.push(`Tool conflict: ${overlap.join(", ")}`);
    }
    if (background === "true" && permissionMode !== "dontAsk") {
      issues.push("Background agent without dontAsk permission");
    }
    if (tools?.includes("SendMessage") && !tools.includes("TaskCreate") && !tools.includes("TaskUpdate")) {
      issues.push("Has SendMessage but no TaskCreate/TaskUpdate");
    }
    if (skills) {
      for (const s of skills.split(",").map(s => s.trim())) {
        if (!fs.existsSync(path.join(ROOT, ".claude", "skills", s))) {
          issues.push(`Missing skill: ${s}`);
        }
      }
    }

    const toolList = tools ? tools.split(",").map(t => t.trim()) : [];
    const writeTools = ["Edit", "Write", "MultiEdit", "Bash", "NotebookEdit"];
    const readOnly = !toolList.some(t => writeTools.includes(t));

    return {
      file: f,
      name: name || f.replace(".md", ""),
      description,
      model,
      tools: toolList,
      disallowedTools: disallowed ? disallowed.split(",").map(t => t.trim()) : [],
      background: background === "true",
      permissionMode,
      skills: skills ? skills.split(",").map(s => s.trim()) : [],
      readOnly,
      valid: issues.length === 0,
      issues,
    };
  });
}

function collectSkills() {
  const dir = path.join(ROOT, ".claude", "skills");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    .map(f => {
      const skillFile = path.join(dir, f, "SKILL.md");
      if (!fs.existsSync(skillFile)) {
        return { dir: f, name: f, valid: false, issues: ["No SKILL.md"] };
      }

      const content = fs.readFileSync(skillFile, "utf-8");
      const fm = parseFrontmatter(content);
      if (!fm) return { dir: f, name: f, valid: false, issues: ["No frontmatter"] };

      const name = fm.get("name");
      const description = fm.get("description");
      const allowedTools = fm.get("allowed-tools");
      const triggers = fm.get("triggers");

      const issues = [];
      if (!name) issues.push("Missing name");
      if (!description) issues.push("Missing description");
      if (name && name !== f) issues.push(`Name mismatch: '${name}' vs dir '${f}'`);

      const bodyHasTeamCreate = content.includes("TeamCreate");
      const toolsHaveTeamCreate = allowedTools?.includes("TeamCreate");
      if (bodyHasTeamCreate && !toolsHaveTeamCreate) {
        issues.push("Uses TeamCreate in body but not in allowed-tools");
      }

      const bodyHasAgent = /Agent\s*\(/.test(content);
      const toolsHaveAgent = allowedTools?.includes("Agent");
      if (bodyHasAgent && !toolsHaveAgent) {
        issues.push("Uses Agent() in body but not in allowed-tools");
      }

      return {
        dir: f,
        name: name || f,
        description,
        allowedTools: allowedTools ? allowedTools.split(",").map(t => t.trim()) : [],
        triggers: triggers ? triggers.split(",").map(t => t.trim()) : [],
        teamAware: !!(bodyHasTeamCreate && toolsHaveTeamCreate),
        valid: issues.length === 0,
        issues,
      };
    });
}

function collectScripts() {
  const dir = path.join(ROOT, ".claude", "scripts");
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).filter(f => f.endsWith(".sh")).map(f => {
    const fullPath = path.join(dir, f);
    const executable = !!(fs.statSync(fullPath).mode & 0o111);
    const syntaxResult = run(`bash -n "${fullPath}" 2>&1`);
    const syntaxOk = !syntaxResult || syntaxResult.trim() === "";
    return {
      file: f,
      executable,
      syntaxOk,
      syntaxError: syntaxOk ? null : syntaxResult.trim(),
      valid: executable && syntaxOk,
    };
  });
}

function collectSettings() {
  const settingsPath = path.join(ROOT, ".claude", "settings.json");
  if (!fs.existsSync(settingsPath)) return { valid: false, error: "settings.json not found" };

  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
    const hooks = settings.hooks || {};
    const env = settings.env || {};
    const agentTeams = env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === "1";
    let scriptIssues = 0;
    const hookDetails = [];

    for (const [event, entries] of Object.entries(hooks)) {
      for (const entry of (Array.isArray(entries) ? entries : [entries])) {
        if (entry.command) {
          const scriptPath = entry.command.replace(/\$CLAUDE_PROJECT_DIR/g, ROOT).split(" ")[0];
          const exists = fs.existsSync(scriptPath);
          const exec = exists && !!(fs.statSync(scriptPath).mode & 0o111);
          if (!exists || !exec) scriptIssues++;
          hookDetails.push({
            event,
            command: entry.command.replace(ROOT, "$PROJECT"),
            exists,
            executable: exec,
            matcher: entry.matcher || null,
          });
        }
      }
    }

    return {
      valid: true,
      hookEvents: Object.keys(hooks).length,
      hookDetails,
      agentTeams,
      env: Object.keys(env),
      scriptIssues,
    };
  } catch (e) {
    return { valid: false, error: `JSON parse error: ${e.message}` };
  }
}

function collectHooks(settings = null) {
  const scripts = collectScripts();
  const s = settings || collectSettings();
  const wiredFiles = s.valid && s.hookDetails
    ? s.hookDetails.map(h => path.basename(h.command.split(" ")[0]))
    : [];
  return scripts.map(script => ({
    ...script,
    wiredInSettings: wiredFiles.some(f => f === script.file),
  }));
}

function collectCrossRef() {
  const claudeMd = readFile("CLAUDE.md") || "";
  const teamSkill = readFile(".claude/skills/teams/SKILL.md") || "";

  return collectAgents().map(agent => {
    const inClaudeMd = new RegExp(agent.name, "i").test(claudeMd);
    const inTeamsSkill = new RegExp(agent.name, "i").test(teamSkill);
    const hasTests = (run(`grep -rl "${agent.name}" tests/ 2>/dev/null`) || "").trim().length > 0;
    return {
      agent: agent.name,
      claudeMd: inClaudeMd,
      teamsSkill: inTeamsSkill,
      testCoverage: hasTests,
      allGreen: inClaudeMd && inTeamsSkill && hasTests,
    };
  });
}

// ── Activity Collector ───────────────────────────────────────

function collectActivity() {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  const teamsDir = path.join(home, ".claude", "teams");
  const tasksDir = path.join(home, ".claude", "tasks");
  const teams = [];

  if (!fs.existsSync(teamsDir)) return { teams: [], tasks: [] };

  for (const entry of fs.readdirSync(teamsDir)) {
    const configPath = path.join(teamsDir, entry, "config.json");
    if (!fs.existsSync(configPath)) continue;
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      teams.push({
        name: config.name || entry,
        description: config.description || "",
        createdAt: config.createdAt ? new Date(config.createdAt).toISOString() : null,
        members: (config.members || []).map(m => ({
          name: m.name,
          type: m.agentType,
          model: (m.model || "").replace(/^claude-/, "").split("[")[0],
          active: !!m.isActive,
          prompt: m.prompt ? m.prompt.slice(0, 200) + (m.prompt.length > 200 ? "…" : "") : null,
        })),
      });
    } catch { /* skip corrupt configs */ }
  }

  const tasks = [];
  if (fs.existsSync(tasksDir)) {
    for (const session of fs.readdirSync(tasksDir)) {
      const sessionDir = path.join(tasksDir, session);
      if (!fs.statSync(sessionDir).isDirectory()) continue;
      for (const f of fs.readdirSync(sessionDir).filter(f => f.endsWith(".json") && f !== ".lock")) {
        try {
          const task = JSON.parse(fs.readFileSync(path.join(sessionDir, f), "utf-8"));
          if (!task.subject) continue;
          tasks.push({
            id: task.id,
            session: session.slice(0, 8),
            subject: task.subject,
            status: task.status || "pending",
            owner: task.owner || null,
            activeForm: task.activeForm || null,
          });
        } catch { /* skip corrupt tasks */ }
      }
    }
  }

  return { teams, tasks };
}

// ── Test Runner ──────────────────────────────────────────────

const TEST_SCRIPTS = {
  framework: "tests/test-framework.sh",
  hooks: "tests/test-hooks.sh",
  integration: "tests/test-integration.sh",
};

function runTestSuite(suite) {
  const script = TEST_SCRIPTS[suite];
  if (!script) return { error: "Unknown suite. Valid: framework, hooks, integration" };

  const raw = run(`bash ${script} 2>&1`, 60000);
  const output = stripAnsi(raw);
  const passed = parseInt(
    (output.match(/(\d+)\s*passed/) || output.match(/Pass:\s*(\d+)/))?.[1] || "0",
    10
  );
  const failed = parseInt(
    (output.match(/(\d+)\s*failed/) || output.match(/Fail:\s*(\d+)/))?.[1] || "0",
    10
  );
  return {
    suite,
    passed,
    failed,
    allPassed: failed === 0 && passed > 0,
    output: output.slice(-2000),
  };
}

// ── Router ───────────────────────────────────────────────────

function handleApi(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  switch (url.pathname) {

    case "/api/overview": {
      const version = parseVersion();
      const agents = collectAgents();
      const skills = collectSkills();
      const settings = collectSettings();
      const hooks = collectHooks(settings);
      const crossRef = collectCrossRef();
      respond(res, {
        version,
        health: {
          agents: { total: agents.length, healthy: agents.filter(a => a.valid).length },
          skills: { total: skills.length, healthy: skills.filter(s => s.valid).length },
          hooks: { total: hooks.length, healthy: hooks.filter(h => h.valid).length },
          settings: settings.valid,
          hookEvents: settings.hookEvents || 0,
          agentTeams: settings.agentTeams || false,
        },
        agents,
        skills,
        hooks,
        settings,
        crossRef,
      });
      break;
    }

    case "/api/agents":
      respond(res, { agents: collectAgents() });
      break;

    case "/api/skills":
      respond(res, { skills: collectSkills() });
      break;

    case "/api/hooks": {
      const settings = collectSettings();
      respond(res, { hooks: collectHooks(settings), settings });
      break;
    }

    case "/api/crossref":
      respond(res, { matrix: collectCrossRef() });
      break;

    case "/api/workflow": {
      const steps = [
        "prd", "architecture", "research", "teams",
        "qa", "security", "a11y", "cx-review", "commit",
      ];
      const chain = steps.map(s => ({
        skill: s,
        command: `/${s}`,
        exists: fs.existsSync(path.join(ROOT, ".claude", "skills", s)),
      }));
      respond(res, { chain, complete: chain.every(s => s.exists) });
      break;
    }

    case "/api/test": {
      const suite = url.searchParams.get("suite");
      if (!suite || !TEST_SCRIPTS[suite]) {
        return respond(res, { error: "Invalid suite. Valid: framework, hooks, integration" }, 400);
      }
      respond(res, runTestSuite(suite));
      break;
    }

    case "/api/test/all": {
      const framework = runTestSuite("framework");
      const hooks = runTestSuite("hooks");
      const integration = runTestSuite("integration");
      const totalPassed = framework.passed + hooks.passed + integration.passed;
      const totalFailed = framework.failed + hooks.failed + integration.failed;
      respond(res, {
        framework,
        hooks,
        integration,
        summary: { totalPassed, totalFailed, allPassed: totalFailed === 0 },
      });
      break;
    }

    case "/api/activity":
      respond(res, collectActivity());
      break;

    default:
      respond(res, { error: "Not found" }, 404);
  }
}

// ── Static ───────────────────────────────────────────────────

function serveStatic(req, res) {
  const htmlPath = path.join(__dirname, "index.html");
  if (fs.existsSync(htmlPath)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(htmlPath));
  } else {
    res.writeHead(404);
    res.end("Dashboard HTML not found");
  }
}

// ── Server ───────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) handleApi(req, res);
  else serveStatic(req, res);
});

server.listen(PORT, () => {
  const v = parseVersion();
  const banner = [
    "",
    `  APEX Observatory v${v}  →  http://localhost:${PORT}`,
    "",
    "  Endpoints:",
    "    /api/overview      Full framework health scan",
    "    /api/agents        Agent roster with validation",
    "    /api/skills        Skill directory with validation",
    "    /api/hooks         Hook scripts with settings wiring",
    "    /api/workflow      Workflow chain skill existence",
    "    /api/crossref      Agent cross-reference matrix",
    "    /api/activity      Agent teams and task activity",
    "    /api/test?suite=   Run a test suite (framework|hooks|integration)",
    "    /api/test/all      Run all test suites",
    "",
  ].join("\n");
  process.stdout.write(banner + "\n");
});
