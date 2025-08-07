<template>
  <div class="p-0">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Raid Composition</h2>
      <p class="text-slate-600">Each row represents a character and their group members</p>

      <CurrentPlayerSelector
        :characters="characters"
        :current-player-id="currentPlayerId"
        @update:current-player-id="$emit('updateCurrentPlayer', $event)"
      />
    </div>

    <div class="space-y-4">
      <RaidRow
        v-for="(row, rowIndex) in composition"
        :key="row.character.id"
        :row="row"
        :row-index="rowIndex"
        @slot-click="(slotIndex) => $emit('slotClick', rowIndex, slotIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Composition, PlayerCharacter } from '@/types'
import RaidRow from './RaidRow.vue'
import CurrentPlayerSelector from './CurrentPlayerSelector.vue'

// Props
interface Props {
  composition: Composition
  characters: PlayerCharacter[]
  currentPlayerId?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  slotClick: [rowIndex: number, slotIndex: number]
  updateCurrentPlayer: [id: string]
}>()

// Computed
const currentPlayer = computed(() => {
  return props.characters.find((char) => char.id === props.currentPlayerId) || null
})

// Methods
const getClassColor = (wowClass: string) => {
  const classColors: Record<string, string> = {
    warrior: '#C79C6E',
    paladin: '#F58CBA',
    hunter: '#ABD473',
    rogue: '#FFF569',
    priest: '#FFFFFF',
    shaman: '#0070DE',
    mage: '#69CCF0',
    warlock: '#9482C9',
    druid: '#FF7D0A',
  }
  return classColors[wowClass] || '#6B7280'
}

const getClassDisplayName = (wowClass: string) => {
  const classNames: Record<string, string> = {
    warrior: 'Warrior',
    paladin: 'Paladin',
    hunter: 'Hunter',
    rogue: 'Rogue',
    priest: 'Priest',
    shaman: 'Shaman',
    mage: 'Mage',
    warlock: 'Warlock',
    druid: 'Druid',
  }
  return classNames[wowClass] || wowClass
}
</script>
