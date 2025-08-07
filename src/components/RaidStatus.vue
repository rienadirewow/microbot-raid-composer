<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ raidName }}</h2>
      </div>
      <ProgressBar :value="filledSlots" :max="40" />
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center space-x-4">
      <Button variant="success" size="sm" @click="$emit('save')">Save Raid</Button>
      <Button variant="warning" size="sm" @click="$emit('export')">Export Commands</Button>
      <Button variant="secondary" size="sm" @click="$emit('clear')">Clear</Button>
      <Button variant="danger" size="sm" @click="$emit('delete')">Delete Raid</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from './ui/ProgressBar.vue'
import Button from './ui/Button.vue'
import FactionBadge from './ui/FactionBadge.vue'

// Props
interface Props {
  raidName: string
  filledSlots: number
}

defineProps<Props>()

// Emits
defineEmits<{
  save: []
  export: []
  clear: []
  delete: []
}>()
</script>
