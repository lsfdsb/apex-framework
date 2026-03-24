/**
 * APEX Gates — Supabase Edge Function
 *
 * Handles structured approval requests for the three APEX pipeline gates:
 *   PRD approval, Architecture approval, Ship (merge) approval.
 *
 * Deploy:
 *   supabase functions deploy apex-gates --no-verify-jwt
 *
 * Invoke (from Claude or any HTTP client):
 *   POST https://<project>.supabase.co/functions/v1/apex-gates
 *   { "gate": "prd", "summary": "..." }
 *
 * The function returns a JSON decision object that Claude reads to decide
 * whether to proceed, reject, or request changes at each gate.
 *
 * NOTE: This function does NOT use MCP Elicitation — it is a simple REST
 * endpoint. For full MCP Elicitation support see docs/mcp-elicitation-gates.md.
 * This function demonstrates the Supabase Edge Function pattern for APEX.
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// ── Types ─────────────────────────────────────────────────────────────────────

type GateType = "prd" | "architecture" | "ship";

type PrdDecision = "approve" | "reject" | "request_changes";
type ArchDecision = "approve" | "reject";
type ShipDecision = "approve" | "reject";
type MergeStrategy = "squash" | "rebase" | "merge_commit";

interface GateRequest {
  gate: GateType;
  summary: string;
  session_id?: string;
}

interface PrdResponse {
  gate: "prd";
  decision: PrdDecision;
  notes?: string;
}

interface ArchResponse {
  gate: "architecture";
  decision: ArchDecision;
  dependency_check_passed: boolean;
  notes?: string;
}

interface ShipResponse {
  gate: "ship";
  decision: ShipDecision;
  merge_strategy: MergeStrategy;
}

type GateResponse = PrdResponse | ArchResponse | ShipResponse;

interface ErrorResponse {
  error: string;
  details?: string;
}

// ── Schema validation ─────────────────────────────────────────────────────────

function validateRequest(body: unknown): GateRequest {
  if (typeof body !== "object" || body === null) {
    throw new Error("Request body must be a JSON object.");
  }

  const obj = body as Record<string, unknown>;

  if (!["prd", "architecture", "ship"].includes(obj.gate as string)) {
    throw new Error(`Invalid gate: "${obj.gate}". Must be prd, architecture, or ship.`);
  }

  if (typeof obj.summary !== "string" || obj.summary.trim().length === 0) {
    throw new Error("summary is required and must be a non-empty string.");
  }

  return {
    gate: obj.gate as GateType,
    summary: (obj.summary as string).trim(),
    session_id: typeof obj.session_id === "string" ? obj.session_id : undefined,
  };
}

// ── Gate handlers ─────────────────────────────────────────────────────────────
//
// In a production deployment these handlers would surface the gate via MCP
// Elicitation (see docs/mcp-elicitation-gates.md) so the user sees a native
// Claude Code form. For now they implement an auto-approve pattern that logs
// the gate event to session_learnings — useful for audit trails and demos.

async function handlePrdGate(
  req: GateRequest,
  supabase: ReturnType<typeof createClient>
): Promise<PrdResponse> {
  await logGateEvent(supabase, req, "prd_gate_reached");

  // Auto-approve with a log entry. Replace with real decision logic or
  // MCP Elicitation when deploying to a multi-team environment.
  const response: PrdResponse = {
    gate: "prd",
    decision: "approve",
    notes: "Auto-approved by apex-gates edge function. Replace with MCP Elicitation for human review.",
  };

  await logGateEvent(supabase, req, "prd_gate_approved");
  return response;
}

async function handleArchGate(
  req: GateRequest,
  supabase: ReturnType<typeof createClient>
): Promise<ArchResponse> {
  await logGateEvent(supabase, req, "arch_gate_reached");

  const response: ArchResponse = {
    gate: "architecture",
    decision: "approve",
    dependency_check_passed: true,
    notes: "Auto-approved by apex-gates edge function.",
  };

  await logGateEvent(supabase, req, "arch_gate_approved");
  return response;
}

async function handleShipGate(
  req: GateRequest,
  supabase: ReturnType<typeof createClient>
): Promise<ShipResponse> {
  await logGateEvent(supabase, req, "ship_gate_reached");

  const response: ShipResponse = {
    gate: "ship",
    decision: "approve",
    merge_strategy: "squash",
  };

  await logGateEvent(supabase, req, "ship_gate_approved");
  return response;
}

// ── Audit logging ─────────────────────────────────────────────────────────────

async function logGateEvent(
  supabase: ReturnType<typeof createClient>,
  req: GateRequest,
  eventType: string
): Promise<void> {
  const { error } = await supabase.from("session_learnings").insert({
    session_id: req.session_id ?? "apex-gates-edge-fn",
    learning_type: "pattern",
    content: `[${eventType}] gate=${req.gate} summary_length=${req.summary.length}`,
  });

  // Log errors but do not fail the gate — audit is best-effort.
  if (error) {
    console.error(`Failed to log gate event '${eventType}':`, error.message);
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (request: Request): Promise<Response> => {
  // Health check
  if (request.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", service: "apex-gates", version: "1.0.0" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." } satisfies ErrorResponse),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  // Parse request body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body." } satisfies ErrorResponse),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate
  let gateRequest: GateRequest;
  try {
    gateRequest = validateRequest(rawBody);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message } satisfies ErrorResponse),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  // Supabase client — uses the service role key available in Edge Function env
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Dispatch to gate handler
  let response: GateResponse;
  try {
    switch (gateRequest.gate) {
      case "prd":
        response = await handlePrdGate(gateRequest, supabase);
        break;
      case "architecture":
        response = await handleArchGate(gateRequest, supabase);
        break;
      case "ship":
        response = await handleShipGate(gateRequest, supabase);
        break;
    }
  } catch (err) {
    console.error("Gate handler error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error processing gate.", details: (err as Error).message } satisfies ErrorResponse),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(response),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
