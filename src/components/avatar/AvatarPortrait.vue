<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAvatarStore } from '@/stores/avatar'

withDefaults(defineProps<{ size?: number }>(), { size: 220 })

const avatarStore = useAvatarStore()
const { skinTone, hairColor, eyeColor, outfitColor, hairStyle } = storeToRefs(avatarStore)
</script>

<template>
  <svg
    class="avatar-figure"
    :style="{ width: `${size}px` }"
    viewBox="0 0 220 440"
    role="img"
    aria-label="Your full-body avatar"
  >
    <ellipse cx="110" cy="421" rx="69" ry="11" fill="rgba(0,0,0,.28)" />

    <g>
      <!-- Hair behind the head -->
      <path v-if="hairStyle === 'long'" d="M61 72 Q65 28 110 27 Q159 29 162 76 L168 168 Q147 184 133 153 L87 153 Q69 184 53 164Z" :fill="hairColor" />
      <circle v-if="hairStyle === 'bun'" cx="145" cy="43" r="23" :fill="hairColor" />

      <!-- Legs and shoes -->
      <path d="M72 252 L108 252 L104 392 L70 392Z" fill="#26324b" />
      <path d="M112 252 L148 252 L151 392 L116 392Z" fill="#26324b" />
      <path d="M70 382 L104 382 L108 408 Q87 419 60 408 Q59 395 70 382Z" fill="#101522" />
      <path d="M116 382 L151 382 Q163 395 160 408 Q133 419 112 408Z" fill="#101522" />
      <path d="M109 264 L111 377" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3" />

      <!-- Arms -->
      <path d="M77 173 Q55 178 47 226 L43 281 Q50 288 60 283 L70 233 L88 201Z" :fill="skinTone" />
      <path d="M143 173 Q166 178 174 226 L178 281 Q170 288 160 283 L150 233 L132 201Z" :fill="skinTone" />
      <circle cx="51" cy="283" r="11" :fill="skinTone" />
      <circle cx="169" cy="283" r="11" :fill="skinTone" />

      <!-- Shirt -->
      <path d="M77 169 Q91 160 110 160 Q129 160 143 169 L154 260 Q132 271 110 271 Q88 271 66 260Z" :fill="outfitColor" />
      <path d="M77 169 Q62 171 54 192 L70 211 L88 190Z" :fill="outfitColor" />
      <path d="M143 169 Q158 171 166 192 L150 211 L132 190Z" :fill="outfitColor" />
      <path d="M86 160 Q110 183 134 160 L130 181 Q110 196 90 181Z" fill="rgba(255,255,255,.17)" />
      <path d="M68 252 Q110 262 152 252 L151 274 Q110 282 69 274Z" fill="rgba(0,0,0,.13)" />

      <!-- Neck and head -->
      <path d="M86 140 L86 169 Q110 184 134 169 L134 140Z" :fill="skinTone" />
      <path d="M86 153 Q110 168 134 153 L132 170 Q110 186 88 170Z" fill="rgba(0,0,0,.12)" />
      <ellipse cx="65" cy="101" rx="12" ry="17" :fill="skinTone" />
      <ellipse cx="155" cy="101" rx="12" ry="17" :fill="skinTone" />
      <path d="M69 74 Q72 43 110 41 Q149 43 152 75 L148 119 Q142 151 110 158 Q78 151 72 119Z" :fill="skinTone" />

      <!-- Hair on top -->
      <path v-if="hairStyle === 'short'" d="M68 79 Q65 39 109 35 Q154 37 153 80 Q138 63 124 61 Q96 70 68 79Z" :fill="hairColor" />
      <path v-else-if="hairStyle === 'curly'" d="M68 81 Q55 62 70 52 Q68 33 88 38 Q100 22 114 37 Q132 23 139 41 Q160 42 151 63 Q162 77 149 84 Q138 62 121 62 Q94 70 68 81Z" :fill="hairColor" />
      <path v-else-if="hairStyle === 'long'" d="M67 81 Q61 39 109 34 Q157 36 153 83 Q139 61 121 60 Q91 72 67 81Z" :fill="hairColor" />
      <path v-else-if="hairStyle === 'buzz'" d="M70 72 Q73 43 110 41 Q146 43 150 72 Q129 57 110 57 Q89 57 70 72Z" :fill="hairColor" opacity=".92" />
      <path v-else d="M67 80 Q62 38 108 34 Q154 35 154 82 Q136 59 118 61 Q91 69 67 80Z" :fill="hairColor" />

      <!-- Face -->
      <path d="M82 96 Q91 91 99 96" fill="none" stroke="rgba(50,30,24,.55)" stroke-width="3" stroke-linecap="round" />
      <path d="M121 96 Q130 91 139 96" fill="none" stroke="rgba(50,30,24,.55)" stroke-width="3" stroke-linecap="round" />
      <ellipse cx="91" cy="104" rx="5" ry="6" fill="white" />
      <ellipse cx="130" cy="104" rx="5" ry="6" fill="white" />
      <circle cx="91" cy="104" r="3.2" :fill="eyeColor" />
      <circle cx="130" cy="104" r="3.2" :fill="eyeColor" />
      <circle cx="92" cy="103" r="1" fill="white" />
      <circle cx="131" cy="103" r="1" fill="white" />
      <path d="M110 105 L106 121 Q110 124 115 121" fill="none" stroke="rgba(90,45,36,.35)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M98 134 Q110 142 123 134" fill="none" stroke="#9e4652" stroke-width="3" stroke-linecap="round" />
    </g>
  </svg>
</template>

<style scoped>
.avatar-figure {
  display: block;
  height: auto;
  max-height: 100%;
  flex: 0 0 auto;
  filter: drop-shadow(0 18px 32px rgba(0, 0, 0, 0.3));
}
</style>
