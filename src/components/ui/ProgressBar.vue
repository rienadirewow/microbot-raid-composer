<template>
  <div class="flex items-center space-x-4">
    <div class="text-right">
      <p class="text-sm text-gray-600">{{ label }}</p>
      <p class="text-lg font-semibold text-gray-900">{{ value }}/{{ max }} slots</p>
    </div>
    <div class="w-32 bg-gray-200 rounded-full h-2">
      <div
        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  value: number
  max: number
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Fill Progress',
})

// Computed
const percentage = computed(() => {
  return Math.min(100, (props.value / props.max) * 100)
})
</script>
