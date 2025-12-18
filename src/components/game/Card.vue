<script setup lang="ts">
import type { Card } from '@/types/game'

const props = defineProps<{
  card: Card
  selected: boolean
  disabled?: boolean
  highlighted?: boolean
  completed?: boolean
  selectedChoice?: string  // Title of the deepest selected sub-option
  locked?: boolean  // True if prerequisites not met
}>()

const emit = defineEmits<{
  toggle: [card: Card]
}>()

const statIcons: Record<string, string> = {
  health: '❤️',
  happiness: '😄',
  wealth: '💰',
  skills: '🧠',
  relationships: '🤝',
}

// Format wealth as currency
function formatDelta(stat: string, delta: number): string {
  if (stat === 'wealth') {
    const absAmount = Math.abs(delta)
    const sign = delta >= 0 ? '+' : '-'
    if (absAmount >= 1000000) {
      return `${sign}$${(absAmount / 1000000).toFixed(1)}M`
    } else if (absAmount >= 1000) {
      return `${sign}$${(absAmount / 1000).toFixed(0)}K`
    }
    return `${sign}$${absAmount}`
  }
  return `${delta >= 0 ? '+' : ''}${delta}`
}

function handleTap() {
  if (props.disabled || props.locked) return
  emit('toggle', props.card)
}
</script>

<template>
  <div
    class="card"
    :class="{
      selected,
      disabled,
      highlighted,
      completed,
      locked
    }"
    @click="handleTap"
  >
    <div class="card-inner">
      <header class="card-header">
        <h3 class="card-title">{{ card.title }}</h3>
        <span v-if="card.cost > 0 || !card.subOptions" class="card-cost">{{ card.cost }}⚡</span>
      </header>

      <p class="card-description">{{ card.description }}</p>

      <div class="card-effects" v-if="card.effects.length > 0">
        <div
          v-for="effect in card.effects"
          :key="effect.stat"
          class="effect"
          :class="effect.delta >= 0 ? 'positive' : 'negative'"
        >
          <span class="effect-icon">{{ statIcons[effect.stat] }}</span>
          <span class="effect-delta">
            {{ formatDelta(effect.stat, effect.delta) }}
          </span>
        </div>
      </div>

      <div v-if="selectedChoice" class="selected-choice">
        {{ selectedChoice }}
      </div>

      <div v-if="locked" class="locked-indicator">
        🔒 Requires prerequisite
      </div>

    </div>

    <div v-if="highlighted" class="highlight-ring" />
  </div>
</template>

<style scoped>
.card {
  position: relative;
  width: 160px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-inner {
  background: linear-gradient(145deg, #2a2a4a 0%, #1a1a2e 100%);
  border-radius: 12px;
  padding: 0.875rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover .card-inner {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card.selected .card-inner {
  border-color: #e94560;
  background: linear-gradient(145deg, #3a2a4a 0%, #2a1a3e 100%);
  transform: translateY(-4px);
}

.card.completed .card-inner {
  border-color: #4ade80;
  background: linear-gradient(145deg, #1a3a2a 0%, #1a2e1a 100%);
}

.card.completed.selected .card-inner {
  border-color: #4ade80;
  background: linear-gradient(145deg, #2a4a3a 0%, #1a3e2a 100%);
  transform: translateY(-4px);
}

.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card.disabled .card-inner {
  transform: none;
}

.card.locked {
  opacity: 0.4;
  cursor: not-allowed;
}

.card.locked .card-inner {
  transform: none;
  background: linear-gradient(145deg, #1a1a2a 0%, #101018 100%);
  border-color: rgba(255, 255, 255, 0.1);
}

.card.locked:hover .card-inner {
  transform: none;
  box-shadow: none;
}

.card.highlighted .card-inner {
  animation: pulse 1.5s ease-in-out infinite;
}

.highlight-ring {
  position: absolute;
  inset: -4px;
  border-radius: 16px;
  border: 2px solid #ffd700;
  animation: glow 1.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.2;
}

.card-cost {
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffd700;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  white-space: nowrap;
}

.card-description {
  font-size: 0.75rem;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.card-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.effect {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.effect.positive .effect-delta {
  color: #4ade80;
}

.effect.negative .effect-delta {
  color: #f87171;
}

.selected-choice {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.75rem;
  font-weight: 600;
  color: #4ade80;
  text-align: center;
}

.locked-indicator {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.65rem;
  font-weight: 500;
  color: #f87171;
  text-align: center;
}

</style>
