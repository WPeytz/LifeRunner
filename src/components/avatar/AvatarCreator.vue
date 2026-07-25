<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AvatarPortrait from './AvatarPortrait.vue'
import {
  eyeColors,
  hairColors,
  hairStyles,
  outfitColors,
  skinTones,
  useAvatarStore,
  type HairStyle,
} from '@/stores/avatar'

defineEmits<{ confirm: []; back: [] }>()

const avatarStore = useAvatarStore()
const { age, skinTone, hairColor, eyeColor, outfitColor, hairStyle } = storeToRefs(avatarStore)

const hairLabels: Record<HairStyle, string> = {
  short: 'Short',
  curly: 'Curly',
  long: 'Long',
  buzz: 'Buzz',
  bun: 'Bun',
}
</script>

<template>
  <section class="creator" aria-labelledby="avatar-title">
    <div class="creator-heading">
      <p class="eyebrow">Your story starts here</p>
      <h1 id="avatar-title">Design your 18-year-old self</h1>
      <p>Choose how you look at the beginning of your LifeRun.</p>
    </div>

    <div class="creator-grid">
      <div class="preview-panel">
        <span class="age-badge">Age {{ age }}</span>
        <AvatarPortrait class="creator-avatar" :size="155" />
        <button class="random-btn" type="button" @click="avatarStore.randomize">↻ Surprise me</button>
      </div>

      <div class="controls-panel">
        <fieldset>
          <legend>Skin tone</legend>
          <div class="swatches">
            <button
              v-for="tone in skinTones"
              :key="tone"
              type="button"
              class="swatch"
              :class="{ selected: skinTone === tone }"
              :style="{ background: tone }"
              :aria-label="`Choose skin tone ${tone}`"
              :aria-pressed="skinTone === tone"
              @click="skinTone = tone"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Hair style</legend>
          <div class="choice-row">
            <button
              v-for="style in hairStyles"
              :key="style"
              type="button"
              class="choice-chip"
              :class="{ selected: hairStyle === style }"
              :aria-pressed="hairStyle === style"
              @click="hairStyle = style"
            >{{ hairLabels[style] }}</button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Hair colour</legend>
          <div class="swatches">
            <button
              v-for="colour in hairColors"
              :key="colour"
              type="button"
              class="swatch"
              :class="{ selected: hairColor === colour }"
              :style="{ background: colour }"
              :aria-label="`Choose hair colour ${colour}`"
              :aria-pressed="hairColor === colour"
              @click="hairColor = colour"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Eye colour</legend>
          <div class="swatches">
            <button
              v-for="colour in eyeColors"
              :key="colour"
              type="button"
              class="swatch"
              :class="{ selected: eyeColor === colour }"
              :style="{ background: colour }"
              :aria-label="`Choose eye colour ${colour}`"
              :aria-pressed="eyeColor === colour"
              @click="eyeColor = colour"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Outfit</legend>
          <div class="swatches">
            <button
              v-for="colour in outfitColors"
              :key="colour"
              type="button"
              class="swatch outfit"
              :class="{ selected: outfitColor === colour }"
              :style="{ background: colour }"
              :aria-label="`Choose outfit colour ${colour}`"
              :aria-pressed="outfitColor === colour"
              @click="outfitColor = colour"
            />
          </div>
        </fieldset>
      </div>
    </div>

    <div class="creator-actions">
      <button class="back-btn" type="button" @click="$emit('back')">← Back</button>
      <button class="confirm-btn" type="button" @click="$emit('confirm')">Begin my life →</button>
    </div>
  </section>
</template>

<style scoped>
.creator {
  width: min(900px, 100%);
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  background: rgba(10, 16, 35, 0.82);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
}

.creator-heading { text-align: center; }
.eyebrow { margin: 0 0 .4rem; color: #f97316; font-size: .75rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.creator-heading h1 { margin: 0; font-size: clamp(1.8rem, 4vw, 2.7rem); line-height: 1.1; }
.creator-heading > p:last-child { margin: .65rem 0 0; color: rgba(255, 255, 255, .58); }
.creator-grid { display: grid; grid-template-columns: minmax(250px, .8fr) minmax(320px, 1.2fr); gap: 2rem; margin-top: 1.8rem; }
.preview-panel { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 390px; border-radius: 20px; background: radial-gradient(circle at 50% 35%, rgba(233, 69, 96, .18), transparent 55%), rgba(255, 255, 255, .035); }
.creator-avatar { position: relative; z-index: 1; }
.age-badge { position: absolute; z-index: 2; top: 1rem; left: 1rem; padding: .35rem .7rem; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(10,16,35,.65); color: rgba(255,255,255,.85); font-size: .78rem; font-weight: 700; backdrop-filter: blur(6px); }
.random-btn { position: relative; z-index: 2; margin-top: .75rem; padding: .55rem .9rem; border: 1px solid rgba(255,255,255,.16); border-radius: 9px; background: rgba(10,16,35,.72); color: rgba(255,255,255,.9); cursor: pointer; backdrop-filter: blur(6px); }
.random-btn:hover { background: rgba(255,255,255,.11); }
.controls-panel { display: grid; gap: 1rem; align-content: center; }
fieldset { margin: 0; padding: 0; border: 0; }
legend { margin-bottom: .55rem; color: rgba(255,255,255,.7); font-size: .78rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
.swatches, .choice-row { display: flex; flex-wrap: wrap; gap: .55rem; }
.swatch { width: 34px; height: 34px; border: 3px solid transparent; border-radius: 50%; cursor: pointer; box-shadow: 0 0 0 1px rgba(255,255,255,.16); transition: transform .15s ease, box-shadow .15s ease; }
.swatch.outfit { border-radius: 9px; }
.swatch:hover { transform: scale(1.08); }
.swatch.selected { box-shadow: 0 0 0 2px #fff, 0 0 0 5px rgba(233,69,96,.8); }
.choice-chip { padding: .5rem .75rem; border: 1px solid rgba(255,255,255,.14); border-radius: 9px; background: rgba(255,255,255,.05); color: rgba(255,255,255,.72); cursor: pointer; }
.choice-chip.selected { border-color: #e94560; background: rgba(233,69,96,.2); color: #fff; }
.creator-actions { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1.75rem; }
.back-btn, .confirm-btn { padding: .8rem 1.2rem; border-radius: 11px; font-weight: 700; cursor: pointer; }
.back-btn { border: 1px solid rgba(255,255,255,.15); background: transparent; color: rgba(255,255,255,.7); }
.confirm-btn { border: 0; background: linear-gradient(135deg, #e94560, #f97316); color: #fff; box-shadow: 0 8px 25px rgba(233,69,96,.28); }
.confirm-btn:hover { transform: translateY(-1px); }

@media (max-width: 700px) {
  .creator { padding: 1.25rem; max-height: calc(100vh - 1rem); }
  .creator-grid { grid-template-columns: 1fr; gap: 1rem; }
  .preview-panel { min-height: 390px; }
}
</style>
