<template>
  <div class="inline-block w-full">
    <div class="grid grid-cols-6 gap-1">
      <label
        v-for="tier in RAID_TIERS"
        :key="tier"
        class="flex items-center justify-center px-2 py-1 border rounded cursor-pointer transition-colors text-xs focus-within:outline-2"
        :class="getTierColor(tier, modelValue.r >= tier)"
      >
        <input
          v-model="localValue.r"
          type="radio"
          :value="tier"
          name="raid-tier"
          class="sr-only"
          @change="$emit('update:modelValue', localValue)"
        />
        T{{ tier }}R
      </label>

      <label
        v-for="tier in DUNGEON_TIERS"
        :key="tier"
        class="flex items-center justify-center px-2 py-1 border rounded cursor-pointer transition-colors text-xs focus-within:outline-2"
        :class="getTierColor(tier, modelValue.d >= tier)"
      >
        <input
          v-model="localValue.d"
          type="radio"
          :value="tier"
          name="dungeon-tier"
          class="sr-only"
          @change="$emit('update:modelValue', localValue)"
        />
        T{{ tier }}D
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TierLevel } from '@/types'

// Props
interface Props {
  modelValue: {
    r: TierLevel
    d: TierLevel
  }
}

const props = defineProps<Props>()

// Emits
defineEmits<{
  'update:modelValue': [value: { r: TierLevel; d: TierLevel }]
}>()

// Local state
const localValue = ref({ ...props.modelValue })

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = { ...newValue }
  },
  { deep: true },
)

// Constants
const RAID_TIERS: TierLevel[] = [0, 1, 2, 3, 4, 5]
const DUNGEON_TIERS: TierLevel[] = [0, 1, 2, 3, 4, 5]

// WoW gear quality colors for tiers
const getTierColor = (tier: TierLevel, isUnlocked: boolean) => {
  if (!isUnlocked) {
    return 'bg-gray-100 text-gray-400 border-gray-100'
  }

  // Map tiers to WoW gear quality colors
  const tierColors: Record<TierLevel, string> = {
    0: 'font-bold bg-gray-200 text-gray-700 border-gray-500', // Grey
    1: 'font-bold bg-white text-gray-900 border-gray-500', // White
    2: 'font-bold bg-green-100 text-green-800 border-green-400', // Green
    3: 'font-bold bg-blue-100 text-blue-800 border-blue-400', // Blue
    4: 'font-bold bg-purple-100 text-purple-800 border-purple-400', // Purple
    5: 'font-bold bg-orange-100 text-orange-800 border-orange-400', // Orange
  }

  return tierColors[tier]
}
</script>
