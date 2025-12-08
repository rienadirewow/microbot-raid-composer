import { ref, computed, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

// Create a single Supabase client instance
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const useSupabase = () => {
  const supabaseUser = ref<User | null>(null)
  const isAuthenticated = computed(() => !!supabaseUser.value)

  // Listen to auth state changes
  const setupAuthListener = () => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      supabaseUser.value = session?.user ?? null
    })
  }

  const getInitialAuthState = async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()
    supabaseUser.value = session?.user ?? null
  }

  onMounted(() => {
    setupAuthListener()
    getInitialAuthState()
  })

  return {
    supabaseClient,
    supabaseUser,
    isAuthenticated,
  }
}
