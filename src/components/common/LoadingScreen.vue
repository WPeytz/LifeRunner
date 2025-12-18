<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const showTagline = ref(false)
const fadeOut = ref(false)

onMounted(() => {
  // Show tagline after logo animates
  setTimeout(() => {
    showTagline.value = true
  }, 500)

  // Start fade out after 1.5 seconds
  setTimeout(() => {
    fadeOut.value = true
  }, 1500)

  // Emit complete after fade animation
  setTimeout(() => {
    emit('complete')
  }, 2000)
})
</script>

<template>
  <div class="loading-screen" :class="{ 'fade-out': fadeOut }">
    <div class="content">
      <h1 class="logo">
        <span class="life">Life</span><span class="runner">Runner</span>
      </h1>
      <p class="tagline" :class="{ visible: showTagline }">
        Every choice shapes your life
      </p>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: 9999;
  transition: opacity 0.5s ease-out;
}

.loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.content {
  text-align: center;
}

.logo {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  animation: slideUp 0.6s ease-out;
}

.life {
  color: #e94560;
}

.runner {
  color: #ffffff;
}

.tagline {
  font-size: 1.25rem;
  color: #a0a0a0;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.tagline.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
