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
            Raid Builder ({{ raidsStore.accountRaids.length }})
          </router-link>
          <router-link
            to="/characters"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/characters' }"
          >
            Characters ({{ charactersStore.totalCharacters }})
          </router-link>
        </div>

        <div v-if="supabaseUser" class="hidden md:flex items-center">
          <AccountSelector />
        </div>

        <!-- User Menu -->
        <div v-if="supabaseUser" class="flex items-center space-x-4">
          <!-- Character Count Badge
          <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <span>{{ charactersStore.totalCharacters }} characters</span>
            <span class="text-gray-300">|</span>
            <span>{{ raidsStore.raids.length }} raids</span>
          </div> -->

          <!-- User Info and Actions -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">
              {{ supabaseUser.email || 'Guest User' }}
            </span>

            <!-- Sign Up button for guest users - disabled for now
            <Button
              v-if="supabaseUser && supabaseUser.is_anonymous"
              size="sm"
              @click="showSignUpModal = true"
            >
              Sign Up
            </Button>
            -->

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
        <div class="px-2 py-2">
          <AccountSelector />
        </div>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <GuestSignupModal
      :show="showSignUpModal"
      @close="showSignUpModal = false"
      @success="handleSignupSuccess"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { useAccountsStore } from '@/stores/accounts'
import { useSupabase } from '@/composables/useSupabase'
import { useMigration } from '@/composables/useMigration'
import Button from '../ui/Button.vue'
import GuestSignupModal from '../auth/GuestSignupModal.vue'
import AccountSelector from '../ui/AccountSelector.vue'

// State
const mobileMenuOpen = ref(false)
const showSignUpModal = ref(false)

// Stores
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()
const accountsStore = useAccountsStore()

// Auth
const { supabaseClient, supabaseUser } = useSupabase()

// Migration
const { migrateToMultiAccount } = useMigration()

watch(supabaseUser, async (newUser, oldUser) => {
  const isInitialAuth = newUser && !oldUser
  const isEmailVerification = oldUser?.is_anonymous && !newUser?.is_anonymous && newUser?.email

  if (isInitialAuth || isEmailVerification) {
    await Promise.all([
      accountsStore.loadAccounts(),
      charactersStore.loadCharacters(),
      raidsStore.loadRaids(),
    ])
    await migrateToMultiAccount()
  }
}, { immediate: true })

// Methods
const handleSignupSuccess = () => {
  showSignUpModal.value = false
}

const signOut = async () => {
  try {
    await supabaseClient.auth.signOut()
    await Promise.all([
      accountsStore.loadAccounts(),
      charactersStore.loadCharacters(),
      raidsStore.loadRaids(),
    ])
    await migrateToMultiAccount()
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>
