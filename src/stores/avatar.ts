import { defineStore } from 'pinia'
import { ref } from 'vue'

export type HairStyle = 'short' | 'curly' | 'long' | 'buzz' | 'bun'

export const skinTones = ['#f6d2b8', '#e5ae82', '#bd7955', '#8a5139', '#573326'] as const
export const hairColors = ['#241c18', '#6b3e25', '#c18a46', '#d8c1a0', '#8f2638'] as const
export const eyeColors = ['#4b2e20', '#537f45', '#39718c', '#707780'] as const
export const outfitColors = ['#e94560', '#f97316', '#3b82f6', '#8b5cf6', '#16a085'] as const
export const hairStyles: HairStyle[] = ['short', 'curly', 'long', 'buzz', 'bun']

export const useAvatarStore = defineStore('avatar', () => {
  const age = ref(18)
  const skinTone = ref<(typeof skinTones)[number]>('#e5ae82')
  const hairColor = ref<(typeof hairColors)[number]>('#241c18')
  const eyeColor = ref<(typeof eyeColors)[number]>('#4b2e20')
  const outfitColor = ref<(typeof outfitColors)[number]>('#e94560')
  const hairStyle = ref<HairStyle>('short')

  function randomize() {
    skinTone.value = skinTones[Math.floor(Math.random() * skinTones.length)]
    hairColor.value = hairColors[Math.floor(Math.random() * hairColors.length)]
    eyeColor.value = eyeColors[Math.floor(Math.random() * eyeColors.length)]
    outfitColor.value = outfitColors[Math.floor(Math.random() * outfitColors.length)]
    hairStyle.value = hairStyles[Math.floor(Math.random() * hairStyles.length)]
  }

  return {
    age,
    skinTone,
    hairColor,
    eyeColor,
    outfitColor,
    hairStyle,
    randomize,
  }
})
