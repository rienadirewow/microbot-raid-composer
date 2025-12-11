import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

const supabaseUser = ref<User | null>(null)
const isAuthenticated = computed(() => !!supabaseUser.value)

let authInitPromise: Promise<void> | null = null

const initAuth = () => {
  if (authInitPromise) return authInitPromise

  authInitPromise = (async () => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      supabaseUser.value = session?.user ?? null
    })

    const {
      data: { session },
    } = await supabaseClient.auth.getSession()
    supabaseUser.value = session?.user ?? null
  })()

  return authInitPromise
}

initAuth()

export const useSupabase = () => {
  const waitForAuth = () => authInitPromise ?? Promise.resolve()

  return {
    supabaseClient,
    supabaseUser,
    isAuthenticated,
    waitForAuth,
  }
}
