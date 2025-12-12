<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Initial Auth View -->
    <div v-if="!supabaseUser" class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Microbot-wow Raid Builder</h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">Create and manage your Microbot-wow raid compositions</p>
        </div>

        <!-- Guest Auth Only -->
        <GuestAuthCard @success="handleAuthSuccess" />

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Your data will be stored locally in this browser.</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="bg-gray-50 dark:bg-gray-950 flex-grow">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import { useSupabase } from '@/composables/useSupabase'
import GuestAuthCard from '@/components/auth/GuestAuthCard.vue'
import { useThemeStore } from '@/stores/theme'

const { supabaseUser } = useSupabase()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})

const handleAuthSuccess = () => {
}
</script>
