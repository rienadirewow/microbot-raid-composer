<template>
  <!-- Sign Up Modal -->
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Create Account</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <p class="text-sm text-gray-600">
            Link your guest account to an email to access your data across devices and keep it safe.
          </p>
        </div>

        <!-- Custom Sign Up Form for Anonymous User Linking -->
        <form @submit.prevent="handleAnonymousSignUp" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password (min 6 characters)"
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
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </Button>
        </form>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            Your existing raid data and characters will be preserved and linked to your new account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import { useSupabase } from '@/composables/useSupabase'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'close': []
  'success': []
}>()

// Supabase
const { supabaseClient, supabaseUser } = useSupabase()

// Form state
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const message = ref('')

// Form validation
const validateForm = () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return false
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return false
  }

  return true
}

// Handle anonymous user signup
const handleAnonymousSignUp = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  error.value = ''
  message.value = ''

  try {
    // Check if current user is anonymous
    const currentUser = supabaseUser.value
    const isAnonymous = currentUser?.is_anonymous === true

    if (isAnonymous) {
      // Use updateUser to link email to anonymous account
      const { error: updateError } = await supabaseClient.auth.updateUser({
        email: email.value,
      })

      if (updateError) {
        error.value = updateError.message
        console.error('Error linking email:', updateError)
        return
      }

      message.value = 'Please check your email and click the verification link to complete your account setup.'
      
      // Reset form
      email.value = ''
      password.value = ''

      // Data should be preserved since it's the same user ID
    } else {
      // Create new account (this will lose any existing data)
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (signUpError) {
        error.value = signUpError.message
        console.error('Error creating account:', signUpError)
        return
      }

      message.value = 'Please check your email and click the verification link to complete your account setup.'
      
      // Reset form
      email.value = ''
      password.value = ''
    }
  } catch {
    error.value = 'An unexpected error occurred. Please try again.'
    console.error('Sign up error')
  } finally {
    loading.value = false
  }
}

// Reset form when modal is closed
watch(() => props.show, (newShow) => {
  if (!newShow) {
    email.value = ''
    password.value = ''
    error.value = ''
    message.value = ''
    loading.value = false
  }
})
</script>