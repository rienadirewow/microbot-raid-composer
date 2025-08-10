<template>
  <div class="w-full">
    <!-- Login Form -->
    <LoginForm
      v-if="currentView === 'login'"
      @switch-to-signup="switchView('signup')"
      @forgot-password="switchView('forgot-password')"
      @success="$emit('success')"
    />

    <!-- Signup Form -->
    <SignupForm
      v-else-if="currentView === 'signup'"
      @switch-to-login="switchView('login')"
      @success="$emit('success')"
    />

    <!-- Forgot Password Form -->
    <ForgotPasswordForm
      v-else-if="currentView === 'forgot-password'"
      @back-to-login="switchView('login')"
      @success="$emit('success')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import SignupForm from './SignupForm.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'

// Props
interface Props {
  initialView?: 'login' | 'signup' | 'forgot-password'
}

const props = withDefaults(defineProps<Props>(), {
  initialView: 'signup',
})

// Emits
defineEmits<{
  'success': []
}>()

// State
const currentView = ref(props.initialView)

// Methods
const switchView = (view: 'login' | 'signup' | 'forgot-password') => {
  currentView.value = view
}
</script>