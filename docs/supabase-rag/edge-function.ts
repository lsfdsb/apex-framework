/**
 * APEX Gates — Supabase Edge Function (Production Reference)
 *
 * Handles structured approval requests for the three APEX pipeline gates:
 *   PRD approval, Architecture approval, Ship (merge) approval.
 *
 * This file is a REFERENCE IMPLEMENTATION demonstrating:
 *   - Modern Deno.serve() entrypoint (Supabase Edge Functions standard)
 *   - CORS preflight handling for browser clients
 *   - Bearer token authentication via SUPABASE_SECRET_KEY
 *   - Input validation with structured 400 error responses
 *   - Try/catch error handling — no unhandled rejections
 *   - In-memory IP rate limiting (see note — use Upstash Redis in production)
 *   - Structured JSON logging with request_id, timestamp, gate_type, decision
 *   - Health check endpoint (GET /)
 *   - Full TypeScript types for all request/response shapes
 *   - Supabase client instantiation from within an edge function
 *
 * ── Deploy ────────────────────────────────────────────────────────────────────
 *
 *   supabase functions deploy apex-gates --no-verify-jwt
 *
 * ── Environment variables ────────────────────────────────────────────────────
 *
 *   SUPABASE_URL              Injected automatically by Supabase platform
 *   SUPABASE_SERVICE_ROLE_KEY Injected automatically by Supabase platform
 *   APEX_SECRET_KEY           Required: shared secret callers must supply as
 *                             "Authorization: Bearer <APEX_SECRET_KEY>"
 *                             Generate with: openssl rand -base64 32
 *
 * ── Invoke ───────────────────────────────────────────────────────────────────
 *
 *   POST https://<project>.supabase.co/functions/v1/apex-gates
 *   Authorization: Bearer <APEX_SECRET_KEY>
 *   Content-Type: application/json
 *
 *   { "gate": "prd", "summary": "Build a contact CRM", "session_id": "abc123" }
 *
 * ── Rate limiting note ────────────────────────────────────────────────────────
 *
 *   The in-memory rate limiter below works for development and low-traffic
 *   deployments. Edge Functions are ephemeral and may run on multiple isolates,
 *   so the in-memory Map does NOT share state across instances. For production
 *   multi-region rate limiting, replace with Upstash Redis:
 *     https://supabase.com/docs/guides/functions/examples/rate-limiting
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// ── CORS headers ──────────────────────────────────────────────────────────────
//
// For @supabase/supabase-js v2.95.0+ you can import these from the SDK:
//   import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors"
//
// We define them explicitly here so the file is self-contained and readable
// as a reference implementation.

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// ── Constants ─────────────────────────────────────────────────────────────────

const FUNCTION_VERSION = "2.0.0";
const GATE_TYPES = ["prd", "architecture", "ship"] as const;

/** Requests per window per IP (in-memory only — see rate limiting note above). */
const RATE_LIMIT_MAX = 20;
/** Sliding window duration in milliseconds. */
const RATE_LIMIT_WINDOW_MS = 60_000;

// ── Types ─────────────────────────────────────────────────────────────────────

type GateType = (typeof GATE_TYPES)[number];

type PrdDecision = "approve" | "reject" | "request_changes";
type ArchDecision = "approve" | "reject";
type ShipDecision = "approve" | "reject";
type MergeStrategy = "squash" | "rebase" | "merge_commit";

/** Inbound request body. */
interface GateRequest {
  /** Which APEX pipeline gate to evaluate. */
  gate: GateType;
  /** Human-readable summary of the artifact being approved. */
  summary: string;
  /**
   * Caller-supplied session identifier — e.g. a git commit hash, ISO date, or
   * UUID. Used to correlate gate events in session_learnings.
   */
  session_id?: string;
}

/** Outbound response body for the PRD gate. */
interface PrdResponse {
  gate: "prd";
  decision: PrdDecision;
  notes?: string;
}

/** Outbound response body for the Architecture gate. */
interface ArchResponse {
  gate: "architecture";
  decision: ArchDecision;
  dependency_check_passed: boolean;
  notes?: string;
}

/** Outbound response body for the Ship gate. */
interface ShipResponse {
  gate: "ship";
  decision: ShipDecision;
  merge_strategy: MergeStrategy;
}

type GateResponse = PrdResponse | ArchResponse | ShipResponse;

/** Standard error envelope returned on all non-2xx responses. */
interface ErrorResponse {
  error: string;
  request_id: string;
  details?: string;
}

/** Structured log entry written to stdout (captured by Supabase log drains). */
interface LogEntry {
  timestamp: string;
  request_id: string;
  level: "info" | "warn" | "error";
  gate_type?: GateType;
  decision?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

// ── In-memory rate limiter ─────────────────────────────────────────────────────
//
// Tracks request timestamps per IP using a sliding window algorithm.
// NOTE: This state is NOT shared across isolate instances in production.
//       Replace with Upstash Redis for multi-region deployments.

const rateLimitMap = new Map<string, number[]>();

/**
 * Returns true when the caller should be rate-limited.
 *
 * Uses a sliding window: only timestamps within the last RATE_LIMIT_WINDOW_MS
 * are counted. Expired timestamps are pruned on each check.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitMap.get(ip) ?? []).filter((t) => t > windowStart);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

// ── Structured logging ─────────────────────────────────────────────────────────

/**
 * Writes a structured JSON log line to stdout.
 * Supabase captures stdout from edge functions and routes it to the
 * Supabase Dashboard → Edge Functions → Logs view.
 */
function log(entry: Omit<LogEntry, "timestamp">): void {
  const line: LogEntry = { timestamp: new Date().toISOString(), ...entry };
  console.log(JSON.stringify(line)); // eslint-disable-line no-console -- Edge Function stdout: Supabase captures this as structured logs
}

// ── Request helpers ────────────────────────────────────────────────────────────

/** Generates a short random request ID for log correlation. */
function generateRequestId(): string {
  return crypto.randomUUID().split("-")[0];
}

/**
 * Builds a JSON Response with CORS headers and the given status.
 * All responses — including errors — go through this function to guarantee
 * that CORS headers are always present.
 */
function jsonResponse(
  body: GateResponse | ErrorResponse | Record<string, unknown>,
  status: number
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

/**
 * Builds an error response, logs the event, and returns the Response.
 *
 * @param requestId - Correlation ID from the current request.
 * @param status    - HTTP status code (400, 401, 429, 500, …).
 * @param message   - User-facing error message (no stack traces).
 * @param details   - Optional internal details for debugging.
 */
function errorResponse(
  requestId: string,
  status: number,
  message: string,
  details?: string
): Response {
  log({ level: "warn", request_id: requestId, message, metadata: { status, details } });
  const body: ErrorResponse = { error: message, request_id: requestId, ...(details ? { details } : {}) };
  return jsonResponse(body, status);
}

// ── Authentication ─────────────────────────────────────────────────────────────

/**
 * Verifies the Authorization header against APEX_SECRET_KEY.
 *
 * Callers must send:  Authorization: Bearer <APEX_SECRET_KEY>
 *
 * APEX_SECRET_KEY is a shared secret stored as a Supabase Function Secret
 * (Dashboard → Edge Functions → Manage secrets) or in supabase/functions/.env.
 * Generate one with:  openssl rand -base64 32
 *
 * Returns true if the header is valid, false otherwise.
 */
function isAuthorized(request: Request): boolean {
  const apexSecret = Deno.env.get("APEX_SECRET_KEY");
  if (!apexSecret) {
    // No secret configured — treat as open (useful for local dev).
    // Log a warning so operators know to configure the secret in production.
    log({
      level: "warn",
      request_id: "startup",
      message: "APEX_SECRET_KEY is not set. Requests are unauthenticated. Set this secret before production deployment.",
    });
    return true;
  }

  const authHeader = request.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  // Use constant-time comparison to prevent timing attacks.
  const tokenBytes = new TextEncoder().encode(token);
  const secretBytes = new TextEncoder().encode(apexSecret);
  if (tokenBytes.length !== secretBytes.length) return false;

  let mismatch = 0;
  for (let i = 0; i < tokenBytes.length; i++) {
    mismatch |= tokenBytes[i] ^ secretBytes[i];
  }
  return mismatch === 0;
}

// ── Input validation ───────────────────────────────────────────────────────────

/**
 * Validates and coerces an unknown JSON body into a GateRequest.
 * Throws a TypeError with a user-facing message on any validation failure.
 */
function validateRequest(body: unknown): GateRequest {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new TypeError("Request body must be a JSON object.");
  }

  const obj = body as Record<string, unknown>;

  if (!GATE_TYPES.includes(obj.gate as GateType)) {
    const valid = GATE_TYPES.join(", ");
    throw new TypeError(`Invalid gate: "${obj.gate}". Must be one of: ${valid}.`);
  }

  if (typeof obj.summary !== "string" || obj.summary.trim().length === 0) {
    throw new TypeError("summary is required and must be a non-empty string.");
  }

  if (obj.summary.length > 10_000) {
    throw new TypeError("summary must not exceed 10,000 characters.");
  }

  if (obj.session_id !== undefined && typeof obj.session_id !== "string") {
    throw new TypeError("session_id must be a string when provided.");
  }

  return {
    gate: obj.gate as GateType,
    summary: (obj.summary as string).trim(),
    session_id: typeof obj.session_id === "string" ? obj.session_id.slice(0, 128) : undefined,
  };
}

// ── Audit logging ─────────────────────────────────────────────────────────────

/**
 * Writes a gate event to session_learnings for audit and RAG purposes.
 * This is a best-effort write — it never causes a gate to fail.
 */
async function logGateEvent(
  supabase: ReturnType<typeof createClient>,
  req: GateRequest,
  requestId: string,
  eventType: string,
  decision?: string
): Promise<void> {
  const content = JSON.stringify({
    event: eventType,
    gate: req.gate,
    decision,
    request_id: requestId,
    summary_length: req.summary.length,
  });

  const { error } = await supabase.from("session_learnings").insert({
    session_id: req.session_id ?? `apex-gates-${new Date().toISOString().slice(0, 10)}`,
    learning_type: "pattern",
    content,
  });

  if (error) {
    log({
      level: "warn",
      request_id: requestId,
      message: `Audit log write failed for event '${eventType}'`,
      metadata: { db_error: error.message },
    });
  }
}

// ── Gate handlers ─────────────────────────────────────────────────────────────
//
// Default implementation: auto-approve with audit logging.
//
// Replace the decision logic in each handler to implement real approval flows.
// For human-in-the-loop approval with a native Claude Code form, see the MCP
// Elicitation pattern in docs/mcp-elicitation-gates.md.

/**
 * Handles the PRD gate.
 * Validates that a Product Requirements Document is present and coherent.
 */
async function handlePrdGate(
  req: GateRequest,
  requestId: string,
  supabase: ReturnType<typeof createClient>
): Promise<PrdResponse> {
  await logGateEvent(supabase, req, requestId, "prd_gate_reached");

  const response: PrdResponse = {
    gate: "prd",
    decision: "approve",
    notes: "Auto-approved. Replace this handler with MCP Elicitation for human review.",
  };

  await logGateEvent(supabase, req, requestId, "prd_gate_decided", response.decision);
  return response;
}

/**
 * Handles the Architecture gate.
 * Validates that a system design and dependency graph are present.
 */
async function handleArchGate(
  req: GateRequest,
  requestId: string,
  supabase: ReturnType<typeof createClient>
): Promise<ArchResponse> {
  await logGateEvent(supabase, req, requestId, "arch_gate_reached");

  const response: ArchResponse = {
    gate: "architecture",
    decision: "approve",
    dependency_check_passed: true,
    notes: "Auto-approved. Wire the dependency_check_passed flag to manifest-generate.sh output.",
  };

  await logGateEvent(supabase, req, requestId, "arch_gate_decided", response.decision);
  return response;
}

/**
 * Handles the Ship gate.
 * Validates that all QA, security, and CX checks have passed.
 */
async function handleShipGate(
  req: GateRequest,
  requestId: string,
  supabase: ReturnType<typeof createClient>
): Promise<ShipResponse> {
  await logGateEvent(supabase, req, requestId, "ship_gate_reached");

  const response: ShipResponse = {
    gate: "ship",
    decision: "approve",
    merge_strategy: "squash",
  };

  await logGateEvent(supabase, req, requestId, "ship_gate_decided", response.decision);
  return response;
}

// ── Supabase client factory ────────────────────────────────────────────────────

/**
 * Creates a Supabase client authenticated as the service role.
 *
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by
 * the Supabase Edge Functions runtime — no manual configuration needed.
 *
 * The service role bypasses RLS and has full write access. Never expose this
 * client or its key to the browser.
 */
function createServiceClient(): ReturnType<typeof createClient> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. " +
      "These are injected automatically when deployed to Supabase. " +
      "For local development, add them to supabase/functions/.env."
    );
  }

  return createClient(url, key);
}

// ── Main handler ──────────────────────────────────────────────────────────────

/**
 * Supabase Edge Function entrypoint.
 *
 * Route map:
 *   OPTIONS *    CORS preflight — must be handled before auth
 *   GET /        Health check — returns version and gate list
 *   POST /       Gate evaluation — authenticated, rate-limited, validated
 */
Deno.serve(async (request: Request): Promise<Response> => {
  const requestId = generateRequestId();

  // ── CORS preflight ─────────────────────────────────────────────────────────
  //
  // OPTIONS requests from browsers arrive before the actual POST.
  // They must be handled immediately — before auth or any other logic —
  // or the browser will block the subsequent request.
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // ── Health check ───────────────────────────────────────────────────────────
  //
  // Unauthenticated GET / returns minimal version info.
  // Useful for uptime monitors and deployment verification.
  if (request.method === "GET") {
    log({ level: "info", request_id: requestId, message: "health_check" });
    return jsonResponse(
      { status: "ok", version: FUNCTION_VERSION, gates: [...GATE_TYPES] },
      200
    );
  }

  // ── Method guard ───────────────────────────────────────────────────────────
  if (request.method !== "POST") {
    return errorResponse(requestId, 405, "Method not allowed. Use POST.");
  }

  // ── Authentication ─────────────────────────────────────────────────────────
  //
  // All POST requests must include: Authorization: Bearer <APEX_SECRET_KEY>
  if (!isAuthorized(request)) {
    return errorResponse(requestId, 401, "Unauthorized. Provide a valid Bearer token.");
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  //
  // Identify callers by IP. The x-forwarded-for header is set by the Supabase
  // CDN. Fall back to a fixed key when running locally (no header present).
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";

  if (isRateLimited(clientIp)) {
    log({
      level: "warn",
      request_id: requestId,
      message: "rate_limit_exceeded",
      metadata: { ip: clientIp },
    });
    return errorResponse(
      requestId,
      429,
      `Rate limit exceeded. Max ${RATE_LIMIT_MAX} requests per minute.`
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(requestId, 400, "Invalid JSON body. Content-Type must be application/json.");
  }

  // ── Validate ───────────────────────────────────────────────────────────────
  let gateRequest: GateRequest;
  try {
    gateRequest = validateRequest(rawBody);
  } catch (err) {
    return errorResponse(requestId, 400, (err as TypeError).message);
  }

  log({
    level: "info",
    request_id: requestId,
    gate_type: gateRequest.gate,
    message: "gate_request_received",
    metadata: {
      summary_length: gateRequest.summary.length,
      has_session_id: Boolean(gateRequest.session_id),
    },
  });

  // ── Supabase client ────────────────────────────────────────────────────────
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createServiceClient();
  } catch (err) {
    return errorResponse(requestId, 500, "Service unavailable.", (err as Error).message);
  }

  // ── Dispatch ───────────────────────────────────────────────────────────────
  let response: GateResponse | undefined;
  try {
    switch (gateRequest.gate) {
      case "prd":
        response = await handlePrdGate(gateRequest, requestId, supabase);
        break;
      case "architecture":
        response = await handleArchGate(gateRequest, requestId, supabase);
        break;
      case "ship":
        response = await handleShipGate(gateRequest, requestId, supabase);
        break;
      default: {
        // TypeScript exhaustiveness guard — unreachable at runtime because
        // validateRequest() already rejects unknown gate values.
        const unreachable: never = gateRequest.gate;
        throw new Error(`Unhandled gate type: ${unreachable}`);
      }
    }
  } catch (err) {
    log({
      level: "error",
      request_id: requestId,
      gate_type: gateRequest.gate,
      message: "gate_handler_error",
      metadata: { error: (err as Error).message },
    });
    return errorResponse(requestId, 500, "Internal error processing gate.", (err as Error).message);
  }

  const decision = (response as Record<string, unknown> | undefined)?.decision as string | undefined;
  log({
    level: "info",
    request_id: requestId,
    gate_type: gateRequest.gate,
    decision,
    message: "gate_request_complete",
  });

  return jsonResponse(response!, 200);
});
