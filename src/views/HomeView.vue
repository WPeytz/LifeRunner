<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AchievementsModal from '@/components/game/AchievementsModal.vue'
import AuthModal from '@/components/common/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)

const showAchievements = ref(false)
const showAuthModal = ref(false)
const authMode = ref<'signin' | 'signup'>('signin')

function startGame() {
  router.push('/game')
}

function openSignUp() {
  authMode.value = 'signup'
  showAuthModal.value = true
}

function openLogIn() {
  authMode.value = 'signin'
  showAuthModal.value = true
}

function switchAuthMode() {
  authMode.value = authMode.value === 'signin' ? 'signup' : 'signin'
}

async function handleSignOut() {
  await authStore.signOut()
}
</script>

<template>
  <div class="title-screen">
    <AchievementsModal v-if="showAchievements" @close="showAchievements = false" />
    <AuthModal
      v-if="showAuthModal"
      :mode="authMode"
      @close="showAuthModal = false"
      @switch-mode="switchAuthMode"
    />

    <div class="title-content">
      <div class="logo-section">
        <h1 class="game-title">LifeRunner</h1>
        <p class="tagline">Live your best life. Make every choice count.</p>
      </div>

      <div class="menu-buttons">
        <button class="menu-btn primary" @click="startGame">
          Start Game
        </button>
        <button class="menu-btn secondary" @click="showAchievements = true">
          Achievements
        </button>
        <div v-if="isAuthenticated" class="user-section">
          <span class="user-email">{{ user?.email }}</span>
          <button class="menu-btn auth" @click="handleSignOut">
            Sign Out
          </button>
        </div>
        <div v-else class="auth-buttons">
          <button class="menu-btn auth" @click="openSignUp">
            Sign Up
          </button>
          <button class="menu-btn auth" @click="openLogIn">
            Log In
          </button>
        </div>
      </div>

      <div class="footer-info">
        <p class="version">Version: Alpha 0.1</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title-screen {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  padding: 2rem;
}

.title-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 400px;
  width: 100%;
}

.logo-section {
  text-align: center;
}

.game-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #e94560 0%, #f97316 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(233, 69, 96, 0.3);
  letter-spacing: -1px;
}

.tagline {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0.75rem 0 0 0;
  font-weight: 400;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.menu-btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  width: 100%;
}

.menu-btn.primary {
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.3);
}

.menu-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(233, 69, 96, 0.4);
}

.menu-btn.secondary {
  background: rgba(249, 115, 22, 0.2);
  border: 1px solid rgba(249, 115, 22, 0.4);
  color: #f97316;
}

.menu-btn.secondary:hover {
  background: rgba(249, 115, 22, 0.3);
  border-color: rgba(249, 115, 22, 0.6);
  transform: translateY(-2px);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.user-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-email {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  word-break: break-all;
  text-align: center;
}

.menu-btn.auth {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}

.menu-btn.auth:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.footer-info {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
}

.version {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
}
</style>
