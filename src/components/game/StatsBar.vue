<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { totalStages } from '@/data/lifeStages'
import { getCardById } from '@/data/cards'
import { computed } from 'vue'

const gameStore = useGameStore()
const { stats, stageIndex, currentLocation, selectionPhase } = storeToRefs(gameStore)

const statIcons: Record<string, string> = {
  health: '❤️',
  happiness: '😄',
  skills: '🧠',
  relationships: '🤝',
}

const statOrder = ['health', 'happiness', 'skills', 'relationships'] as const

// Get the current location name for display
const currentLocationName = computed(() => {
  if (!currentLocation.value) return null
  const card = getCardById(currentLocation.value)
  return card?.title ?? null
})
</script>

<template>
  <div class="stats-bar">
    <div class="progress-row">
      <div
        v-for="i in totalStages"
        :key="i"
        class="progress-dot"
        :class="{ filled: i <= stageIndex + 1, current: i === stageIndex + 1 }"
      />
    </div>
    <div v-if="selectionPhase === 'location' && currentLocationName" class="location-row">
      <span class="location-icon">📍</span>
      <span class="location-label">Current:</span>
      <span class="location-name">{{ currentLocationName }}</span>
    </div>
    <div class="stats-row">
      <div class="stat" v-for="key in statOrder" :key="key" :title="key.charAt(0).toUpperCase() + key.slice(1)">
        <span class="stat-icon">{{ statIcons[key] }}</span>
        <span class="stat-value">{{ stats[key as keyof typeof stats] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.progress-row {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.progress-dot.filled {
  background: #e94560;
}

.progress-dot.current {
  background: #e94560;
  box-shadow: 0 0 8px rgba(233, 69, 96, 0.6);
  transform: scale(1.2);
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 1rem;
}

.stat-icon {
  font-size: 1.1rem;
}

.stat-value {
  color: #fff;
  font-weight: 600;
  min-width: 1.25rem;
  text-align: center;
}

.location-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.location-icon {
  font-size: 1rem;
}

.location-label {
  color: rgba(255, 255, 255, 0.6);
}

.location-name {
  color: #e94560;
  font-weight: 600;
}
</style>
