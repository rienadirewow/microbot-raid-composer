<template>
  <div
    class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="w-8 h-8 text-amber-500 mr-4">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-xl font-bold text-amber-800">Current Player</h3>
          <div v-if="currentPlayer" class="flex items-center space-x-2">
            <p
              class="text-base font-medium truncate"
              :style="{ color: getClassColor(currentPlayer.class) }"
            >
              {{ capitalizeFirst(currentPlayer.name) }} -
              {{ getClassDisplayName(currentPlayer.class) }} ({{ currentPlayer.faction }})
            </p>
          </div>
          <div v-else class="flex items-center space-x-2">
            <p class="text-base text-amber-700">No current player selected</p>
          </div>
          <p v-if="currentPlayer" class="text-sm text-amber-700 mt-2 truncate">
            Raid License: T{{ currentPlayer.unlockedTiers.r }}R | Dungeon License:
            T{{ currentPlayer.unlockedTiers.d }}D
          </p>
        </div>
      </div>
    </div>

    <!-- Character Grid -->
    <div class="grid grid-cols-5 gap-3">
      <button
        v-for="character in characters"
        :key="character.id"
        @click="selectCurrentPlayer(character)"
        class="p-3 rounded-lg border-2 transition-all hover:shadow-md text-left"
        :class="
          currentPlayer?.id === character.id
            ? 'border-amber-500 bg-amber-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        "
      >
        <div class="flex flex-col items-center text-center">
          <p
            class="font-medium text-sm mb-1 truncate w-full"
            :style="{ color: getClassColor(character.class) }"
          >
            {{ capitalizeFirst(character.name) }}
          </p>
          <p class="text-xs text-gray-600 mb-1">
            {{ getClassDisplayName(character.class) }}
          </p>
          <p class="text-xs text-gray-500">
            {{ character.faction }}
          </p>
          <div v-if="currentPlayer?.id === character.id" class="text-amber-500 mt-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerCharacter } from '@/types'

// Props
interface Props {
  characters: PlayerCharacter[]
  currentPlayerId?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:currentPlayerId': [id: string]
}>()

// Computed
const currentPlayer = computed(() => {
  return props.characters.find((char) => char.id === props.currentPlayerId) || null
})

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const selectCurrentPlayer = (character: PlayerCharacter) => {
  emit('update:currentPlayerId', character.id)
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
</script>
