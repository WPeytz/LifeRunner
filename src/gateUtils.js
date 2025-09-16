// src/gateUtils.js — shared helpers for gate validation and fallbacks

export const STAT_KEYS = ["health","happiness","knowledge","relationships","wealth"];
export const LABEL_MAX_CHARS = 22;
export const MAX_DELTA = 3;
export const MAX_FATAL_PROB = 0.02;
export const MAX_FATAL_PROB_ELDERLY = 0.04;

export function ageToStage(age){
  if (age <= 12) return "Childhood";
  if (age <= 17) return "Teen";
  if (age <= 24) return "YoungAdult";
  if (age <= 64) return "Adult";
  return "OldAge";
}

export function clamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

export function clampEffects(eff){
  if (!eff || typeof eff !== "object") return undefined;
  const out = {};
  for (const key of STAT_KEYS) {
    if (Number.isFinite(eff[key])) out[key] = clamp(eff[key], -MAX_DELTA, MAX_DELTA);
  }
  if (typeof eff.setFlag === "string") out.setFlag = eff.setFlag;
  if (typeof eff.setTrue === "boolean") out.setTrue = eff.setTrue;
  return Object.keys(out).length ? out : undefined;
}

function validPrereq(pr){
  if (!pr || typeof pr !== "object") return false;
  if ("flag" in pr) return typeof pr.flag === "string" && typeof pr.value === "boolean";
  if ("stat" in pr) return STAT_KEYS.includes(pr.stat) && [">=","<=",">","<","=="].includes(pr.op) && Number.isFinite(pr.value);
  return false;
}

function normalizeProbabilities(outcomes){
  const total = outcomes.reduce((sum, o) => sum + (Number.isFinite(o.probability) ? o.probability : 0), 0);
  if (total <= 0) {
    const share = 1 / outcomes.length;
    return outcomes.map(o => ({ ...o, probability: share }));
  }
  return outcomes.map(o => ({ ...o, probability: o.probability / total }));
}

function sanitizeOutcome(outcome, idx, age){
  const id = typeof outcome?.id === "string" && outcome.id.trim() ? outcome.id.trim() : `out_${idx}`;
  const text = typeof outcome?.text === "string" ? outcome.text.trim() : "";
  let probability = Number.isFinite(outcome?.probability) ? clamp(outcome.probability, 0, 1) : 0;
  const effects = clampEffects(outcome?.effects);
  let fatal = !!outcome?.fatal;
  const maxFatal = age >= 70 ? MAX_FATAL_PROB_ELDERLY : MAX_FATAL_PROB;
  if (fatal && probability > maxFatal) probability = maxFatal;
  return { id, text, probability, effects, fatal };
}

function ensureSingleFatal(outcomes){
  const fatals = outcomes.filter(o => o.fatal);
  if (fatals.length <= 1) return outcomes;
  fatals.sort((a, b) => b.probability - a.probability);
  const keep = fatals[0];
  for (const o of fatals.slice(1)) o.fatal = false;
  const normalized = normalizeProbabilities(outcomes);
  // preserve keep's higher probability if others were zeroed out
  return normalized.map(o => o.id === keep.id ? { ...o, fatal: true } : o);
}

function dummyOption(stage){
  const label = stage === "OldAge" ? "Reflect" : "Consider";
  return {
    id: "noop",
    label,
    icon: "⏳",
    outcomes: [{ id:"tick", text:"Time passes", probability:1 }]
  };
}

function sanitizeOption(option, idx, age, seen){
  const baseId = typeof option?.id === "string" && option.id.trim() ? option.id.trim() : `opt_${idx}`;
  let uniqueId = baseId;
  let suffix = 1;
  while (seen.has(uniqueId)) uniqueId = `${baseId}_${suffix++}`;
  seen.add(uniqueId);

  let label = typeof option?.label === "string" && option.label.trim() ? option.label.trim() : "Option";
  if (label.length > LABEL_MAX_CHARS) label = `${label.slice(0, LABEL_MAX_CHARS - 1)}…`;

  const icon = typeof option?.icon === "string" ? option.icon : undefined;
  const prereqs = Array.isArray(option?.prereqs) ? option.prereqs.filter(validPrereq) : undefined;
  const effects = clampEffects(option?.effects);

  let outcomes = Array.isArray(option?.outcomes) && option.outcomes.length ? option.outcomes : [{ id:"neutral", text:"", probability:1 }];
  outcomes = outcomes.map((o, j) => sanitizeOutcome(o, j, age));
  outcomes = normalizeProbabilities(outcomes);
  outcomes = ensureSingleFatal(outcomes);

  return { id: uniqueId, label, icon, prereqs, effects, outcomes };
}

export function sanitizeGate(gate, { expectedAge, idPrefix } = {}){
  if (!gate || typeof gate !== "object") throw new Error("Invalid gate object");
  if (Number.isFinite(expectedAge) && gate.age != null && gate.age !== expectedAge) {
    throw new Error("Gate age mismatch");
  }
  const age = Number.isFinite(expectedAge) ? expectedAge : gate.age;
  if (!Number.isFinite(age)) throw new Error("Gate missing age");
  const stage = ageToStage(age);
  const baseId = typeof gate.id === "string" && gate.id.trim() ? gate.id.trim() : `${idPrefix || "gate"}_${stage}_${age}`;

  let options = Array.isArray(gate.laneOptions) ? gate.laneOptions.slice(0, 3) : [];
  while (options.length < 3) options.push(dummyOption(stage));

  const seen = new Set();
  const laneOptions = options.map((opt, idx) => sanitizeOption(opt, idx, age, seen));

  return { ...gate, id: baseId, stage, age, laneOptions };
}

// --- Sample fallback generation ---

const SAMPLE_LIBRARY = {
  Childhood: [
    {
      id: "sample_child_storytime",
      label: "Storytime",
      icon: "📖",
      effects: { knowledge:+1, relationships:+1 }
    },
    {
      id: "sample_child_climb",
      label: "Climb",
      icon: "🧗",
      effects: { health:+1, happiness:+1 },
      outcomes: [
        { id:"small_scrape", text:"Scraped a knee (-1 💚)", probability:0.25, effects:{ health:-1 } },
        { id:"big_smiles", text:"Laughed with friends", probability:0.75 }
      ]
    },
    {
      id: "sample_child_build",
      label: "Build",
      icon: "🧱",
      effects: { knowledge:+1, happiness:+1 }
    },
    {
      id: "sample_child_music",
      label: "Music",
      icon: "🎶",
      effects: { happiness:+2 },
      outcomes: [
        { id:"stage_fright", text:"Stage nerves (-1 😀)", probability:0.3, effects:{ happiness:-1 } }
      ]
    },
    {
      id: "sample_child_garden",
      label: "Garden",
      icon: "🌱",
      effects: { health:+1, knowledge:+1 }
    }
  ],
  Teen: [
    {
      id: "sample_teen_studygroup",
      label: "Study Grp",
      icon: "📚",
      effects: { knowledge:+2, happiness:-1 }
    },
    {
      id: "sample_teen_band",
      label: "Garage Band",
      icon: "🎸",
      effects: { happiness:+1, relationships:+1 },
      outcomes: [
        { id:"late_rehearsal", text:"Late night practice (-1 💚)", probability:0.3, effects:{ health:-1 } }
      ]
    },
    {
      id: "sample_teen_volunteer",
      label: "Volunteer",
      icon: "🤝",
      effects: { relationships:+2 }
    },
    {
      id: "sample_teen_sport",
      label: "Varsity",
      icon: "🏀",
      effects: { health:+1, happiness:+1 }
    },
    {
      id: "sample_teen_job",
      label: "Shift",
      icon: "🧾",
      effects: { wealth:+1 },
      outcomes: [
        { id:"tough_shift", text:"Rough shift (-1 😀)", probability:0.35, effects:{ happiness:-1 } }
      ]
    }
  ],
  YoungAdult: [
    {
      id: "sample_ya_network",
      label: "Network",
      icon: "🤝",
      effects: { relationships:+1, wealth:+1 }
    },
    {
      id: "sample_ya_gradschool",
      label: "Grad Class",
      icon: "🎓",
      effects: { knowledge:+2, wealth:-1 }
    },
    {
      id: "sample_ya_roommate",
      label: "Roommates",
      icon: "🏘️",
      effects: { wealth:+1, happiness:+1 }
    },
    {
      id: "sample_ya_travel",
      label: "Road Trip",
      icon: "🚙",
      effects: { happiness:+2, wealth:-1 }
    },
    {
      id: "sample_ya_sidegig",
      label: "Side Gig",
      icon: "💡",
      effects: { wealth:+1, knowledge:+1 }
    }
  ],
  Adult: [
    {
      id: "sample_adult_parent",
      label: "Family Day",
      icon: "👨\u200d👩\u200d👧",
      effects: { relationships:+2, happiness:+1 }
    },
    {
      id: "sample_adult_training",
      label: "Workshop",
      icon: "🛠️",
      effects: { knowledge:+1, wealth:-1 },
      outcomes: [
        { id:"skill_boost", text:"Skill boost (+1 📚)", probability:0.7, effects:{ knowledge:+1 } }
      ]
    },
    {
      id: "sample_adult_fitness",
      label: "Fitness",
      icon: "🏃",
      effects: { health:+2 }
    },
    {
      id: "sample_adult_invest",
      label: "Invest",
      icon: "📈",
      effects: { wealth:+2, happiness:-1 }
    },
    {
      id: "sample_adult_club",
      label: "Community",
      icon: "🏘️",
      effects: { relationships:+1, happiness:+1 }
    }
  ],
  OldAge: [
    {
      id: "sample_old_walk",
      label: "Morning Walk",
      icon: "🚶",
      effects: { health:+1, happiness:+1 }
    },
    {
      id: "sample_old_grandkids",
      label: "Grandkids",
      icon: "🧒",
      effects: { relationships:+2, happiness:+1 }
    },
    {
      id: "sample_old_bookclub",
      label: "Book Club",
      icon: "📚",
      effects: { knowledge:+1, relationships:+1 }
    },
    {
      id: "sample_old_volunteer",
      label: "Volunteer",
      icon: "💞",
      effects: { relationships:+1, happiness:+1 }
    },
    {
      id: "sample_old_daytrip",
      label: "Day Trip",
      icon: "🚌",
      effects: { happiness:+1, wealth:-1 },
      outcomes: [
        { id:"sleepy_return", text:"Came home tired (-1 💚)", probability:0.18, effects:{ health:-1 } },
        { id:"smooth_ride", text:"Lovely sights", probability:0.82 }
      ]
    }
  ]
};

function cloneTemplate(template){
  return JSON.parse(JSON.stringify(template));
}

export function generateSampleLaneOptions(age, stage = ageToStage(age)){
  const pool = SAMPLE_LIBRARY[stage];
  if (!pool || pool.length === 0) return [dummyOption(stage), dummyOption(stage), dummyOption(stage)];
  const offset = Math.abs(age) % pool.length;
  const picks = [];
  for (let i = 0; i < 3; i++) {
    picks.push(cloneTemplate(pool[(offset + i) % pool.length]));
  }
  return picks;
}

export function buildSampleGate(age, stage = ageToStage(age)){
  const options = generateSampleLaneOptions(age, stage);
  return sanitizeGate({
    id: `sample_${stage.toLowerCase()}_${age}`,
    stage,
    age,
    laneOptions: options
  }, { expectedAge: age, idPrefix: "sample" });
}
