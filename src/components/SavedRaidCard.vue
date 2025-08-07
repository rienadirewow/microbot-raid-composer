<template>
  <div
    class="bg-white rounded-lg shadow p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-medium text-gray-900">{{ raidName }}</h3>
      <div class="w-3 h-3 rounded-full bg-purple-600"></div>
    </div>
    <p class="text-sm text-gray-600 mb-2">{{ raidType }}</p>
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500">{{ filledSlots }}/40 filled</span>
      <span class="text-gray-400">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  raidName: string
  raidType: string
  filledSlots: number
  updatedAt: string | Date
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  click: []
}>()

// Computed
const formattedDate = computed(() => {
  return new Date(props.updatedAt).toLocaleDateString()
})
</script>
