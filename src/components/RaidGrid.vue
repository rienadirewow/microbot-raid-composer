<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white mb-2">Raid Composition</h2>
      <p class="text-gray-300">Each row represents a character and their group members</p>
      
      <div v-if="currentPlayer" class="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
        <div class="flex items-center">
          <div class="w-6 h-6 text-yellow-400 mr-3">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-white">Current Player</h3>
            <p class="text-sm" :style="{ color: getClassColor(currentPlayer.class) }">
              {{ currentPlayer.name }} - {{ getClassDisplayName(currentPlayer.class) }} ({{ currentPlayer.faction }})
            </p>
            <p class="text-xs text-gray-300 mt-1">
              Raid License: {{ currentPlayer.unlockedTiers.r.toUpperCase() }} | Dungeon License: {{ currentPlayer.unlockedTiers.d.toUpperCase() }}
            </p>
          </div>
        </div>
      </div>
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

// Props
interface Props {
  composition: Composition
  characters: PlayerCharacter[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  slotClick: [rowIndex: number, slotIndex: number]
}>()

// Computed
const currentPlayer = computed(() => {
  return props.characters.find(char => char.name === 'Current Player') || null
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
    druid: '#FF7D0A'
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
    druid: 'Druid'
  }
  return classNames[wowClass] || wowClass
}
</script>
