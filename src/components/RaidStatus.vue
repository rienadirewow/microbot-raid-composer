<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ raidName }}</h2>
        <p class="text-sm text-gray-600">{{ raidType }}</p>
      </div>
      <ProgressBar :value="filledSlots" :max="40" />
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center space-x-4">
      <Button variant="success" size="sm" @click="$emit('save')">Save Raid</Button>
      <Button variant="warning" size="sm" @click="$emit('export')">Export Commands</Button>
      <Button variant="secondary" size="sm" @click="$emit('clear')">Clear</Button>
    </div>

    <!-- Companion Availability -->
    <div class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Available Companions</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="character in characters"
          :key="character.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded border"
        >
          <div class="flex items-center space-x-2">
            <FactionBadge :faction="character.faction" />
            <span class="text-sm font-medium text-gray-900">{{ character.name }}</span>
            <span class="text-xs text-gray-500">{{ character.class }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <div
              v-for="i in 4"
              :key="i"
              class="w-2 h-2 rounded-full border"
              :class="
                i <= getAvailableCompanionSlots(character)
                  ? 'bg-green-500 border-green-500'
                  : 'bg-gray-300 border-gray-300'
              "
            ></div>
            <span class="text-xs text-gray-600 ml-1">
              {{ getAvailableCompanionSlots(character) }}/4
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerCharacter } from '@/types'
import ProgressBar from './ui/ProgressBar.vue'
import Button from './ui/Button.vue'
import FactionBadge from './ui/FactionBadge.vue'

// Props
interface Props {
  raidName: string
  raidType: string
  filledSlots: number
  characters: PlayerCharacter[]
  getAvailableCompanionSlots: (character: PlayerCharacter) => number
}

defineProps<Props>()

// Emits
defineEmits<{
  save: []
  export: []
  clear: []
}>()
</script>
