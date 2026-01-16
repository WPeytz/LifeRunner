<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  mode: 'signin' | 'signup'
}>()

const emit = defineEmits<{
  close: []
  switchMode: []
  authenticated: []
}>()

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const isSubmitting = ref(false)

const isSignUp = computed(() => props.mode === 'signup')
const title = computed(() => isSignUp.value ? 'Sign Up' : 'Log In')
const submitText = computed(() => isSignUp.value ? 'Create Account' : 'Log In')
const switchText = computed(() => isSignUp.value ? 'Already have an account?' : "Don't have an account?")
const switchAction = computed(() => isSignUp.value ? 'Log In' : 'Sign Up')

const isValid = computed(() => {
  if (!email.value || !password.value) return false
  if (isSignUp.value && password.value !== confirmPassword.value) return false
  if (password.value.length < 6) return false
  return true
})

async function handleSubmit() {
  if (!isValid.value || isSubmitting.value) return

  localError.value = null
  successMessage.value = null
  isSubmitting.value = true

  try {
    if (isSignUp.value) {
      const result = await authStore.signUp(email.value, password.value)
      if (result.success) {
        emit('authenticated')
        emit('close')
      } else {
        localError.value = result.error || 'Sign up failed'
      }
    } else {
      const result = await authStore.signIn(email.value, password.value)
      if (result.success) {
        emit('authenticated')
        emit('close')
      } else {
        localError.value = result.error || 'Sign in failed'
      }
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div v-if="localError" class="error-message">
          {{ localError }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
            minlength="6"
            autocomplete="current-password"
          />
          <span v-if="password && password.length < 6" class="hint">
            Password must be at least 6 characters
          </span>
        </div>

        <div v-if="isSignUp" class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            autocomplete="new-password"
          />
          <span v-if="confirmPassword && password !== confirmPassword" class="hint error">
            Passwords do not match
          </span>
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="!isValid || isSubmitting"
        >
          {{ isSubmitting ? 'Please wait...' : submitText }}
        </button>
      </form>

      <div class="switch-mode">
        {{ switchText }}
        <button class="switch-btn" @click="emit('switchMode')">
          {{ switchAction }}
        </button>
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
  padding: 2rem;
  width: 100%;
  max-width: 400px;
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error-message {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.9rem;
}

.success-message {
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  color: #22c55e;
  font-size: 0.9rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #e94560;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.2);
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.hint.error {
  color: #ef4444;
}

.submit-btn {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.switch-mode {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.switch-btn {
  background: none;
  border: none;
  color: #e94560;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.switch-btn:hover {
  color: #f97316;
}
</style>
