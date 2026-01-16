<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingScreen from './components/common/LoadingScreen.vue'
import AuthModal from './components/common/AuthModal.vue'
import { useGameStore } from './stores/game'
import { useAuthStore } from './stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const gameStore = useGameStore()
const authStore = useAuthStore()
const { user, isAuthenticated, isPremium } = storeToRefs(authStore)
const isLoading = ref(true)

// Auth modal state
const showAuthModal = ref(false)
const authMode = ref<'signin' | 'signup'>('signin')

// Music state
const isMusicPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

// Settings dropdown state
const isSettingsOpen = ref(false)

function onLoadingComplete() {
  isLoading.value = false
  router.push('/')
}

function toggleMusic() {
  if (!audioRef.value) return

  if (isMusicPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play().catch(() => {
      // Browser blocked autoplay, user needs to interact first
    })
  }
  isMusicPlaying.value = !isMusicPlaying.value
}

function toggleSettings() {
  isSettingsOpen.value = !isSettingsOpen.value
}

function closeSettings() {
  isSettingsOpen.value = false
}

function handleMainMenu() {
  router.push('/')
  closeSettings()
}

function handleSignUp() {
  authMode.value = 'signup'
  showAuthModal.value = true
  closeSettings()
}

function handleLogIn() {
  authMode.value = 'signin'
  showAuthModal.value = true
  closeSettings()
}

function switchAuthMode() {
  authMode.value = authMode.value === 'signin' ? 'signup' : 'signin'
}

async function handleSignOut() {
  await authStore.signOut()
  closeSettings()
}

function handleFeedback() {
  window.open('https://github.com/anthropics/claude-code/issues', '_blank')
  closeSettings()
}

function handleBuyFullVersion() {
  const stripeUrl = import.meta.env.VITE_STRIPE_PAYMENT_LINK
  if (!stripeUrl) {
    alert('Payment link not configured')
    return
  }

  // Build URL with user info for tracking
  const url = new URL(stripeUrl)

  // Pass user ID so Stripe webhook can identify who purchased
  if (user.value?.id) {
    url.searchParams.set('client_reference_id', user.value.id)
  }

  // Pre-fill email if user is logged in
  if (user.value?.email) {
    url.searchParams.set('prefilled_email', user.value.email)
  }

  window.open(url.toString(), '_blank')
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.settings-container')) {
    closeSettings()
  }
}

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.3
  }
  document.addEventListener('click', handleClickOutside)
  authStore.initialize()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <LoadingScreen v-if="isLoading" @complete="onLoadingComplete" />
  <router-view v-else />

  <!-- Auth Modal -->
  <AuthModal
    v-if="showAuthModal"
    :mode="authMode"
    @close="showAuthModal = false"
    @switch-mode="switchAuthMode"
  />

  <!-- Background Music -->
  <audio ref="audioRef" loop>
    <source src="/music/background.mp3" type="audio/mpeg" />
  </audio>

  <!-- Upgrade Button (hidden for premium users) -->
  <button v-if="!isLoading && !isPremium" class="buy-full-version" @click="handleBuyFullVersion">
    Upgrade LifeRunner
  </button>

  <!-- Premium Badge -->
  <div v-if="!isLoading && isPremium" class="premium-badge">
    Premium
  </div>

  <!-- Music Toggle Button -->
  <button
    v-if="!isLoading"
    class="music-toggle"
    @click="toggleMusic"
    :title="isMusicPlaying ? 'Pause Music' : 'Play Music'"
  >
    {{ isMusicPlaying ? '🔊' : '🔇' }}
  </button>

  <!-- Settings Button -->
  <div v-if="!isLoading" class="settings-container">
    <button
      class="settings-toggle"
      @click.stop="toggleSettings"
      title="Settings"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </button>

    <div v-if="isSettingsOpen" class="settings-dropdown">
      <button class="dropdown-item" @click="handleMainMenu">
        <span class="dropdown-icon">🏠</span>
        Main Menu
      </button>
      <template v-if="isAuthenticated">
        <div class="dropdown-user">{{ user?.email }}</div>
        <button class="dropdown-item" @click="handleSignOut">
          <span class="dropdown-icon">🚪</span>
          Sign Out
        </button>
      </template>
      <template v-else>
        <button class="dropdown-item" @click="handleSignUp">
          <span class="dropdown-icon">✨</span>
          Sign Up
        </button>
        <button class="dropdown-item" @click="handleLogIn">
          <span class="dropdown-icon">👤</span>
          Log In
        </button>
      </template>
      <div class="dropdown-divider"></div>
      <button class="dropdown-item" @click="handleFeedback">
        <span class="dropdown-icon">💬</span>
        Give Feedback
      </button>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.music-toggle {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(30, 30, 50, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-toggle:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(40, 40, 70, 0.95);
}

.music-toggle:active {
  transform: scale(0.95);
}

/* Settings Button */
.settings-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

.settings-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(30, 30, 50, 0.9);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-toggle:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(40, 40, 70, 0.95);
  color: #fff;
}

.settings-toggle:active {
  transform: scale(0.95);
}

.settings-toggle svg {
  transition: transform 0.3s ease;
}

.settings-toggle:hover svg {
  transform: rotate(45deg);
}

/* Settings Dropdown */
.settings-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 180px;
  background: rgba(30, 30, 50, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.dropdown-item:active {
  background: rgba(255, 255, 255, 0.15);
}

.dropdown-icon {
  font-size: 1rem;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.4rem 0;
}

.dropdown-user {
  padding: 0.5rem 0.85rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  word-break: break-all;
}

/* Premium Badge */
.premium-badge {
  position: fixed;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4a 100%);
  color: #000;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
  z-index: 50;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Buy Full Version Button */
.buy-full-version {
  position: fixed;
  top: 1rem;
  left: 1rem;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.buy-full-version:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.buy-full-version:active {
  transform: translateY(0);
}
</style>
