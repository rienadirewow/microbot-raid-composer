<template>
  <div>
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Initial Auth View -->
    <div v-if="!supabaseUser" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-4xl w-full">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Microbot-wow Raid Builder</h1>
          <p class="text-lg text-gray-600">Create and manage your Microbot-wow raid compositions</p>
        </div>

        <!-- Auth Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Continue as Guest -->
          <GuestAuthCard @success="handleAuthSuccess" />

          <!-- Sign In / Sign Up -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">Create Account</h2>
              <p class="text-gray-600 mb-6">
                Sign up with your email to access your data across devices.
              </p>
            </div>

            <!-- Auth Form -->
            <AuthForm
              class="w-full"
              initial-view="signup"
              @success="handleAuthSuccess"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-gray-500">
          <p>
            Your data is securely stored and you can switch between guest and full accounts anytime.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else class="min-h-screen bg-gray-50">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import { useSupabase } from '@/composables/useSupabase'
import AuthForm from '@/components/auth/AuthForm.vue'
import GuestAuthCard from '@/components/auth/GuestAuthCard.vue'

const { supabaseUser } = useSupabase()

// Handle auth success
const handleAuthSuccess = () => {
  // Auth state will be handled automatically by useSupabase composable
}
</script>

<style scoped></style>
