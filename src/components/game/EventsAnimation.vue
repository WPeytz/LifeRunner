<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { RandomEvent } from '@/data/randomEvents'

const props = defineProps<{
  events: RandomEvent[]
  stageYears: number
}>()

const emit = defineEmits<{
  complete: []
}>()

const currentEventIndex = ref(-1)
const showingEffect = ref(false)
const allDone = ref(false)

const currentEvent = computed(() => {
  if (currentEventIndex.value < 0 || currentEventIndex.value >= props.events.length) {
    return null
  }
  return props.events[currentEventIndex.value]
})

const statIcons: Record<string, string> = {
  health: '❤️',
  happiness: '😄',
  wealth: '💰',
  skills: '🧠',
  relationships: '🤝',
}

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

onMounted(() => {
  showNextEvent()
})

function showNextEvent() {
  currentEventIndex.value++
  showingEffect.value = false

  if (currentEventIndex.value >= props.events.length) {
    // All events shown, wait a moment then emit complete
    allDone.value = true
    setTimeout(() => {
      emit('complete')
    }, 1500)
    return
  }

  // Show the event card appear
  setTimeout(() => {
    showingEffect.value = true
  }, 500)

  // After showing effects, move to next event
  setTimeout(() => {
    showNextEvent()
  }, 2500)
}
</script>

<template>
  <div class="events-overlay">
    <div class="events-container">
      <div class="events-header">
        <h2 class="events-title">Life Happens...</h2>
        <p class="events-subtitle">Events from the past {{ stageYears }} years</p>
      </div>

      <div class="event-stage">
        <transition name="event-card" mode="out-in">
          <div v-if="currentEvent" :key="currentEvent.id" class="event-card" :class="{ positive: currentEvent.isPositive, negative: !currentEvent.isPositive }">
            <div class="event-emoji">{{ currentEvent.emoji }}</div>
            <h3 class="event-title">{{ currentEvent.title }}</h3>
            <p class="event-description">{{ currentEvent.description }}</p>

            <transition name="fade">
              <div v-if="showingEffect" class="event-effects">
                <div
                  v-for="effect in currentEvent.effects"
                  :key="effect.stat"
                  class="effect"
                  :class="effect.delta >= 0 ? 'positive' : 'negative'"
                >
                  <span class="effect-icon">{{ statIcons[effect.stat] }}</span>
                  <span class="effect-delta">{{ formatDelta(effect.stat, effect.delta) }}</span>
                </div>
              </div>
            </transition>
          </div>
        </transition>

        <div v-if="allDone" class="all-done">
          <p>Moving on to your life summary...</p>
        </div>
      </div>

      <div class="event-progress">
        <div
          v-for="(event, index) in events"
          :key="event.id"
          class="progress-dot"
          :class="{ active: index === currentEventIndex, done: index < currentEventIndex }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.events-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.events-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 400px;
  width: 100%;
}

.events-header {
  text-align: center;
}

.events-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.events-subtitle {
  font-size: 0.9rem;
  color: #888;
  margin: 0.5rem 0 0 0;
}

.event-stage {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.event-card {
  background: linear-gradient(145deg, #2a2a4a 0%, #1a1a2e 100%);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.event-card.positive {
  border-color: rgba(74, 222, 128, 0.4);
  background: linear-gradient(145deg, #1a3a2a 0%, #1a2a1a 100%);
}

.event-card.negative {
  border-color: rgba(248, 113, 113, 0.4);
  background: linear-gradient(145deg, #3a1a2a 0%, #2a1a1a 100%);
}

.event-emoji {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.event-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem 0;
}

.event-description {
  font-size: 0.95rem;
  color: #a0a0a0;
  margin: 0;
  line-height: 1.4;
}

.event-effects {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.effect {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  font-weight: 600;
}

.effect.positive .effect-delta {
  color: #4ade80;
}

.effect.negative .effect-delta {
  color: #f87171;
}

.all-done {
  text-align: center;
  color: #888;
  font-size: 1rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.event-progress {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: #e94560;
  transform: scale(1.3);
}

.progress-dot.done {
  background: #4ade80;
}

/* Transitions */
.event-card-enter-active {
  animation: slideIn 0.5s ease;
}

.event-card-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
