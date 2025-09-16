// src/model.js

export const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

export function makePlayer() {
  return {
    age: 6,
    stage: "Childhood",
    stats: { health:7, happiness:5, knowledge:5, relationships:4, wealth:3 },
    flags: {},
    history: []
  };
}

export function passesPrereqs(player, prereqs=[]) {
  return prereqs.every(pr => {
    if (pr.flag !== undefined) return !!player.flags[pr.flag] === pr.value;
    const v = player.stats[pr.stat] ?? 0, t = pr.value;
    return pr.op === ">=" ? v>=t : pr.op === "<=" ? v<=t : pr.op === ">" ? v>t :
           pr.op === "<" ? v<t : v===t;
  });
}

export function applyEffect(player, eff={}) {
  const keys = ["health","happiness","knowledge","relationships","wealth"];
  for (const k of keys) if (k in eff) player.stats[k] = clamp(player.stats[k]+eff[k], 0, 10);
  if (eff.setFlag) player.flags[eff.setFlag] = !!eff.setTrue;
}

export function rollOutcome(outcomes=[]) {
  let r = Math.random(), acc=0;
  for (const o of outcomes) { acc += o.probability ?? 0; if (r<=acc) return o; }
  return outcomes[outcomes.length-1] || null;
}


