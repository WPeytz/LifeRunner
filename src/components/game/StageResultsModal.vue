<script setup lang="ts">
import type { Card, LifeStage } from '@/types/game'
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  stage: LifeStage
  playedCards: Card[]
  statChanges: Record<string, number>
  riskEvents: string[]
  triggeredEvents: Card[]
  isLastStage: boolean
}>()

const emit = defineEmits<{
  nextStage: []
}>()

const gameStore = useGameStore()
const { stats } = storeToRefs(gameStore)

const statIcons: Record<string, string> = {
  health: '❤️',
  happiness: '😄',
  wealth: '💰',
  skills: '🧠',
  relationships: '🤝',
}

// Stats without wealth (wealth shown separately in finances section)
const statOrder = ['health', 'happiness', 'skills', 'relationships']

// Format number as currency
function formatMoney(amount: number): string {
  const absAmount = Math.abs(amount)
  if (absAmount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (absAmount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

// Calculate yearly cash flow from total (total is already multiplied by years in game store)
const yearlyCashFlow = computed(() => {
  const totalWealth = props.statChanges['wealth'] || 0
  const years = props.stage.years
  if (years <= 0) return 0
  return Math.round(totalWealth / years)
})

function getCardEffectIcons(card: Card): string {
  return card.effects.map(e => {
    const icon = e.delta > 0 ? '↑' : '↓'
    return `${statIcons[e.stat]}${icon}`
  }).join(' ')
}

function getEventEffectSummary(card: Card): string {
  return card.effects.map(e => {
    const sign = e.delta > 0 ? '+' : ''
    return `${statIcons[e.stat]}${sign}${e.delta}`
  }).join(' ')
}

const tagline = computed(() => {
  const totalChange = Object.values(props.statChanges).reduce((sum, v) => sum + v, 0)
  if (totalChange >= 5) return "You crushed it!"
  if (totalChange >= 2) return "Solid progress!"
  if (totalChange >= 0) return "Steady chapter."
  if (totalChange >= -2) return "A bit rough, but you survived."
  return "Tough times... hang in there."
})

// Filter out top-level category cards (cards with subOptions but no effects)
const filteredPlayedCards = computed(() => {
  return props.playedCards.filter(card => {
    // Exclude cards that are just category containers (have subOptions, no effects)
    if (card.subOptions && card.subOptions.length > 0 && card.effects.length === 0) {
      return false
    }
    return true
  })
})
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ stage.name }}</h2>
        <p class="stage-age">Ages {{ stage.ageRange }}</p>
        <p class="tagline">{{ tagline }}</p>
      </div>

      <div class="modal-body">
        <div class="left-col">
          <div class="played-cards">
            <h3 class="section-title">Choices</h3>
            <ul class="card-list">
              <li v-for="card in filteredPlayedCards" :key="card.id" class="card-item">
                <span class="card-name">{{ card.title }}</span>
                <span class="card-effects">{{ getCardEffectIcons(card) }}</span>
              </li>
            </ul>
          </div>

          <div v-if="triggeredEvents.length > 0" class="triggered-events">
            <h3 class="section-title">Events</h3>
            <div v-for="event in triggeredEvents" :key="event.id" class="triggered-event-item">
              <span class="event-title">{{ event.title }}</span>
              <span class="event-effects">{{ getEventEffectSummary(event) }}</span>
            </div>
          </div>

          <div v-if="riskEvents.length > 0" class="risk-events">
            <div v-for="(event, index) in riskEvents" :key="index" class="risk-item">
              ⚠️ {{ event }}
            </div>
          </div>
        </div>

        <div class="right-col">
          <h3 class="section-title">Stats</h3>
          <div class="stat-changes">
            <div
              v-for="stat in statOrder"
              :key="stat"
              class="stat-change"
              :class="statChanges[stat] > 0 ? 'positive' : statChanges[stat] < 0 ? 'negative' : 'neutral'"
            >
              <span class="stat-icon">{{ statIcons[stat] }}</span>
              <span class="stat-value">{{ stats[stat] }}</span>
              <span class="stat-delta" v-if="statChanges[stat] !== 0">
                {{ statChanges[stat] > 0 ? '+' : '' }}{{ statChanges[stat] }}
              </span>
            </div>
          </div>

          <h3 class="section-title finances-title">Finances</h3>
          <div class="finance-changes">
            <div
              class="finance-change"
              :class="statChanges['wealth'] > 0 ? 'positive' : statChanges['wealth'] < 0 ? 'negative' : 'neutral'"
              title="Money left each year"
            >
              <span class="finance-icon">💵</span>
              <span class="finance-label">Cash Flow</span>
              <span class="finance-value">
                {{ yearlyCashFlow >= 0 ? '+' : '' }}{{ formatMoney(yearlyCashFlow) }}/yr
              </span>
              <span class="finance-breakdown">
                = {{ statChanges['wealth'] >= 0 ? '+' : '' }}{{ formatMoney(statChanges['wealth'] || 0) }} over {{ stage.years }} yrs
              </span>
            </div>
            <div
              class="finance-change"
              :class="stats.wealth > 0 ? 'positive' : stats.wealth < 0 ? 'negative' : 'neutral'"
              title="What you own minus what you owe"
            >
              <span class="finance-icon">🏦</span>
              <span class="finance-label">Net Worth</span>
              <span class="finance-value">{{ formatMoney(stats.wealth) }}</span>
            </div>
          </div>
        </div>
      </div>

      <button class="next-btn" @click="emit('nextStage')">
        {{ isLastStage ? 'See Your Life Story' : 'Next Chapter →' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(145deg, #2a2a4a 0%, #1a1a2e 100%);
  border-radius: 16px;
  padding: 1.25rem;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.stage-age {
  color: #888;
  font-size: 0.85rem;
  margin: 0.1rem 0 0 0;
}

.tagline {
  color: #a0a0a0;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

.modal-body {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.left-col {
  flex: 1;
  min-width: 0;
}

.right-col {
  width: 140px;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.played-cards {
  margin-bottom: 0.75rem;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding: 0.35rem 0;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.card-item:last-child {
  border-bottom: none;
}

.card-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
}

.card-effects {
  font-size: 0.8rem;
  opacity: 0.8;
  flex-shrink: 0;
}

.triggered-events {
  margin-bottom: 0.75rem;
}

.triggered-event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
}

.event-title {
  color: #c4b5fd;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
}

.event-effects {
  color: #fff;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.risk-events {
  margin-bottom: 0.5rem;
}

.risk-item {
  color: #fbbf24;
  font-size: 0.75rem;
  padding: 0.3rem 0;
}

.stat-changes {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 0.85rem;
}

.stat-change.positive {
  background: rgba(74, 222, 128, 0.1);
}

.stat-change.negative {
  background: rgba(248, 113, 113, 0.1);
}

.stat-icon {
  font-size: 0.9rem;
}

.stat-value {
  color: #fff;
  font-weight: 600;
  margin-left: auto;
}

.stat-delta {
  font-weight: 600;
  font-size: 0.75rem;
  min-width: 24px;
  text-align: right;
}

.stat-change.positive .stat-delta {
  color: #4ade80;
}

.stat-change.negative .stat-delta {
  color: #f87171;
}

.stat-change.neutral .stat-delta {
  color: #666;
}

.finances-title {
  margin-top: 0.75rem;
}

.finance-changes {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.finance-change {
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 215, 0, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(255, 215, 0, 0.15);
}

.finance-change.positive {
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.2);
}

.finance-change.negative {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.2);
}

.finance-icon {
  font-size: 0.85rem;
}

.finance-label {
  font-size: 0.6rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.finance-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.finance-breakdown {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

.finance-change.positive .finance-value {
  color: #4ade80;
}

.finance-change.negative .finance-value {
  color: #f87171;
}

.next-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(233, 69, 96, 0.4);
}

.next-btn:active {
  transform: translateY(0);
}
</style>
