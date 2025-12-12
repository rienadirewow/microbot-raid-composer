<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="p-2 rounded-lg" :class="iconBgClass">
        <svg
          class="w-6 h-6"
          :class="iconColorClass"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  label: string
  value: string | number
  variant?: 'blue' | 'green' | 'red'
  iconPath: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue',
})

// Computed
const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-blue-100 dark:bg-blue-900/30',
    green: 'bg-green-100 dark:bg-green-900/30',
    red: 'bg-red-100 dark:bg-red-900/30',
  }
  return classes[props.variant]
})

const iconColorClass = computed(() => {
  const classes = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
  }
  return classes[props.variant]
})
</script>
