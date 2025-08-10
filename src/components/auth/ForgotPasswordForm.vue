<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Reset your password</h3>
      <p class="text-sm text-gray-600 mt-2">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

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

    <div v-if="error" class="text-red-600 text-sm">
      {{ error }}
    </div>

    <div v-if="message" class="text-green-600 text-sm">
      {{ message }}
    </div>

    <Button
      type="submit"
      variant="primary"
      size="lg"
      class="w-full"
      :disabled="loading"
    >
      {{ loading ? 'Sending...' : 'Send reset link' }}
    </Button>

    <div class="text-center">
      <button
        type="button"
        @click="$emit('back-to-login')"
        class="text-sm text-blue-600 hover:text-blue-500 font-medium"
      >
        Back to sign in
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useSupabase } from '@/composables/useSupabase'

// Emits
defineEmits<{
  'back-to-login': []
  'success': []
}>()

// Supabase
const { supabaseClient } = useSupabase()

// Form state
const email = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

// Form submission
const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      error.value = resetError.message
    } else {
      message.value = 'Password reset link sent! Please check your email.'
      email.value = ''
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>