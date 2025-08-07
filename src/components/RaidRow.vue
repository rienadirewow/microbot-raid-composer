<template>
  <div
    class="bg-white rounded-xl shadow-md border border-slate-200 p-4 hover:shadow-lg transition-shadow"
  >
    <div class="flex items-center mb-3">
      <h3 class="text-lg font-bold text-slate-800">
        {{ capitalizeFirst(row.character.name) }}'s Group
      </h3>
      <span class="ml-3 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
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
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  slotClick: [slotIndex: number]
}>()

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
</script>
