<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { getCardById } from '@/data/cards'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const emit = defineEmits<{
  close: []
}>()

const gameStore = useGameStore()
const { resumeHistory, stats, currentLocation } = storeToRefs(gameStore)

// Get the current location card title
const currentLocationTitle = computed(() => {
  if (!currentLocation.value) return null
  const card = getCardById(currentLocation.value)
  return card?.title || null
})

// Separate education and work entries
const educationEntries = computed(() =>
  resumeHistory.value.filter(entry => entry.type === 'education')
)

const workEntries = computed(() =>
  resumeHistory.value.filter(entry => entry.type === 'work')
)

// Check if resume is empty (excluding location which is always set)
const isEmpty = computed(() => resumeHistory.value.length === 0)
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Resume</h2>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <div class="modal-body">
        <!-- Skills Summary - always show -->
        <div class="resume-section skills-section">
          <h3 class="section-title">Skills Level</h3>
          <div class="skills-badge">
            <span class="skills-icon">🧠</span>
            <span class="skills-value">{{ stats.skills }}</span>
          </div>
        </div>

        <!-- Current Location - always show -->
        <div class="resume-section location-section" v-if="currentLocationTitle">
          <h3 class="section-title">Current Location</h3>
          <div class="location-badge">
            <span class="location-icon">📍</span>
            <span class="location-value">{{ currentLocationTitle }}</span>
          </div>
        </div>

        <div v-if="isEmpty" class="empty-state">
          <p>No education or work experience yet.</p>
          <p class="empty-hint">Complete life stages to build your resume!</p>
        </div>

        <template v-else>
          <!-- Education Section -->
          <div class="resume-section" v-if="educationEntries.length > 0">
            <h3 class="section-title">
              <span class="section-icon">🎓</span>
              Education
            </h3>
            <div class="entries">
              <div
                v-for="(entry, index) in educationEntries"
                :key="`edu-${index}`"
                class="entry"
              >
                <div class="entry-title">
                  <template v-if="entry.parentTitle">
                    {{ entry.parentTitle }}: {{ entry.cardTitle }}
                  </template>
                  <template v-else>
                    {{ entry.cardTitle }}
                  </template>
                </div>
                <div class="entry-details">
                  <span class="entry-stage">{{ entry.stageName }}</span>
                  <span class="entry-age">Ages {{ entry.ageRange }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Work Experience Section -->
          <div class="resume-section" v-if="workEntries.length > 0">
            <h3 class="section-title">
              <span class="section-icon">💼</span>
              Work Experience
            </h3>
            <div class="entries">
              <div
                v-for="(entry, index) in workEntries"
                :key="`work-${index}`"
                class="entry"
              >
                <div class="entry-title">
                  <template v-if="entry.parentTitle">
                    {{ entry.parentTitle }}: {{ entry.cardTitle }}
                  </template>
                  <template v-else>
                    {{ entry.cardTitle }}
                  </template>
                </div>
                <div class="entry-details">
                  <span class="entry-stage">{{ entry.stageName }}</span>
                  <span class="entry-age">Ages {{ entry.ageRange }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
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
  padding: 1.5rem;
  width: 100%;
  max-width: 450px;
  max-height: 80vh;
  overflow-y: auto;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-hint {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
}

.resume-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1rem;
}

.skills-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.skills-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skills-icon {
  font-size: 1.25rem;
}

.skills-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #a78bfa;
}

.location-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-icon {
  font-size: 1.25rem;
}

.location-value {
  font-size: 1rem;
  font-weight: 600;
  color: #60a5fa;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
}

.skills-section .section-title,
.location-section .section-title {
  margin: 0;
}

.section-icon {
  font-size: 1rem;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.entry {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  border-left: 3px solid #e94560;
}

.resume-section:last-child .entry {
  border-left-color: #4ade80;
}

.entry-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.entry-details {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.entry-stage {
  color: rgba(255, 255, 255, 0.6);
}

.entry-age {
  color: rgba(255, 255, 255, 0.4);
}
</style>
