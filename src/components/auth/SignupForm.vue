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
        minlength="6"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Create a password (min 6 characters)"
      />
    </div>

    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        id="confirm-password"
        v-model="confirmPassword"
        type="password"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Confirm your password"
      />
    </div>

    <div class="flex items-center">
      <input
        id="terms"
        v-model="acceptedTerms"
        type="checkbox"
        required
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label for="terms" class="ml-2 block text-sm text-gray-900">
        I agree to the 
        <a href="#" class="text-blue-600 hover:text-blue-500">Terms of Service</a> and 
        <a href="#" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
      </label>
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
      {{ loading ? 'Creating account...' : 'Create account' }}
    </Button>

    <div class="text-center">
      <span class="text-sm text-gray-600">Already have an account? </span>
      <button
        type="button"
        @click="$emit('switch-to-login')"
        class="text-sm text-blue-600 hover:text-blue-500 font-medium"
      >
        Sign in
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
  'switch-to-login': []
  'success': []
}>()

// Supabase
const { supabaseClient } = useSupabase()

// Form state
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const loading = ref(false)
const error = ref('')
const message = ref('')

// Form validation
const validateForm = () => {
  if (!email.value || !password.value || !confirmPassword.value) {
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

  if (!acceptedTerms.value) {
    error.value = 'Please accept the terms of service'
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
    const { error: authError } = await supabaseClient.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (authError) {
      error.value = authError.message
    } else {
      message.value = 'Account created successfully! Please check your email to verify your account.'
      // Reset form
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      acceptedTerms.value = false
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>