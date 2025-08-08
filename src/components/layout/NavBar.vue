<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-screen-xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-bold text-gray-900">Microbot-wow Raid Builder</h1>
        </div>

        <!-- Navigation Links -->
        <div v-if="supabaseUser" class="hidden md:flex items-center space-x-8">
          <router-link
            to="/"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
          >
            Raid Builder
          </router-link>
          <router-link
            to="/characters"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/characters' }"
          >
            Characters
          </router-link>
        </div>

        <!-- User Menu -->
        <div v-if="supabaseUser" class="flex items-center space-x-4">
          <!-- Character Count Badge -->
          <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <span>{{ charactersStore.totalCharacters }} characters</span>
            <span class="text-gray-300">|</span>
            <span>{{ raidsStore.raids.length }} raids</span>
          </div>

          <!-- User Info and Actions -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">
              {{ supabaseUser.email || 'Guest User' }}
            </span>

            <!-- Sign Up button for guest users -->
            <Button
              v-if="supabaseUser && supabaseUser.is_anonymous"
              size="sm"
              @click="showSignUpModal = true"
            >
              Sign Up
            </Button>

            <Button variant="secondary" size="sm" @click="signOut"> Sign Out </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <div v-if="supabaseUser" class="md:hidden">
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="text-gray-600 hover:text-gray-900 p-2"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen && supabaseUser" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
          @click="mobileMenuOpen = false"
        >
          Raid Builder
        </router-link>
        <router-link
          to="/characters"
          class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
          :class="{ 'text-blue-600 bg-blue-50': $route.path === '/characters' }"
          @click="mobileMenuOpen = false"
        >
          Characters
        </router-link>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <div
      v-if="showSignUpModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900">Create Account</h3>
            <button @click="showSignUpModal = false" class="text-gray-400 hover:text-gray-600">
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

          <!-- Custom Sign Up Form for Anonymous User Linking -->
          <form @submit.prevent="handleAnonymousSignUp" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                v-model="signUpForm.email"
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
                v-model="signUpForm.password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              :disabled="isSigningUp"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ isSigningUp ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { useSupabase } from '@/composables/useSupabase'
import Button from '../ui/Button.vue'

// State
const mobileMenuOpen = ref(false)
const showSignUpModal = ref(false)
const isSigningUp = ref(false)
const signUpForm = ref({
  email: '',
  password: '',
})

// Stores
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// Auth
const { supabaseClient, supabaseUser } = useSupabase()

// Watch for user state changes
watch(supabaseUser, (user) => {})

// Methods
const handleAnonymousSignUp = async () => {
  if (!signUpForm.value.email || !signUpForm.value.password) {
    alert('Please fill in all fields')
    return
  }

  isSigningUp.value = true

  try {
    // Check if current user is anonymous
    const currentUser = supabaseUser.value
    const isAnonymous = currentUser?.is_anonymous === true

    if (isAnonymous) {
      // Use updateUser to link email to anonymous account
      const { data: updateData, error: updateError } = await supabaseClient.auth.updateUser({
        email: signUpForm.value.email,
      })

      if (updateError) {
        console.error('Error linking email:', updateError)
        alert('Error setting up account. Please try again.')
        return
      }

      alert(
        'Please check your email and click the verification link to complete your account setup.',
      )

      // Data should be preserved since it's the same user ID
    } else {
      // Create new account (this will lose any existing data)
      const { data, error } = await supabaseClient.auth.signUp({
        email: signUpForm.value.email,
        password: signUpForm.value.password,
      })

      if (error) {
        console.error('Error creating account:', error)
        alert('Error creating account. Please try again.')
        return
      }

      alert(
        'Please check your email and click the verification link to complete your account setup.',
      )
    }

    // Reset form and close modal
    signUpForm.value = { email: '', password: '' }
    showSignUpModal.value = false
  } catch (error) {
    console.error('Sign up error:', error)
    alert('An unexpected error occurred. Please try again.')
  } finally {
    isSigningUp.value = false
  }
}

const handleAuthStateChange = async (event: string, session: any) => {
  if (event === 'SIGNED_IN') {
    // Check if this is a new sign-up from an anonymous user
    const currentUser = supabaseUser.value
    const wasAnonymous = currentUser?.is_anonymous === true
    const isNewUser = session?.user?.id !== currentUser?.id

    if (wasAnonymous && isNewUser) {
      // Store the current user's data before the auth state changes
      const anonymousCharacters = [...charactersStore.characters]
      const anonymousRaids = [...raidsStore.raids]

      // Store this data temporarily to migrate after the user change
      if (anonymousCharacters.length > 0 || anonymousRaids.length > 0) {
        localStorage.setItem(
          'anonymousDataToMigrate',
          JSON.stringify({
            characters: anonymousCharacters,
            raids: anonymousRaids,
            timestamp: Date.now(),
          }),
        )
      }
    } else {
    }

    showSignUpModal.value = false
  }
}

// Watch for user changes to detect when email verification is completed
watch(supabaseUser, async (newUser, oldUser) => {
  // Check if user just completed email verification (went from anonymous to permanent)
  if (oldUser?.is_anonymous && !newUser?.is_anonymous && newUser?.email) {
    // Reload data to ensure it's properly loaded
    await Promise.all([charactersStore.loadCharacters(), raidsStore.loadRaids()])
  }
})

const signOut = async () => {
  try {
    await supabaseClient.auth.signOut()

    // Reload data after sign out
    await Promise.all([charactersStore.loadCharacters(), raidsStore.loadRaids()])
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>
