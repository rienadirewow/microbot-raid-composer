<template>
  <div class="bg-white/5 rounded-lg p-4 border border-white/10">
    <div class="flex items-center mb-3">
      <h3 class="text-lg font-semibold text-white">
        {{ row.character.name }}'s Group
      </h3>
      <span class="ml-2 text-sm text-gray-400">
        (T{{ row.character.unlockedTiers.r }}R gear)
      </span>
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
</script>
