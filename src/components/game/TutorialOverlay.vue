<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: []
  highlightCard: [cardId: string | null]
}>()

const step = ref(0)
const visible = ref(true)

const steps = [
  {
    message: "This year… You have 5 Life Energy.",
    highlight: 'energy'
  },
  {
    message: "Choose a card to shape your life.",
    highlight: 'cards'
  },
  {
    message: "Tap to select!",
    highlight: 'first-card'
  }
]

function nextStep() {
  if (step.value < steps.length - 1) {
    step.value++
    if (step.value === 2) {
      emit('highlightCard', 'study_cs')
    }
  } else {
    visible.value = false
    emit('highlightCard', null)
    emit('complete')
  }
}

onMounted(() => {
  // Auto-advance first step after a moment
  setTimeout(() => {
    // User can tap to advance
  }, 500)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="tutorial-overlay" @click="nextStep">
      <div class="tutorial-content">
        <div class="step-indicator">
          <span
            v-for="(_, i) in steps"
            :key="i"
            class="dot"
            :class="{ active: i === step, completed: i < step }"
          />
        </div>

        <p class="tutorial-message">
          {{ steps[step].message }}
        </p>

        <div class="tap-hint">
          <span class="tap-text">Tap to continue</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.tutorial-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: pointer;
}

.tutorial-content {
  text-align: center;
  padding: 2rem;
  max-width: 320px;
}

.step-indicator {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.dot.active {
  background: #ffd700;
  transform: scale(1.3);
}

.dot.completed {
  background: #4ade80;
}

.tutorial-message {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.4;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tap-hint {
  margin-top: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

.tap-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
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
