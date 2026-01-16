<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import StatsBar from '@/components/game/StatsBar.vue'
import ManaBar from '@/components/game/ManaBar.vue'
import FinanceBar from '@/components/game/FinanceBar.vue'
import Hand from '@/components/game/Hand.vue'
import TutorialOverlay from '@/components/game/TutorialOverlay.vue'
import StageResultsModal from '@/components/game/StageResultsModal.vue'
import GameOverScreen from '@/components/game/GameOverScreen.vue'
import EventsAnimation from '@/components/game/EventsAnimation.vue'
import ResumeModal from '@/components/game/ResumeModal.vue'
import AchievementsModal from '@/components/game/AchievementsModal.vue'

const gameStore = useGameStore()
const {
  phase,
  selectionPhase,
  lastPlayedCards,
  lastStatChanges,
  lastRiskEvents,
  lastTriggeredEvents,
  stageRandomEvents,
  currentStage,
  isLastStage,
  canGoNext,
  hasQualifyingEducation,
  locationSelections,
  educationSelections,
  incomeSelections,
  expenseSelections,
  decisionSelections,
  previousExpenseSelections,
} = storeToRefs(gameStore)

const showTutorial = ref(false)
const highlightedCardId = ref<string | null>(null)
const showSummary = ref(false)
const showResume = ref(false)
const showAchievements = ref(false)

onMounted(() => {
  if (phase.value === 'idle') {
    gameStore.startNewGame()
  }
})

const hasAnySelections = computed(() => {
  return locationSelections.value.length > 0 ||
         educationSelections.value.length > 0 ||
         incomeSelections.value.length > 0 ||
         expenseSelections.value.length > 0 ||
         decisionSelections.value.length > 0
})

// Group decision selections by top-level category
const groupedDecisions = computed(() => {
  const groups: { category: string; cards: typeof decisionSelections.value }[] = []
  const categoryOrder = ['decision_career', 'decision_social', 'decision_health', 'decision_values']
  const categoryLabels: Record<string, string> = {
    'decision_career': 'Career',
    'decision_social': 'Social Life',
    'decision_health': 'Health',
    'decision_values': 'Values',
  }

  for (const categoryId of categoryOrder) {
    // Find cards that belong to this category (either the category itself or its descendants)
    const categoryCards = decisionSelections.value.filter(card => {
      if (card.id === categoryId) return true
      if (card.parentId === categoryId) return true
      // Check if it's a deeper descendant
      const parent = decisionSelections.value.find(c => c.id === card.parentId)
      if (parent && parent.parentId === categoryId) return true
      return false
    })

    if (categoryCards.length > 0) {
      groups.push({
        category: categoryLabels[categoryId] || categoryId,
        cards: categoryCards,
      })
    }
  }

  return groups
})

function goToSummary() {
  showSummary.value = true
}

function backFromSummary() {
  showSummary.value = false
}


const showEvents = computed(() => phase.value === 'events')
const showResults = computed(() => phase.value === 'resolving')
const showGameOver = computed(() => phase.value === 'ended')

function onEventsComplete() {
  gameStore.finishEventsAnimation()
}

const phaseLabels: Record<string, string> = {
  location: 'Choose Location',
  education: 'Choose Education',
  income: 'Choose Income',
  expenses: 'Choose Expenses',
  decisions: 'Life Decisions',
}

const phaseEmojis: Record<string, string> = {
  location: '📍',
  education: '📚',
  income: '💰',
  expenses: '💸',
  decisions: '🎯',
}

function onTutorialComplete() {
  showTutorial.value = false
}

function onHighlightCard(cardId: string | null) {
  highlightedCardId.value = cardId
}

function onNextStage() {
  showSummary.value = false
  gameStore.advanceToNextStage()
}

function onPlayAgain() {
  showSummary.value = false
  gameStore.startNewGame()
}
</script>

<template>
  <main class="game-view">
    <TutorialOverlay
      v-if="showTutorial && phase === 'choosing'"
      @complete="onTutorialComplete"
      @highlight-card="onHighlightCard"
    />

    <EventsAnimation
      v-if="showEvents"
      :events="stageRandomEvents"
      :stage-years="currentStage.years"
      @complete="onEventsComplete"
    />

    <StageResultsModal
      v-if="showResults"
      :stage="currentStage"
      :played-cards="lastPlayedCards"
      :stat-changes="lastStatChanges"
      :risk-events="lastRiskEvents"
      :triggered-events="lastTriggeredEvents"
      :is-last-stage="isLastStage"
      @next-stage="onNextStage"
    />

    <GameOverScreen
      v-if="showGameOver"
      @play-again="onPlayAgain"
    />

    <ResumeModal v-if="showResume" @close="showResume = false" />
    <AchievementsModal v-if="showAchievements" @close="showAchievements = false" />

    <div class="game-container" v-if="phase === 'choosing'">
      <header class="top-bar">
        <div class="stage-info">
          <span class="stage-name">{{ currentStage.name }}</span>
          <span class="stage-age">Ages {{ currentStage.ageRange }}</span>
          <div class="header-buttons">
            <button class="resume-btn" @click="showResume = true">
              📄 Resume
            </button>
            <button class="achievements-btn" @click="showAchievements = true">
              🏆 Achievements
            </button>
          </div>
        </div>
        <StatsBar />
        <ManaBar />
      </header>

      <div class="finance-section">
        <FinanceBar />
      </div>

      <!-- Phase Indicator -->
      <div class="phase-section">
        <div class="phase-tabs">
          <div
            class="phase-tab"
            :class="{ active: selectionPhase === 'location', completed: selectionPhase !== 'location' }"
          >
            <span class="phase-emoji">📍</span>
            <span class="phase-label">Location</span>
            <span v-if="selectionPhase !== 'location'" class="phase-check">✓</span>
          </div>
          <div class="phase-arrow">→</div>
          <div
            class="phase-tab"
            :class="{ active: selectionPhase === 'education', completed: !['location', 'education'].includes(selectionPhase) }"
          >
            <span class="phase-emoji">📚</span>
            <span class="phase-label">Education</span>
            <span v-if="!['location', 'education'].includes(selectionPhase)" class="phase-check">✓</span>
          </div>
          <div class="phase-arrow">→</div>
          <div
            class="phase-tab"
            :class="{ active: selectionPhase === 'income', completed: !['location', 'education', 'income'].includes(selectionPhase) }"
          >
            <span class="phase-emoji">💰</span>
            <span class="phase-label">Income</span>
            <span v-if="!['location', 'education', 'income'].includes(selectionPhase)" class="phase-check">✓</span>
          </div>
          <div class="phase-arrow">→</div>
          <div
            class="phase-tab"
            :class="{ active: selectionPhase === 'expenses', completed: !['location', 'education', 'income', 'expenses'].includes(selectionPhase) }"
          >
            <span class="phase-emoji">💸</span>
            <span class="phase-label">Expenses</span>
            <span v-if="!['location', 'education', 'income', 'expenses'].includes(selectionPhase)" class="phase-check">✓</span>
          </div>
          <div class="phase-arrow">→</div>
          <div
            class="phase-tab"
            :class="{ active: selectionPhase === 'decisions' }"
          >
            <span class="phase-emoji">🎯</span>
            <span class="phase-label">Decisions</span>
          </div>
        </div>
        <div class="phase-title-row">
          <div class="phase-title">
            {{ phaseEmojis[selectionPhase] }} {{ phaseLabels[selectionPhase] }}
          </div>
          <button
            v-if="selectionPhase === 'expenses' && previousExpenseSelections.length > 0"
            class="same-as-last-btn"
            @click="gameStore.copyPreviousExpenses()"
          >
            Same as last stage
          </button>
        </div>
      </div>

      <section class="main-area" v-if="!showSummary">
        <Hand :highlighted-card-id="highlightedCardId" />
      </section>

      <!-- Summary Screen -->
      <section class="main-area summary-area" v-if="showSummary">
        <div class="summary-container">
          <h2 class="summary-title">Your Choices This Year</h2>

          <div class="summary-section" v-if="locationSelections.length > 0">
            <h3 class="summary-section-title">📍 Location</h3>
            <div class="summary-cards">
              <div v-for="card in locationSelections" :key="card.id" class="summary-card">
                {{ card.title }}
              </div>
            </div>
          </div>

          <div class="summary-section" v-if="educationSelections.length > 0">
            <h3 class="summary-section-title">📚 Education</h3>
            <div class="summary-cards">
              <div v-for="card in educationSelections" :key="card.id" class="summary-card">
                {{ card.title }}
              </div>
            </div>
          </div>

          <div class="summary-section" v-if="incomeSelections.length > 0">
            <h3 class="summary-section-title">💰 Income</h3>
            <div class="summary-cards">
              <div v-for="card in incomeSelections" :key="card.id" class="summary-card">
                {{ card.title }}
              </div>
            </div>
          </div>

          <div class="summary-section" v-if="expenseSelections.length > 0">
            <h3 class="summary-section-title">💸 Expenses</h3>
            <div class="summary-cards">
              <div v-for="card in expenseSelections" :key="card.id" class="summary-card">
                {{ card.title }}
              </div>
            </div>
          </div>

          <div class="summary-section" v-if="decisionSelections.length > 0">
            <h3 class="summary-section-title">🎯 Decisions</h3>
            <div class="decision-groups">
              <div v-for="group in groupedDecisions" :key="group.category" class="decision-group">
                <span class="decision-category">{{ group.category }}:</span>
                <div class="summary-cards">
                  <div v-for="card in group.cards" :key="card.id" class="summary-card">
                    {{ card.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!hasAnySelections" class="no-selections">
            No choices made yet. Go back and make some selections!
          </div>
        </div>
      </section>

      <footer class="bottom-bar">
        <button
          v-if="canGoNext && !showSummary && selectionPhase !== 'decisions'"
          class="nav-btn next-btn"
          @click="gameStore.nextPhase"
        >
          Next →
        </button>

        <button
          v-if="selectionPhase === 'decisions' && !showSummary"
          class="nav-btn next-btn"
          @click="goToSummary"
        >
          Next →
        </button>

        <button
          v-if="showSummary"
          class="nav-btn back-btn"
          @click="backFromSummary"
        >
          ← Back to Decisions
        </button>

        <button
          v-if="showSummary"
          class="play-stage-btn"
          :class="{ disabled: !hasAnySelections }"
          :disabled="!hasAnySelections"
          @click="gameStore.playStage"
        >
          Live This Chapter
        </button>
      </footer>
    </div>

    <div class="footer-info">
      <a href="https://discord.gg/CXa4wJJgrc" target="_blank" class="discord-link">Join the Discord to give feedback</a>
      <p class="version">Version: Alpha 0.1</p>
    </div>
  </main>
</template>

<style scoped>
.game-view {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  padding: 1rem;
  overflow: hidden;
}

.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.top-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.stage-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.25rem;
}

.stage-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.stage-age {
  font-size: 0.85rem;
  color: #888;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.resume-btn {
  padding: 0.35rem 0.75rem;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 8px;
  color: #a78bfa;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resume-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.6);
  transform: translateY(-1px);
}

.achievements-btn {
  padding: 0.35rem 0.75rem;
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.4);
  border-radius: 8px;
  color: #f97316;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.achievements-btn:hover {
  background: rgba(249, 115, 22, 0.3);
  border-color: rgba(249, 115, 22, 0.6);
  transform: translateY(-1px);
}

.finance-section {
  display: flex;
  justify-content: center;
}

/* Phase Section */
.phase-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.phase-tabs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.phase-tab {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.5;
  transition: all 0.3s ease;
  color: #fff;
  font-family: inherit;
}

.phase-tab.active {
  opacity: 1;
  background: rgba(233, 69, 96, 0.2);
  border-color: #e94560;
}

.phase-tab.completed {
  opacity: 0.8;
  background: rgba(74, 222, 128, 0.1);
  border-color: rgba(74, 222, 128, 0.3);
}

.phase-emoji {
  font-size: 1rem;
}

.phase-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.phase-check {
  color: #4ade80;
  font-size: 0.75rem;
  font-weight: 700;
}

.phase-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
}

.phase-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.phase-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.same-as-last-btn {
  padding: 0.35rem 0.75rem;
  background: rgba(74, 222, 128, 0.15);
  border: 1px solid rgba(74, 222, 128, 0.4);
  border-radius: 8px;
  color: #4ade80;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.same-as-last-btn:hover {
  background: rgba(74, 222, 128, 0.25);
  border-color: rgba(74, 222, 128, 0.6);
  transform: translateY(-1px);
}

.main-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.play-stage-btn {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-stage-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(233, 69, 96, 0.4);
}

.play-stage-btn.disabled {
  background: linear-gradient(135deg, #444 0%, #333 100%);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Summary Screen */
.summary-area {
  overflow-y: auto;
}

.summary-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #fff;
}

.decision-groups {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.decision-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.decision-category {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.no-selections {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem;
  font-size: 1rem;
}

.footer-info {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;
}

.discord-link {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease;
}

.discord-link:hover {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline;
}

.version {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
}
</style>
