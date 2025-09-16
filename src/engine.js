import { passesPrereqs, applyEffect, rollOutcome, clamp } from "./model.js";
import { getAuthoredGate, getSampleGate, hasAuthoredGate } from "./data.js";
import { AI_MODE, generateGate, generateGatesBatch } from "./ai.js";

export function makeGame(canvas, hudEl) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const LANES = [W*0.25, W*0.5, W*0.75];
  const LANE_SPACING = LANES[1] - LANES[0];

  const player = {
    x: LANES[1], lane:1, y: H-120,
    stats: { health:7, happiness:5, knowledge:5, relationships:4, wealth:3 },
    flags: {}, history: [], age: 0
  };

  const state = { phase:"RUN", stageIdx:0, dist:0, speed:6, text:null, paused:false, prevPhase:null };

  // --- AI config (ON by default) ---
  const aiConfig = {
    mode: AI_MODE.ON,            // ON = always use AI-generated gates
    endpoint: "http://localhost:3000/api/generate",  // your backend proxy to the LLM
    apiKey: null                 // keys live on the server
  };

  // Prefetch buffer to hide latency
  const prefetch = { inFlight: false, nextGate: null, targetAge: null, lastErrorAge: null };

  function shouldRequestAI(_targetAge){
    if (aiConfig.mode === AI_MODE.OFF) return false;
    if (aiConfig.mode === AI_MODE.ON) return true;
    // HYBRID: prefer authored if present. Since authored data was stage-keyed,
    // treat as absent and allow AI.
    return true;
  }

  function snapshotPlayer(){
    return {
      age: player.age,
      stats: { ...player.stats },
      flags: { ...player.flags },
      history: [...player.history]
    };
  }

  function maybePrefetchForAge(targetAge){
    if (targetAge > 80) return;
    if (!shouldRequestAI(targetAge) || prefetch.inFlight || prefetch.lastErrorAge === targetAge) return;
    prefetchNextGate(snapshotPlayer(), targetAge);
  }

  async function prefetchNextGate(snapshot, targetAge){
    if (prefetch.inFlight) return;
    prefetch.inFlight = true;
    try {
      const g = await generateGate(snapshot, aiConfig);
      prefetch.nextGate = g;
      prefetch.targetAge = g.age;
      prefetch.lastErrorAge = null;
    } catch (e){
      console.warn("AI prefetch failed:", e);
      prefetch.nextGate = null; prefetch.targetAge = null; prefetch.lastErrorAge = targetAge;
    } finally {
      prefetch.inFlight = false;
    }
  }

  // --- Pre-generated cache (to reduce latency) ---
  const pregen = new Map(); // age -> gate

  async function warmStartBatch(batchCount = 6) {
    try {
      const gates = await generateGatesBatch(snapshotPlayer(), { endpoint: aiConfig.endpoint, apiKey: aiConfig.apiKey, startAge: player.age + 1, count: batchCount });
      for (const g of gates) {
        if (g && Number.isFinite(g.age)) pregen.set(g.age, g);
      }
      // Seed prefetch slot if empty
      const nextAge = player.age + 1;
      if (!prefetch.inFlight && !prefetch.nextGate && pregen.has(nextAge)) {
        prefetch.nextGate = pregen.get(nextAge);
        prefetch.targetAge = nextAge;
      }
    } catch (e) {
      console.warn('Warm-start batch failed:', e);
    }
  }

  // Background color based on age (no stages)
  function bgColorForAge(age){
    if (age <= 12) return "#13224a";       // childhood hue
    if (age <= 24) return "#1b2f5c";       // youth hue
    if (age <= 64) return "#20376a";       // adult hue
    return "#1d335e";                      // elder hue
  }

  // Simple word wrap that fits text into maxWidth with up to maxLines; ellipsizes if needed
  function wrapLines(ctx, text, maxWidth, maxLines) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      const w = ctx.measureText(test).width;
      if (w <= maxWidth) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = words[i];
        if (lines.length === maxLines - 1) break; // last line will be ellipsized
      }
    }
    if (line) lines.push(line);
    // Ellipsize last line if too long
    if (lines.length > maxLines) lines.length = maxLines;
    const last = lines[lines.length - 1] || '';
    if (ctx.measureText(last).width > maxWidth) {
      let clipped = last;
      while (clipped.length && ctx.measureText(clipped + '…').width > maxWidth) {
        clipped = clipped.slice(0, -1);
      }
      lines[lines.length - 1] = clipped + '…';
    }
    return lines;
  }

  // --- Gate entity (visible decision blocks) ---
  let activeGate = null; // { options: Option[], y:number }
  const BLOCK_W = Math.min(LANE_SPACING * 0.92, 320), BLOCK_H = 120; // taller blocks for multi-line sentences
  const GATE_SPEED = 2;              // slower descent for more reaction time

  let lastSpawnedAge = -1;      // track which age we spawned a decision for
  let spawnCooldown = 0;        // brief delay between gates (frames)

  let targetLane = 1;
  function setTargetFromX(px) {
    if (state.paused) return;
    const idx = LANES.reduce((best,i,bi)=> Math.abs(i-px)<Math.abs(LANES[best]-px)?bi:best,0);
    targetLane = idx;
  }

  // Keyboard controls: allow left/right arrow to change lanes
  function handleKey(e) {
    if (state.paused && e.code !== "Escape") return;
    if (e.code === "ArrowLeft") {
      targetLane = Math.max(0, targetLane - 1);
    }
    if (e.code === "ArrowRight") {
      targetLane = Math.min(2, targetLane + 1);
    }
    if (e.code === "Escape") {
      togglePause();
    }
  }
  window.addEventListener("keydown", handleKey);

  function togglePause(){
    state.paused = !state.paused;
    if (state.paused) {
      state.prevPhase = state.phase;
      state.phase = "PAUSED";
    } else {
      state.phase = state.prevPhase && state.prevPhase !== "PAUSED" ? state.prevPhase : "RUN";
      state.prevPhase = null;
    }
  }

  function step() {
    if (state.paused) return;

    if (state.phase==="RUN") {
      // move world
      state.dist += state.speed;
      // ease lane
      player.x += (LANES[targetLane]-player.x)*0.22;

      if (spawnCooldown > 0) spawnCooldown--;

      // AGE-DRIVEN SPAWN: exactly one decision per age
      // Spawn a new gate when there isn't one active, no cooldown, and we haven't spawned for the next age yet
      if (!activeGate && spawnCooldown === 0) {
        const targetAge = player.age + 1; // next age to decide for
        if (lastSpawnedAge !== targetAge && player.age <= 80) {
          let base = null;

          if (aiConfig.mode === AI_MODE.ON) {
            // --- AI ONLY path ---
            if (prefetch.nextGate && prefetch.targetAge === targetAge) {
              base = prefetch.nextGate;
              prefetch.nextGate = null; prefetch.targetAge = null;
            } else {
              // Try pre-generated cache first
              if (pregen.has(targetAge)) {
                base = pregen.get(targetAge);
                pregen.delete(targetAge);
              } else {
                // Request the AI gate (if not already in-flight) and wait until it arrives
                if (!prefetch.inFlight) prefetchNextGate(snapshotPlayer(), targetAge);
                return; // don't fall back to authored/sample when ON
              }
            }
          } else {
            // OFF/HYBRID: authored stages were removed; use AI when allowed, else sample
            const needsAI = shouldRequestAI(targetAge);
            if (needsAI) {
              if (prefetch.nextGate && prefetch.targetAge === targetAge) {
                base = prefetch.nextGate;
                prefetch.nextGate = null; prefetch.targetAge = null;
              } else if (!prefetch.inFlight) {
                prefetchNextGate(snapshotPlayer(), targetAge);
              }
            }
            if (!base) base = getSampleGate(targetAge);
          }

          if (base) {
            const opts = Array.isArray(base.laneOptions)
              ? base.laneOptions.filter(o => passesPrereqs(player, o.prereqs)).slice(0, 3)
              : [];
            const options = (opts.length ? opts : (Array.isArray(base.laneOptions) ? base.laneOptions.slice(0,3) : []));
            if (!options.length) return; // safety

            activeGate = { options, y: -BLOCK_H - 220 };
            state.currentGate = { ...base, options, source: (aiConfig.mode === AI_MODE.ON ? 'ai' : (base.source || 'authored')) };
            lastSpawnedAge = targetAge;

            // Prefetch the following age if AI mode is ON
            if (aiConfig.mode === AI_MODE.ON && !prefetch.inFlight) {
              prefetchNextGate(snapshotPlayer(), player.age + 1);
            }

            // Debug: log source
            console.log('Spawned gate', { age: targetAge, source: state.currentGate.source, gate: state.currentGate });
          }
        }
      }

      // Move active gate (if any) toward the player and resolve on contact
      if (activeGate) {
        activeGate.y += GATE_SPEED;
        const collideY = player.y - BLOCK_H; // when top of block reaches player
        if (activeGate.y >= collideY) {
          // Choose option by current lane (clamped)
          const idx = Math.max(0, Math.min(2, targetLane));
          const chosen = activeGate.options[idx] || activeGate.options[0];
          activeGate = null;
          resolveDecision(chosen);
        }
      }
    }
  }

  function resolveDecision(option){
    player.age += 1;
    if (option.effects) applyEffect(player, option.effects);
    const out = rollOutcome(option.outcomes);
    if (out) {
      if (out.effects) applyEffect(player, out.effects);
      if (out.addFlag) player.flags[out.addFlag] = true;
      state.text = out.text || null;
      if (out.fatal) { state.phase="GAME_OVER"; return; }
    }
    if (player.stats.health<=0) { state.phase="GAME_OVER"; return; }

    if (player.age > 80) { state.phase = "GAME_OVER"; return; }

    state.phase="RUN"; // back to running after brief overlay (UI can animate)
    player.history.push(option.id);
    spawnCooldown = 20; // ~1/3 second at 60fps

    if (aiConfig.mode === AI_MODE.ON && !prefetch.inFlight) {
      prefetchNextGate(snapshotPlayer(), player.age + 1);
    }
    // Keep a small buffer of pre-generated gates ahead
    if (aiConfig.mode === AI_MODE.ON && pregen.size < 3 && !prefetch.inFlight) {
      const need = 4 - pregen.size; // aim for ~3 cached
      warmStartBatch(Math.max(1, need));
    }
  }

  // rendering (very minimal)
  function draw() {
    ctx.fillStyle = bgColorForAge(player.age);
    ctx.fillRect(0,0,W,H);
    // lanes
    ctx.strokeStyle="#243863"; ctx.beginPath();
    for (const x of LANES){ ctx.moveTo(x,0); ctx.lineTo(x,H); }
    ctx.stroke();
    // decision blocks (visible gate)
    if (activeGate) {
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i=0;i<3;i++) {
        const x = LANES[i];
        const opt = activeGate.options[i];
        // background block
        ctx.fillStyle = opt ? '#2ec4b6' : '#1b2f5c';
        ctx.fillRect(x - BLOCK_W/2, activeGate.y, BLOCK_W, BLOCK_H);
        ctx.strokeStyle = '#0b1020';
        ctx.strokeRect(x - BLOCK_W/2, activeGate.y, BLOCK_W, BLOCK_H);
        // label (centered, wrapped)
        const label = opt ? ((opt.icon? opt.icon+ ' ' : '') + opt.label) : '—';
        ctx.fillStyle = opt ? '#0b1020' : '#9fb3d1';
        const padding = 12;
        const maxWidth = BLOCK_W - padding * 2;
        ctx.font = '15px system-ui';
        const lines = wrapLines(ctx, label, maxWidth, 4); // up to 4 lines
        const lineHeight = 18;
        const totalH = lines.length * lineHeight;
        let startY = activeGate.y + (BLOCK_H - totalH) / 2 + lineHeight/2;
        for (let li = 0; li < lines.length; li++) {
          ctx.fillText(lines[li], x, startY + li * lineHeight);
        }
      }
      // reset alignment for other draws
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
    // player
    ctx.fillStyle="#68e1fd"; ctx.fillRect(player.x-18, player.y-30, 36, 60);

    if (state.paused) {
      ctx.fillStyle = "rgba(11,16,32,0.65)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff";
      ctx.font = '28px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Paused', W/2, H/2);
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
    }
  }

  // Initial AI prefetch for age 1 if needed
  maybePrefetchForAge(player.age + 1);

  // Warm-start: pre-generate a small batch to reduce initial latency
  if (aiConfig.mode === AI_MODE.ON) {
    warmStartBatch(6);
  }

  return { state, player, step, draw, setTargetFromX };
}
