<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGameStore, type LocationEnvironment } from '@/stores/game'
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
import AvatarPortrait from '@/components/avatar/AvatarPortrait.vue'
import HomeBackdrop from '@/components/avatar/HomeBackdrop.vue'
import WorkBackdrop from '@/components/avatar/WorkBackdrop.vue'
import LifestyleBackdrop from '@/components/avatar/LifestyleBackdrop.vue'
import ExpenseItemsOverlay from '@/components/avatar/ExpenseItemsOverlay.vue'

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
  activeTopLevelCategory,
  committedLocationScene,
  committedCountryId,
  eliteSchoolApplications,
} = storeToRefs(gameStore)

const showTutorial = ref(false)
const highlightedCardId = ref<string | null>(null)
const showSummary = ref(false)
const showResume = ref(false)
const showAchievements = ref(false)

const countryFlags: Record<string, string> = {
  country_canada: '🇨🇦',
  country_china: '🇨🇳',
  country_brazil: '🇧🇷',
  country_australia: '🇦🇺',
  country_india: '🇮🇳',
  country_argentina: '🇦🇷',
  country_mexico: '🇲🇽',
  country_indonesia: '🇮🇩',
  country_germany: '🇩🇪',
  country_france: '🇫🇷',
  country_uk: '🇬🇧',
  country_italy: '🇮🇹',
  country_spain: '🇪🇸',
  country_denmark: '🇩🇰',
}

const selectedCountry = computed(() =>
  locationSelections.value.find(card => card.id.startsWith('country_')),
)

const locationScene = computed<LocationEnvironment>(() => {
  const ids = locationSelections.value.map(card => card.id)
  if (ids.some(id => id === 'loc_countryside')) return 'countryside'
  if (ids.some(id => id === 'loc_suburb')) return 'suburb'
  if (ids.some(id => id === 'loc_city' || id.startsWith('city_'))) return 'city'
  if (ids.some(id => id === 'loc_abroad' || id.startsWith('country_'))) return 'country'
  return committedLocationScene.value
})

type BackdropScene =
  | LocationEnvironment
  | 'community-college'
  | 'university'
  | 'harvard'
  | 'mit'
  | 'trade-school'
  | 'self-study'
  | 'self-coding'
  | 'self-language'
  | 'self-cooking'
  | 'self-music'
  | 'self-photography'
  | 'workplace'

type JobTheme =
  | 'generic' | 'retail' | 'restaurant' | 'cafe' | 'warehouse' | 'call-center'
  | 'office' | 'tech' | 'healthcare' | 'finance' | 'education' | 'engineering'
  | 'electrician' | 'plumber' | 'mechanic' | 'legal' | 'casino' | 'film'
  | 'government' | 'driving' | 'marketing' | 'laboratory' | 'nonprofit' | 'remote'

type TradeFocus = '' | 'electrician' | 'plumber' | 'hvac' | 'welder' | 'automotive'

type LifestyleScene =
  | 'housing-parents' | 'housing-roommates' | 'housing-budget' | 'housing-nice' | 'housing-home'
  | 'transport-walk' | 'transport-public' | 'transport-used' | 'transport-new' | 'transport-luxury'

const tradeFocus = computed<TradeFocus>(() => {
  const ids = educationSelections.value.map(card => card.id)
  if (ids.includes('trade_electrician')) return 'electrician'
  if (ids.includes('trade_plumber')) return 'plumber'
  if (ids.includes('trade_hvac')) return 'hvac'
  if (ids.includes('trade_welding')) return 'welder'
  if (ids.includes('trade_automotive')) return 'automotive'
  return ''
})

const educationScene = computed<BackdropScene | null>(() => {
  const ids = educationSelections.value.map(card => card.id)
  if (ids.includes('self_coding')) return 'self-coding'
  if (ids.includes('self_language')) return 'self-language'
  if (ids.includes('self_cooking')) return 'self-cooking'
  if (ids.includes('self_music')) return 'self-music'
  if (ids.includes('self_photography')) return 'self-photography'
  if (ids.includes('edu_self')) return 'self-study'
  if (
    eliteSchoolApplications.value.edu_harvard === 'admitted' &&
    ids.some(id => id === 'edu_harvard' || id.startsWith('harvard_'))
  ) return 'harvard'
  if (
    eliteSchoolApplications.value.edu_mit === 'admitted' &&
    ids.some(id => id === 'edu_mit' || id.startsWith('mit_'))
  ) return 'mit'
  if (ids.some(id => id === 'edu_community' || id.startsWith('cc_'))) return 'community-college'
  if (ids.some(id =>
    id === 'edu_university' ||
    id === 'edu_graduate' ||
    id.startsWith('uni_') ||
    id.startsWith('grad_')
  )) return 'university'
  if (ids.some(id => id === 'edu_trade' || id.startsWith('trade_'))) return 'trade-school'
  return null
})

const jobTheme = computed<JobTheme | null>(() => {
  const ids = incomeSelections.value.map(card => card.id)
  if (ids.includes('work_none')) return null

  const selectedJob = [...ids].reverse().find(id =>
    id.startsWith('job_') || id.startsWith('pt_') || id.startsWith('intern_')
  )

  if (!selectedJob) {
    return ids.some(id => ['income_work', 'full_time_job', 'part_time_job', 'internship'].includes(id))
      ? 'generic'
      : null
  }

  if (['job_retail', 'pt_retail'].includes(selectedJob)) return 'retail'
  if (selectedJob === 'job_fastfood') return 'restaurant'
  if (selectedJob === 'pt_barista') return 'cafe'
  if (selectedJob === 'job_warehouse') return 'warehouse'
  if (selectedJob === 'job_callcenter') return 'call-center'
  if (['job_office', 'job_sales', 'job_executive'].includes(selectedJob)) return 'office'
  if (
    selectedJob === 'job_technician' ||
    selectedJob === 'job_startup_founder' ||
    selectedJob === 'job_big_tech' ||
    selectedJob === 'intern_tech' ||
    selectedJob.startsWith('job_tech')
  ) return 'tech'
  if (selectedJob === 'job_doctor' || selectedJob.startsWith('job_nurse')) return 'healthcare'
  if (selectedJob === 'job_wall_street' || selectedJob === 'intern_finance' || selectedJob.startsWith('job_accountant')) return 'finance'
  if (selectedJob === 'job_professor' || selectedJob === 'pt_tutor' || selectedJob.startsWith('job_teacher')) return 'education'
  if (selectedJob.startsWith('job_engineer')) return 'engineering'
  if (selectedJob.startsWith('job_electrician')) return 'electrician'
  if (selectedJob.startsWith('job_plumber')) return 'plumber'
  if (selectedJob.startsWith('job_mechanic')) return 'mechanic'
  if (selectedJob === 'job_lawyer') return 'legal'
  if (selectedJob === 'job_poker_player') return 'casino'
  if (selectedJob === 'job_actor') return 'film'
  if (selectedJob === 'job_politician') return 'government'
  if (selectedJob === 'pt_rideshare') return 'driving'
  if (selectedJob === 'pt_freelance') return 'remote'
  if (selectedJob === 'intern_marketing') return 'marketing'
  if (selectedJob === 'intern_research') return 'laboratory'
  if (selectedJob === 'intern_nonprofit') return 'nonprofit'
  return 'generic'
})

const housingScene = computed<LifestyleScene>(() => {
  const ids = expenseSelections.value.map(card => card.id)
  if (ids.includes('housing_parents')) return 'housing-parents'
  if (ids.includes('housing_roommates')) return 'housing-roommates'
  if (ids.includes('housing_rent_nice')) return 'housing-nice'
  if (ids.includes('housing_mortgage')) return 'housing-home'
  return 'housing-budget'
})

const lifestyleScene = computed<LifestyleScene | null>(() => {
  if (selectionPhase.value !== 'expenses') return null

  const ids = expenseSelections.value.map(card => card.id)
  if (activeTopLevelCategory.value === 'expense_housing') {
    return housingScene.value
  }

  if (activeTopLevelCategory.value === 'expense_transport') {
    if (ids.includes('transport_walk')) return 'transport-walk'
    if (ids.includes('transport_public')) return 'transport-public'
    if (ids.includes('transport_new_car')) return 'transport-new'
    if (ids.includes('transport_luxury')) return 'transport-luxury'
    return 'transport-used'
  }

  if (['expense_food', 'expense_insurance', 'expense_fun', 'expense_other'].includes(activeTopLevelCategory.value ?? '')) {
    return housingScene.value
  }

  return null
})

const expenseItemsTheme = computed(() => {
  if (selectionPhase.value !== 'expenses') return ''

  const categoryPrefixes: Record<string, string> = {
    expense_food: 'food_',
    expense_insurance: 'insurance_',
    expense_fun: 'fun_',
    expense_other: 'other_',
  }
  const prefix = categoryPrefixes[activeTopLevelCategory.value ?? '']
  if (!prefix) return ''

  return expenseSelections.value.find(card => card.id.startsWith(prefix))?.id ?? ''
})

const backdropScene = computed<BackdropScene>(() => {
  if (jobTheme.value) return 'workplace'
  return educationScene.value ?? locationScene.value
})

const selectedCountryFlag = computed(() => {
  if (selectedCountry.value) return countryFlags[selectedCountry.value.id] ?? ''

  const isPreviewingNewCountry = locationSelections.value.some(card => card.id === 'loc_abroad')
  if (isPreviewingNewCountry || locationScene.value !== 'country') return ''

  return committedCountryId.value ? countryFlags[committedCountryId.value] ?? '' : ''
})

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

    <div class="game-shell" v-if="phase === 'choosing'">
      <aside class="avatar-panel">
        <LifestyleBackdrop
          v-if="lifestyleScene && lifestyleScene !== 'housing-parents'"
          class="game-home"
          :scene="lifestyleScene"
        />
        <HomeBackdrop
          v-else-if="lifestyleScene === 'housing-parents'"
          class="game-home"
          scene="home"
        />
        <WorkBackdrop
          v-else-if="backdropScene === 'workplace'"
          class="game-home"
          :theme="jobTheme ?? 'generic'"
        />
        <HomeBackdrop
          v-else
          class="game-home"
          :scene="backdropScene"
          :country-flag="selectedCountryFlag"
          :trade-focus="tradeFocus"
        />
        <ExpenseItemsOverlay v-if="expenseItemsTheme" :theme="expenseItemsTheme" />
        <div class="avatar-stage-copy">
          <span class="avatar-kicker">Your LifeRun</span>
          <span class="stage-name">{{ currentStage.name }}</span>
          <span class="stage-age">Ages {{ currentStage.ageRange }}</span>
        </div>
        <div class="avatar-wrap">
          <AvatarPortrait :size="310" />
        </div>
        <div class="header-buttons">
          <button class="resume-btn" @click="showResume = true">
            📄 Resume
          </button>
          <button class="achievements-btn" @click="showAchievements = true">
            🏆 Achievements
          </button>
        </div>
      </aside>

      <section class="game-container">
        <header class="top-bar">
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
      </section>
    </div>

    <div class="footer-info">
      <a v-if="false" href="https://discord.gg/CXa4wJJgrc" target="_blank" class="discord-link">Join the Discord to give feedback</a>
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
  padding: 0;
  overflow: hidden;
}

.game-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: 100%;
  min-height: 100vh;
}

.avatar-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 100vh;
  padding: 2rem;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, rgba(233, 69, 96, 0.18), transparent 42%),
    linear-gradient(145deg, rgba(7, 12, 29, 0.92), rgba(24, 37, 73, 0.72));
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar-panel::after {
  content: '';
  position: absolute;
  bottom: 7%;
  width: min(72%, 430px);
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.24);
  filter: blur(12px);
}

.game-home {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.82;
}

.avatar-stage-copy {
  position: absolute;
  z-index: 2;
  top: 2rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(11, 16, 35, 0.7);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
}

.avatar-kicker {
  margin-bottom: 0.3rem;
  color: #f97316;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.avatar-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: min(78vh, 680px);
  width: 100%;
}

.avatar-panel .header-buttons {
  position: absolute;
  z-index: 2;
  bottom: 1.5rem;
}

.game-container {
  width: 100%;
  max-height: 100vh;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
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
  gap: 0.25rem;
  max-width: 100%;
}

.phase-tab {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.5rem;
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

@media (max-width: 1050px) {
  .phase-label,
  .phase-arrow {
    display: none;
  }

  .phase-tab {
    padding: 0.45rem 0.65rem;
  }
}

@media (max-width: 760px) {
  .game-view {
    overflow-y: auto;
  }

  .game-shell {
    grid-template-columns: 1fr;
  }

  .avatar-panel {
    min-height: 70vh;
    height: 70vh;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .avatar-wrap {
    height: 58vh;
  }

  .avatar-stage-copy {
    top: 1.25rem;
    left: 1.25rem;
  }

  .avatar-panel .header-buttons {
    bottom: 0.8rem;
  }

  .game-container {
    max-height: none;
    min-height: 100vh;
    overflow: visible;
  }

  .phase-label,
  .phase-arrow {
    display: inline;
  }
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
