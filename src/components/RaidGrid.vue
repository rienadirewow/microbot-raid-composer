<template>
  <div class="p-0">
    <!-- Header with role counters -->
    <div class="flex items-center justify-end mb-4">
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

    <!-- Current Player Selection and Information -->
    <div class="mb-6">
      <!-- Current Player Selection -->
      <div class="flex items-center mb-3">
        <div class="flex items-center space-x-3">
          <button
            @click="showPlayerSelector = true"
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors"
            :class="currentPlayer ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-gray-300 bg-white text-gray-400 hover:border-amber-400 hover:text-amber-500'"
            :title="currentPlayer ? 'Change Current Player' : 'Select Current Player'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <div v-if="currentPlayer" class="flex items-center space-x-2">
            <span 
              class="text-lg font-semibold"
              :style="{ color: getClassColor(currentPlayer.class) }"
            >
              {{ capitalizeFirst(currentPlayer.name) }}
            </span>
            <span class="text-sm text-gray-600">{{ getClassDisplayName(currentPlayer.class) }}</span>
            <span class="text-sm text-gray-500">
              T{{ currentPlayer.unlockedTiers.r }}R, T{{ currentPlayer.unlockedTiers.d }}D
            </span>
          </div>
          <div v-else class="text-gray-500 italic">No current player selected</div>
        </div>
      </div>

      <!-- Warning when no current player -->
      <div v-if="!currentPlayer" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm text-yellow-800">Please select a current player to continue</span>
        </div>
      </div>
    </div>

    <!-- Player Selection Modal -->
    <div
      v-if="showPlayerSelector"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showPlayerSelector = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Current Player</h3>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <button
            v-for="character in characters"
            :key="character.id"
            @click="selectCurrentPlayer(character)"
            class="w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md"
            :class="
              currentPlayer?.id === character.id
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'
            "
          >
            <div class="flex items-center justify-between">
              <div>
                <p 
                  class="font-medium" 
                  :style="{ color: getClassColor(character.class) }"
                >
                  {{ capitalizeFirst(character.name) }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ getClassDisplayName(character.class) }} ({{ character.faction }})
                </p>
              </div>
              <div v-if="currentPlayer?.id === character.id" class="text-amber-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showPlayerSelector = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
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
import { computed, ref } from 'vue'
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
const emit = defineEmits<{
  slotClick: [rowIndex: number, slotIndex: number]
  updateCurrentPlayer: [id: string]
}>()

// State
const showPlayerSelector = ref(false)

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

  props.composition.forEach((row) => {
    row.slots.forEach((slot) => {
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
    dps: groupCount * 5 - Math.ceil(groupCount / 2) - (groupCount + 1), // rest dps
  }
})

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

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

const selectCurrentPlayer = (character: PlayerCharacter) => {
  emit('updateCurrentPlayer', character.id)
  showPlayerSelector.value = false
}
</script>
