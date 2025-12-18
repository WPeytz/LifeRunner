import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const isPremium = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function fetchPremiumStatus() {
    if (!user.value) {
      isPremium.value = false
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.value.id)
        .single()

      if (!error && data) {
        isPremium.value = data.is_premium ?? false
      }
    } catch (err) {
      console.error('Error fetching premium status:', err)
    }
  }

  async function initialize() {
    try {
      loading.value = true

      // Get initial session
      const { data: { session: initialSession } } = await supabase.auth.getSession()
      session.value = initialSession
      user.value = initialSession?.user ?? null

      // Fetch premium status if logged in
      if (user.value) {
        await fetchPremiumStatus()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        session.value = newSession
        user.value = newSession?.user ?? null

        // Update premium status on auth change
        if (newSession?.user) {
          await fetchPremiumStatus()
        } else {
          isPremium.value = false
        }
      })
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  async function signUp(email: string, password: string) {
    try {
      error.value = null
      loading.value = true

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        error.value = signUpError.message
        return { success: false, error: signUpError.message }
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      error.value = null
      loading.value = true

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        error.value = signInError.message
        return { success: false, error: signInError.message }
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      error.value = null
      loading.value = true

      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        error.value = signOutError.message
        return { success: false, error: signOutError.message }
      }

      user.value = null
      session.value = null
      isPremium.value = false
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    error,
    isPremium,
    isAuthenticated,
    initialize,
    signUp,
    signIn,
    signOut,
    fetchPremiumStatus,
  }
})
