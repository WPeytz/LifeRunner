// src/ai.js — runtime AI decision generator (age-only) with strict validation

import { sanitizeGate } from "./gateUtils.js";

export const AI_MODE = {
  OFF: "off",        // authored-only
  HYBRID: "hybrid",  // prefer authored; fall back to AI
  ON: "on"           // AI-only
};

const ERROR_SNIPPET = 160;

// Client sends the player snapshot to the backend. The server builds the prompt.
export async function generateGate(player, { endpoint, apiKey, seed }) {
  if (!endpoint || typeof endpoint !== "string") {
    throw new Error("AI endpoint is not configured");
  }

  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify(player)
    });
  } catch (err) {
    throw new Error("AI request failed: network error");
  }

  let gate;
  if (!res.ok) {
    const text = await res.text();
    const snippet = text.length > ERROR_SNIPPET ? `${text.slice(0, ERROR_SNIPPET)}...` : text;
    throw new Error(`AI request failed (${res.status}): ${snippet || res.statusText}`);
  } else {
    try {
      gate = await res.json();
    } catch (e) {
      throw new Error("AI did not return JSON");
    }
  }

  try {
    return sanitizeAIResponse(gate, player);
  } catch (err) {
    throw new Error(`AI returned an invalid gate: ${err.message}`);
  }
}

// ----------------- Validation & Sanitization -----------------

export function sanitizeAIResponse(gate, player){
  // Ensure age-only gate is normalized for the next age
  return sanitizeGate(gate, { expectedAge: player.age + 1, idPrefix: "ai" });
}

// Add this near the bottom of src/ai.js (after generateGate / sanitizeAIResponse)

export async function generateGatesBatch(player, { endpoint, apiKey, startAge, count }) {
  // point to /api/generate-batch (server route we added)
  const batchEndpoint = endpoint.replace(/\/api\/generate$/, "/api/generate-batch");

  let res;
  try {
    res = await fetch(batchEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        player,
        startAge: Number.isFinite(startAge) ? startAge : (player?.age ?? 0) + 1,
        count: Number.isFinite(count) ? count : 6
      })
    });
  } catch {
    throw new Error("AI batch request failed: network error");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI batch endpoint ${res.status}: ${text || res.statusText}`);
  }

  const arr = await res.json();
  if (!Array.isArray(arr)) throw new Error("Batch did not return an array");

  // (Server already sanitizes; this is safe if you want to double-sanitize)
  try {
    return arr.map(g => sanitizeGate(g, { expectedAge: g.age, idPrefix: "ai" }));
  } catch {
    return arr; // fall back to server-sanitized gates
  }
}
