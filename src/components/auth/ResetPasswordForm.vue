<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-6">
      <h3 class="text-lg font-medium text-gray-900">Set new password</h3>
      <p class="text-sm text-gray-600 mt-2">
        Enter your new password below.
      </p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        minlength="6"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your new password (min 6 characters)"
      />
    </div>

    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
      <input
        id="confirm-password"
        v-model="confirmPassword"
        type="password"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Confirm your new password"
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
      {{ loading ? 'Updating password...' : 'Update password' }}
    </Button>

    <div class="text-center">
      <router-link
        to="/"
        class="text-sm text-blue-600 hover:text-blue-500 font-medium"
      >
        Back to login
      </router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useSupabase } from '@/composables/useSupabase'

// Supabase
const { supabaseClient } = useSupabase()

// Router
const route = useRoute()
const router = useRouter()

// Form state
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

// Form validation
const validateForm = () => {
  if (!password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return false
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return false
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return false
  }

  return true
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    const { error: updateError } = await supabaseClient.auth.updateUser({
      password: password.value,
    })

    if (updateError) {
      error.value = updateError.message
    } else {
      message.value = 'Password updated successfully! Redirecting...'
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

// Check for access token on mount
onMounted(async () => {
  const accessToken = route.query.access_token as string
  const refreshToken = route.query.refresh_token as string

  if (accessToken && refreshToken) {
    // Set session from URL parameters
    const { error: sessionError } = await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (sessionError) {
      error.value = 'Invalid reset link. Please request a new password reset.'
    }
  } else {
    error.value = 'Invalid reset link. Please request a new password reset.'
  }
})
</script>