<template>
  <button :class="buttonClasses" :disabled="disabled" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

// Emits
defineEmits<{
  click: []
}>()

// Computed
const buttonClasses = computed(() => {
  const baseClasses =
    'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
  }

  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`
})
</script>
