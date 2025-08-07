<template>
  <div class="p-0">
    <!-- Header with title and actions -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Raid Composition</h2>
        <p class="text-slate-600">Each row represents a character and their group members</p>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Role Suggestion Counter -->
        <div class="flex items-center space-x-3 text-sm text-slate-600">
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>Tank: {{ roleCounts.tank }}/{{ suggestedRoles.tank }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Healer: {{ roleCounts.healer }}/{{ suggestedRoles.healer }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>DPS: {{ roleCounts.dps }}/{{ suggestedRoles.dps }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Player Information -->
    <div
      v-if="currentPlayer"
      class="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl"
    >
      <h3 class="text-lg font-bold text-amber-800 mb-2">
        Current Player: {{ capitalizeFirst(currentPlayer.name) }}
      </h3>
      <p class="text-sm text-amber-700">{{ getClassDisplayName(currentPlayer.class) }}</p>
      <p class="text-sm text-amber-700">
        Raid License: T{{ currentPlayer.unlockedTiers.r }}R | Dungeon License: T{{
          currentPlayer.unlockedTiers.d
        }}D
      </p>
    </div>

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
const currentPlayer = computed(() => {
  return props.characters.find((char) => char.id === props.currentPlayerId) || null
})

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

const roleCounts = computed(() => {
  const counts = { tank: 0, healer: 0, dps: 0 }
  
  props.composition.forEach(row => {
    row.slots.forEach(slot => {
      if (slot) {
        if (slot.role === 'tank') counts.tank++
        else if (slot.role === 'healer') counts.healer++
        else if (['dps', 'mdps', 'rdps'].includes(slot.role)) counts.dps++
      }
    })
  })
  
  return counts
})

const suggestedRoles = computed(() => {
  const groupCount = props.composition.length
  return {
    tank: Math.ceil(groupCount / 2), // 1 tank per 2 groups
    healer: groupCount + 1, // 1 healer per group + 1
    dps: groupCount * 5 - Math.ceil(groupCount / 2) - (groupCount + 1) // rest dps
  }
})

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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
