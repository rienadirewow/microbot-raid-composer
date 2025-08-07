<template>
  <div
    class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
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
              {{ currentPlayer.name }} - {{ getClassDisplayName(currentPlayer.class) }} ({{
                currentPlayer.faction
              }})
            </p>
            <button
              @click="showSelector = true"
              class="text-amber-600 hover:text-amber-700 text-sm underline"
            >
              Change
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <p class="text-base text-amber-700">No current player selected</p>
            <button
              @click="showSelector = true"
              class="text-amber-600 hover:text-amber-700 text-sm underline"
            >
              Select
            </button>
          </div>
          <p v-if="currentPlayer" class="text-sm text-amber-700 mt-2 truncate">
            Raid License: {{ currentPlayer.unlockedTiers.r.toUpperCase() }} | Dungeon License:
            {{ currentPlayer.unlockedTiers.d.toUpperCase() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Character Selector Modal -->
    <div
      v-if="showSelector"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showSelector = false"
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
                <p class="font-medium" :style="{ color: getClassColor(character.class) }">
                  {{ character.name }}
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
            @click="showSelector = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// State
const showSelector = ref(false)

// Computed
const currentPlayer = computed(() => {
  return props.characters.find((char) => char.id === props.currentPlayerId) || null
})

// Methods
const selectCurrentPlayer = (character: PlayerCharacter) => {
  emit('update:currentPlayerId', character.id)
  showSelector.value = false
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
