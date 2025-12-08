<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your email"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your password"
      />
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="rememberMe"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
          Remember me
        </label>
      </div>

      <button
        type="button"
        @click="$emit('forgot-password')"
        class="text-sm text-blue-600 hover:text-blue-500"
      >
        Forgot your password?
      </button>
    </div>

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>

    <Button
      type="submit"
      variant="primary"
      size="lg"
      class="w-full"
      :disabled="loading"
    >
      {{ loading ? 'Signing in...' : 'Sign in' }}
    </Button>

    <!-- Signup disabled for now
    <div class="text-center">
      <span class="text-sm text-gray-600">Don't have an account? </span>
      <button
        type="button"
        @click="$emit('switch-to-signup')"
        class="text-sm text-blue-600 hover:text-blue-500 font-medium"
      >
        Sign up
      </button>
    </div>
    -->
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useSupabase } from '@/composables/useSupabase'

// Emits
defineEmits<{
  'forgot-password': []
  'switch-to-signup': []
  'success': []
}>()

// Supabase
const { supabaseClient } = useSupabase()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')

// Form submission
const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) {
      error.value = authError.message
    } else {
      // Success - the auth state change will be handled by the useSupabase composable
      // Reset form
      email.value = ''
      password.value = ''
      rememberMe.value = false
    }
  } catch {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>