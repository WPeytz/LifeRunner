<script setup lang="ts">
import { computed } from 'vue'
import { achievements, rarityColors, type AchievementRarity } from '@/data/achievements'
import { useGameStore } from '@/stores/game'

const emit = defineEmits<{
  close: []
}>()

const gameStore = useGameStore()

const rarityOrder: AchievementRarity[] = ['common', 'rare', 'epic', 'legendary']

const groupedAchievements = computed(() => {
  return rarityOrder.map(rarity => ({
    rarity,
    label: rarity.charAt(0).toUpperCase() + rarity.slice(1),
    achievements: achievements.filter(a => a.rarity === rarity).map(a => ({
      ...a,
      unlocked: gameStore.isAchievementUnlocked(a.id),
    })),
    colors: rarityColors[rarity],
  }))
})

const totalAchievements = computed(() => achievements.length)
const unlockedCount = computed(() => achievements.filter(a => gameStore.isAchievementUnlocked(a.id)).length)
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Achievements</h2>
        <div class="achievement-progress">
          {{ unlockedCount }} / {{ totalAchievements }}
        </div>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <div class="modal-body">
        <div
          v-for="group in groupedAchievements"
          :key="group.rarity"
          class="rarity-section"
        >
          <h3
            class="rarity-title"
            :style="{ color: group.colors.text }"
          >
            {{ group.label }}
          </h3>
          <div class="achievements-grid">
            <div
              v-for="achievement in group.achievements"
              :key="achievement.id"
              class="achievement-card"
              :class="{ locked: !achievement.unlocked }"
              :style="{
                '--bg-color': group.colors.bg,
                '--border-color': group.colors.border,
                '--text-color': group.colors.text,
                '--glow-color': group.colors.glow,
              }"
            >
              <div class="achievement-icon">
                {{ achievement.unlocked ? achievement.icon : '🔒' }}
              </div>
              <div class="achievement-info">
                <div class="achievement-title">{{ achievement.title }}</div>
                <div class="achievement-description">{{ achievement.description }}</div>
              </div>
            </div>
          </div>
        </div>
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
  max-width: 500px;
  max-height: 85vh;
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

.achievement-progress {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
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

.rarity-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rarity-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.achievements-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.achievement-card:not(.locked):hover {
  transform: translateX(4px);
  box-shadow: 0 0 20px var(--glow-color);
}

.achievement-card.locked {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.achievement-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  flex-shrink: 0;
}

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.achievement-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-color);
}

.achievement-card.locked .achievement-title {
  color: rgba(255, 255, 255, 0.5);
}

.achievement-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.3;
}
</style>
