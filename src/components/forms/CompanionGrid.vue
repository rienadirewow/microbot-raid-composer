<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    <CompanionSlot
      v-for="companionIndex in 4"
      :key="companionIndex"
      :slot-number="companionIndex"
      :character-race="characterRace"
      :unlocked-tiers="unlockedTiers"
      @select="$emit('select', companionIndex)"
      @update:form="$emit('update:form', companionIndex, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TierLevel, Race } from '@/types'
import CompanionSlot from './CompanionSlot.vue'

// Props
interface Props {
  characterRace: Race
  unlockedTiers: {
    r: TierLevel
    d: TierLevel
  }
}

defineProps<Props>()

// Emits
defineEmits<{
  select: [companionIndex: number]
  'update:form': [
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
