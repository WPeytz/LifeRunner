<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const gameStore = useGameStore()
const { lifeEnergy, maxLifeEnergy, incomeSelections, decisionSelections } = storeToRefs(gameStore)

const usedEnergy = computed(() => {
  // Only income and decision cards cost energy (expenses are mandatory)
  const energySelections = [...incomeSelections.value, ...decisionSelections.value]
  return energySelections.reduce((sum, card) => sum + card.cost, 0)
})

const remainingEnergy = computed(() => {
  return lifeEnergy.value - usedEnergy.value
})
</script>

<template>
  <div class="mana-bar">
    <div class="mana-label">
      <span class="energy-icon">⚡</span>
      <span class="energy-text">Life Energy</span>
    </div>
    <div class="energy-orbs">
      <div
        v-for="i in maxLifeEnergy"
        :key="i"
        class="orb"
        :class="{
          filled: i <= lifeEnergy,
          used: i <= lifeEnergy && i > remainingEnergy,
          empty: i > lifeEnergy
        }"
      />
    </div>
    <div class="energy-count">
      {{ remainingEnergy }} / {{ maxLifeEnergy }}
    </div>
  </div>
</template>

<style scoped>
.mana-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.mana-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #a0a0a0;
}

.energy-icon {
  font-size: 1.25rem;
}

.energy-orbs {
  display: flex;
  gap: 0.5rem;
}

.orb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.orb.filled {
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.orb.used {
  background: linear-gradient(135deg, #666 0%, #444 100%);
  box-shadow: none;
  opacity: 0.5;
}

.orb.empty {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.energy-count {
  font-size: 0.85rem;
  color: #ffd700;
  font-weight: 600;
}
</style>
