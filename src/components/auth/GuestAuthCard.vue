<template>
  <div class="bg-white rounded-lg shadow-lg p-8">
    <div class="text-center">
      <div
        class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Continue as Guest</h2>
      <p class="text-gray-600 mb-6">
        Start building raids immediately. Your data will be saved and you can sign up with
        an email later.
      </p>
      
      <div v-if="error" class="text-red-600 text-sm mb-4">
        {{ error }}
      </div>

      <Button 
        variant="secondary" 
        size="lg" 
        class="w-full" 
        :disabled="loading"
        @click="signInAnonymously"
      >
        {{ loading ? 'Getting Started...' : 'Get Started' }}
      </Button>
      
      <p class="text-gray-600 text-xs mt-2">
        Your data will be available only in this browser on this device.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useSupabase } from '@/composables/useSupabase'

// Emits
defineEmits<{
  'success': []
}>()

// Supabase
const { supabaseClient } = useSupabase()

// State
const loading = ref(false)
const error = ref('')

// Sign in anonymously
const signInAnonymously = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabaseClient.auth.signInAnonymously()
    if (authError) {
      error.value = authError.message
      console.error('Anonymous sign in error:', authError)
    } else {
      // Success - the auth state change will be handled by the useSupabase composable
    }
  } catch {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Anonymous sign in error')
  } finally {
    loading.value = false
  }
}
</script>