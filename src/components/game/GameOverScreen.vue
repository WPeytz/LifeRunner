<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  playAgain: []
}>()

const gameStore = useGameStore()
const { stats, isDead } = storeToRefs(gameStore)
const archetype = gameStore.getLifeArchetype()

const statIcons: Record<string, string> = {
  health: '❤️',
  happiness: '😄',
  wealth: '💰',
  skills: '🧠',
  relationships: '🤝',
}

const statNames: Record<string, string> = {
  health: 'Health',
  happiness: 'Happiness',
  wealth: 'Wealth',
  skills: 'Skills',
  relationships: 'Relationships',
}

const statOrder = ['health', 'happiness', 'wealth', 'skills', 'relationships']

const totalScore = Object.values(stats.value).reduce((sum, v) => sum + v, 0)
</script>

<template>
  <div class="game-over-screen">
    <div class="content">
      <div v-if="isDead" class="death-message">
        <h1 class="title">Life Cut Short</h1>
        <p class="subtitle">Your health gave out...</p>
      </div>
      <div v-else class="success-message">
        <h1 class="title">Your Life Story</h1>
        <p class="age-reached">You lived to 70</p>
      </div>

      <div class="archetype-section">
        <div class="archetype-badge">{{ archetype.title }}</div>
        <p class="archetype-desc">{{ archetype.description }}</p>
      </div>

      <div class="final-stats">
        <h3 class="section-title">Final Stats</h3>
        <div class="stats-grid">
          <div
            v-for="stat in statOrder"
            :key="stat"
            class="stat-item"
          >
            <span class="stat-icon">{{ statIcons[stat] }}</span>
            <span class="stat-name">{{ statNames[stat] }}</span>
            <span class="stat-value">{{ stats[stat] }}</span>
          </div>
        </div>
        <div class="total-score">
          <span>Total Life Score</span>
          <span class="score-value">{{ totalScore }}</span>
        </div>
      </div>

      <button class="play-again-btn" @click="emit('playAgain')">
        Live Another Life
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-over-screen {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.content {
  text-align: center;
  max-width: 400px;
  width: 100%;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.subtitle {
  color: #f87171;
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
}

.age-reached {
  color: #888;
  font-size: 1rem;
  margin: 0.25rem 0 0 0;
}

.archetype-section {
  margin: 2rem 0;
}

.archetype-badge {
  display: inline-block;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.75rem;
}

.archetype-desc {
  color: #a0a0a0;
  font-size: 1rem;
  font-style: italic;
  margin: 0;
}

.final-stats {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}

.stat-icon {
  font-size: 1rem;
}

.stat-name {
  color: #888;
  font-size: 0.85rem;
}

.stat-value {
  color: #fff;
  font-weight: 600;
  margin-left: auto;
}

.total-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  font-size: 0.9rem;
}

.score-value {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
}

.play-again-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(233, 69, 96, 0.4);
}

.play-again-btn:active {
  transform: translateY(0);
}
</style>
