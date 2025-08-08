<template>
  <div class="flex items-center justify-between mb-3">
    <div class="flex items-center space-x-3">
      <FactionBadge :faction="character.faction" />
      <h4 class="font-medium text-gray-900">{{ character.name }}</h4>
      <span class="text-sm text-gray-500">
        Level {{ character.level }} {{ character.race }} {{ character.class }}
      </span>
    </div>
    <span class="text-sm text-gray-500"> {{ availableSlots }}/4 companions available </span>
  </div>
</template>

<script setup lang="ts">
import type { PlayerCharacter } from '@/types'
import FactionBadge from '../ui/FactionBadge.vue'

// Props
interface Props {
  character: PlayerCharacter
  availableSlots: number
}

defineProps<Props>()
</script>
