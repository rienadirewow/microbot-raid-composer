<template>
  <div class="p-0">
    <div class="space-y-4">
      <RaidRow
        v-for="(row, rowIndex) in sortedComposition"
        :key="row.character.id"
        :row="row"
        :row-index="rowIndex"
        :is-current-player="row.character.id === currentPlayerId"
        :current-player-id="currentPlayerId"
        @slot-click="(slotIndex) => $emit('slotClick', rowIndex, slotIndex)"
        @set-current-player="$emit('updateCurrentPlayer', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Composition, PlayerCharacter } from '@/types'
import RaidRow from './RaidRow.vue'

// Props
interface Props {
  composition: Composition
  characters: PlayerCharacter[]
  currentPlayerId?: string
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  slotClick: [rowIndex: number, slotIndex: number]
  updateCurrentPlayer: [id: string]
}>()

// Computed
const sortedComposition = computed(() => {
  // Move current player to the top
  const currentPlayerRow = props.composition.find(
    (row) => row.character.id === props.currentPlayerId,
  )
  const otherRows = props.composition.filter((row) => row.character.id !== props.currentPlayerId)

  if (currentPlayerRow) {
    return [currentPlayerRow, ...otherRows]
  }
  return props.composition
})
</script>
