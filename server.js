// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
import cors from "cors";
app.use(cors());

// Minimal sanitizer to ensure shape; clamp tiny issues
function sanitizeGate(gate, { expectedAge, idPrefix }) {
  if (!gate || typeof gate !== "object") gate = {};
  gate.id = typeof gate.id === "string" ? gate.id : `${idPrefix}_${expectedAge}`;
  gate.age = expectedAge;
  let opts = Array.isArray(gate.laneOptions) ? gate.laneOptions.slice(0,3) : [];
  while (opts.length < 3) opts.push({ id:"noop", label:"Wait", icon:"⏳", outcomes:[{ id:"tick", text:"Time passes", probability:1 }] });
  gate.laneOptions = opts.map((o,i)=>({
    id: typeof o.id === "string" ? o.id : `opt_${i}`,
    label: typeof o.label === "string" ? o.label.slice(0,22) : "Option",
    icon: typeof o.icon === "string" ? o.icon : undefined,
    prereqs: Array.isArray(o.prereqs) ? o.prereqs : undefined,
    effects: clampEffects(o.effects),
    outcomes: normalizeOutcomes(o.outcomes)
  }));
  return gate;
}
function clampEffects(eff){
  if (!eff || typeof eff !== "object") return undefined;
  const out = {};
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  for (const k of ["health","happiness","knowledge","relationships","wealth"]) {
    if (Number.isFinite(eff[k])) out[k] = clamp(eff[k], -3, 3);
  }
  if (typeof eff.setFlag === "string") out.setFlag = eff.setFlag;
  if (typeof eff.setTrue === "boolean") out.setTrue = eff.setTrue;
  return Object.keys(out).length ? out : undefined;
}
function normalizeOutcomes(arr){
  let a = Array.isArray(arr) && arr.length ? arr : [{ id:"neutral", text:"", probability:1 }];
  a = a.map(o=>({ id: typeof o.id==="string"?o.id:"out", text: typeof o.text==="string"?o.text:"", probability: Number.isFinite(o.probability)? Math.max(0,Math.min(1,o.probability)):0, effects: clampEffects(o.effects), fatal: !!o.fatal }));
  const total = a.reduce((s,o)=>s+o.probability,0) || 1;
  a = a.map(o=>({ ...o, probability: o.probability/total }));
  return a;
}

function slugify(s){
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 32) || "opt";
}

function toOutcomeFromEffects(effects) {
  return [{ id: "out", text: "", probability: 1, effects }];
}

function normalizeGateShape(gate){
  // If the model returned { gate: { options:[...] }, age, stage } map to laneOptions
  if (gate && gate.gate && Array.isArray(gate.gate.options)) {
    const opts = gate.gate.options.map((o, i) => {
      const label = o.label || o.title || `Option ${i+1}`;
      const id = slugify(o.id || label);
      const icon = typeof o.icon === "string" ? o.icon : undefined;
      // unify effects field name
      const eff = (o.effects || o.effect);
      // outcomes: use provided, else synthesize from effects
      let outcomes = Array.isArray(o.outcomes) && o.outcomes.length ? o.outcomes : toOutcomeFromEffects(eff);
      // Handle fatal fields found at option level (e.g., fatal_chance)
      if (!Array.isArray(o.outcomes) && Number.isFinite(o.fatal_chance) && o.fatal_chance > 0) {
        outcomes = [
          { id: "ok", text: "", probability: Math.max(0, 1 - o.fatal_chance), effects: eff },
          { id: "fatal", text: o.fatal_description || "", probability: Math.min(1, o.fatal_chance), fatal: true }
        ];
      }
      return { id, label, icon, effects: eff, outcomes };
    });
    return { id: gate.id, stage: gate.stage, age: gate.age, laneOptions: opts };
  }
  return gate;
}

// Build prompt
function buildPrompt(rawPlayer) {
  const age = Number.isFinite(rawPlayer?.age) ? rawPlayer.age : 0;
  const stats = (rawPlayer && typeof rawPlayer.stats === "object") ? rawPlayer.stats : {};
  const flags = (rawPlayer && typeof rawPlayer.flags === "object") ? rawPlayer.flags : {};
  const history = Array.isArray(rawPlayer?.history) ? rawPlayer.history.slice(-5) : [];

  const rules = [
    "Return ONLY strict JSON matching the schema.",
    "Exactly 3 options.",
    "Write each label as a short sentence (6–12 words) and end it with one emoji.",
    "NO generic nouns like 'Dog', 'Apple', 'Car'.",
    "Options must be mutually distinct and relevant to the current age.",
    "Use prereqs when unlocking special paths based on stats/flags/history.",
    "3 outcomes per option; probabilities ~sum to 1; small deltas [-3..+3].",
    "Fatal outcomes are rare, plausible, non-graphic (<=2%, <=4% if age≥70).",
    "Reflect player flags and recent history to keep the story sequential."
  ].join("\n- ");

  return [
    {
      role: "system",
      content: [
        "You are a content generator for a three-lane endless runner about life choices.",
        "Use only AGE to decide relevant life events; do not reference stages.",
        "Output must be strict JSON for a single gate: { id, age, laneOptions:[{ id, label, icon?, prereqs?, effects?, outcomes:[{ id, text, probability, effects?, fatal? }] }] }"
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `Player snapshot:`,
        JSON.stringify({ age, stats, flags, recent_history: history }),
        "\nTASK:",
        `Generate the next gate for age ${age + 1}.`,
        "Focus on realistic, age-appropriate decisions that follow from history.",
        "\nRules:\n- " + rules
      ].join("\n")
    }
  ];
}

app.post("/api/generate", async (req, res) => {
  const player = req.body;

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // or gpt-4o-mini
        messages: buildPrompt(player),
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    const data = await resp.json();
    let raw = data?.choices?.[0]?.message?.content;

    // Extract JSON from message.content (string or object)
    let gate;
    if (typeof raw === "string") {
      try { gate = JSON.parse(raw); }
      catch (e) {
        console.error("Bad AI content (string):", raw);
        return res.status(500).json({ error: "Invalid AI JSON string" });
      }
    } else if (raw && typeof raw === "object") {
      gate = raw;
    } else {
      console.error("Missing AI content:", data);
      return res.status(500).json({ error: "AI returned no content" });
    }

    // Transform alternative shapes to our schema
    gate = normalizeGateShape(gate);

    gate = sanitizeGate(gate, { expectedAge: player.age + 1, idPrefix: "ai" });
    return res.json(gate);
  } catch (e) {
    console.error("AI error:", e);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.post('/api/generate-batch', async (req, res) => {
  const { player, startAge, count } = req.body || {};
  const n = Math.max(1, Math.min(10, Number(count) || 5)); // cap to 10 per call
  const firstAge = Number.isFinite(startAge) ? startAge : (player?.age ?? 0) + 1;

  const results = [];
  try {
    for (let i = 0; i < n; i++) {
      const ageForThis = firstAge + i;
      // Build a temporary snapshot with age-1 so the prompt targets age
      const snap = { ...player, age: ageForThis - 1 };
      const messages = buildPrompt(snap);
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });
      const data = await resp.json();
      let raw = data?.choices?.[0]?.message?.content;
      let gate = (typeof raw === 'string') ? JSON.parse(raw) : raw;
      gate = normalizeGateShape(gate);
      gate = sanitizeGate(gate, { expectedAge: ageForThis, idPrefix: 'ai' });
      gate.source = 'ai';
      results.push(gate);
    }
    return res.json(results);
  } catch (e) {
    console.error('AI batch error:', e);
    return res.status(500).json({ error: 'AI batch generation failed' });
  }
});

app.get("/", (_req, res) => {
  res.type("text").send("AI backend is running. POST /api/generate to get a gate.");
});

app.listen(3000, () =>
  console.log("AI backend running at http://localhost:3000")
);
