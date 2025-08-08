<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Raid Slots</h3>
      <span class="text-sm text-gray-600">{{ filledSlots }}/40 slots filled</span>
    </div>

    <div class="grid grid-cols-8 gap-2">
      <div
        v-for="slot in slots"
        :key="slot.slot"
        class="relative p-3 border-2 rounded-lg cursor-pointer transition-colors"
        :class="
          slot.assignment
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        "
        @click="selectSlot(slot.slot)"
      >
        <div class="text-center">
          <div class="text-xs font-medium text-gray-600 mb-1">{{ slot.slot }}</div>
          <div v-if="slot.assignment" class="text-xs text-green-700">
            {{ slot.assignment.name }}
          </div>
          <div v-else class="text-xs text-gray-400">Empty</div>
        </div>
      </div>
    </div>

    <!-- Companion Selector Modal -->
    <CompanionSelector
      v-if="showCompanionSelector"
      :slot-number="selectedSlot"
      @close="showCompanionSelector = false"
      @select="assignCompanion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RaidSlot, CompanionAssignment } from '@/types'
import CompanionSelector from './forms/CompanionSelector.vue'

// Props
interface Props {
  slots: RaidSlot[]
  filledSlots: number
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  'assign-companion': [slotNumber: number, companion: CompanionAssignment]
}>()

// State
const showCompanionSelector = ref(false)
const selectedSlot = ref(0)

// Methods
const selectSlot = (slotNumber: number) => {
  selectedSlot.value = slotNumber
  showCompanionSelector.value = true
}

const assignCompanion = (companion: CompanionAssignment) => {
  emit('assign-companion', selectedSlot.value, companion)
  showCompanionSelector.value = false
}
</script>
