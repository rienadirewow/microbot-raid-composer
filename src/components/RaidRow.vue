<template>
  <div
    class="bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <h3 class="text-lg font-bold text-slate-800">
          {{ capitalizeFirst(row.character.name) }}'s Group
        </h3>
        <button
          @click="$emit('setCurrentPlayer', row.character.id)"
          class="ml-3 p-1 rounded-full transition-colors"
          :class="isCurrentPlayer ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'"
          :title="isCurrentPlayer ? 'Current Player' : 'Set as Current Player'"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>
      <span class="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
        >T{{ row.character.unlockedTiers.r }}R gear</span
      >
    </div>

    <div class="grid grid-cols-5 gap-3">
      <RaidSlot
        v-for="(slot, slotIndex) in row.slots"
        :key="slotIndex"
        :slot="slot"
        :slot-index="slotIndex"
        :is-first-slot="slotIndex === 0"
        :character="row.character"
        @click="$emit('slotClick', slotIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterRow } from '@/types'
import RaidSlot from './RaidSlot.vue'

// Props
interface Props {
  row: CharacterRow
  rowIndex: number
  isCurrentPlayer?: boolean
  currentPlayerId?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  slotClick: [slotIndex: number]
  setCurrentPlayer: [playerId: string]
}>()

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
</script>
