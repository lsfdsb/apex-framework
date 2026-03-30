// APEX Framework — Embedding Edge Function
// Uses Supabase built-in gte-small model (384 dimensions)
// Zero external API keys needed
//
// Deploy:
//   supabase functions deploy apex-embed --no-verify-jwt
//
// Usage:
//   POST /functions/v1/apex-embed
//   Body: { "input": "text to embed" }
//   Returns: { "embedding": [0.123, ...], "dimensions": 384 }
//
//   POST /functions/v1/apex-embed
//   Body: { "input": ["text 1", "text 2", ...] }
//   Returns: { "embeddings": [[...], [...]], "dimensions": 384 }
//
// by Bueno & Claude · São Paulo, 2026

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const model = new Supabase.ai.Session('gte-small');

interface SingleRequest {
  input: string;
}

interface BatchRequest {
  input: string[];
}

type EmbedRequest = SingleRequest | BatchRequest;

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Health check
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        status: 'ok',
        model: 'gte-small',
        dimensions: 384,
        max_tokens: 512,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: EmbedRequest = await req.json();

    if (!body.input) {
      return new Response(JSON.stringify({ error: "Missing 'input' field" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Batch mode: array of strings
    if (Array.isArray(body.input)) {
      const embeddings: number[][] = [];
      for (const text of body.input) {
        const result = await model.run(text, {
          mean_pool: true,
          normalize: true,
        });
        embeddings.push(Array.from(result as Float32Array));
      }

      return new Response(
        JSON.stringify({
          embeddings,
          dimensions: 384,
          count: embeddings.length,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Single mode: one string
    const result = await model.run(body.input, {
      mean_pool: true,
      normalize: true,
    });

    return new Response(
      JSON.stringify({
        embedding: Array.from(result as Float32Array),
        dimensions: 384,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Embedding generation failed',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
