<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <CharacterHeader :character="character" :available-slots="availableSlots" />

    <CompanionGrid
      :character-race="character.race"
      :unlocked-tiers="character.unlockedTiers"
      @select="$emit('select', character, $event)"
      @update:form="$emit('update:form', character, $event, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlayerCharacter } from '@/types'
import CharacterHeader from './CharacterHeader.vue'
import CompanionGrid from './CompanionGrid.vue'

// Props
interface Props {
  character: PlayerCharacter
  availableSlots: number
}

defineProps<Props>()

// Emits
defineEmits<{
  select: [character: PlayerCharacter, companionIndex: number]
  'update:form': [
    character: PlayerCharacter,
    companionIndex: number,
    form: {
      name: string
      class: string
      role: string
      tier: number
    },
  ]
}>()
</script>
