<template>
  <div
    @click="!isDisabled && $emit('click')"
    class="flex-shrink-0 border rounded-lg p-2 transition-all duration-200 overflow-hidden relative"
    :class="[
      slotClasses,
      isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-md',
    ]"
    :style="{ backgroundColor: getBackgroundColor() }"
    :title="isDisabled ? 'Not available on current player' : undefined"
  >
    <!-- Role badge in top right -->
    <div
      v-if="slot?.role"
      class="absolute top-1 right-1 px-1 py-0.5 text-xs font-medium rounded-full"
      :class="getRoleBadgeClass(slot.role)"
    >
      {{ getRoleDisplayName(slot.role) }}
    </div>

    <div class="flex items-start justify-between h-full">
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm truncate" :style="{ color: getDisplayNameColor() }">
          {{ displayName }}
        </div>
        <div class="text-xs font-medium truncate" :style="{ color: getTierTextColor() }">
          {{ getTierDisplayName() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { PlayerSlot, PlayerCharacter, Role } from '@/types'

// Props
interface Props {
  slot: PlayerSlot | null
  slotIndex: number
  isFirstSlot: boolean
  isDisabled?: boolean
  character: PlayerCharacter
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  click: []
}>()

// Computed
const displayName = computed(() => {
  if (props.isDisabled) {
    return 'Not Available'
  }

  if (!props.slot) {
    return props.isFirstSlot ? `${capitalizeFirst(props.character.name)}-lite` : 'Group Member'
  }

  if (props.slot.isCharacter && props.slot.characterName) {
    return props.isFirstSlot
      ? `${capitalizeFirst(props.slot.characterName)}-lite`
      : capitalizeFirst(props.slot.characterName)
  }

  return getClassDisplayName(props.slot.class)
})

const slotClasses = computed(() => {
  if (props.isDisabled) {
    return 'border-dashed border-red-300 bg-red-50'
  }

  if (!props.slot) {
    return 'border-dashed border-gray-300 bg-white hover:border-gray-400'
  }

  // Get tier level color based on tier level (0-5) - matching TierSelector colors
  const getTierBorderColor = (tier: number) => {
    switch (tier) {
      case 0:
        return 'border-gray-500' // Grey
      case 1:
        return 'border-gray-500' // White
      case 2:
        return 'border-green-400' // Green
      case 3:
        return 'border-blue-400' // Blue
      case 4:
        return 'border-purple-400' // Purple
      case 5:
        return 'border-orange-400' // Orange
      default:
        return 'border-gray-500'
    }
  }

  const borderColor = getTierBorderColor(props.slot.tier)
  const borderWidth = props.isFirstSlot ? 'border-2' : 'border'

  return `${borderColor} ${borderWidth}`
})

const iconClasses = computed(() => {
  if (!props.slot) {
    return 'text-gray-400'
  }

  if (props.isFirstSlot) {
    return 'text-red-500'
  }

  return 'text-blue-500'
})

// Methods
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getRoleBadgeClass = (role: Role) => {
  switch (role) {
    case 'tank':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'healer':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'mdps':
    case 'rdps':
    case 'dps':
      return 'bg-red-100 text-red-800 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

const getRoleDisplayName = (role: Role) => {
  switch (role) {
    case 'tank':
      return 'Tank'
    case 'healer':
      return 'Healer'
    case 'mdps':
      return 'Melee DPS'
    case 'rdps':
      return 'Ranged DPS'
    case 'dps':
      return 'DPS'
    default:
      return role
  }
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

const getTierTextColor = () => {
  if (!props.slot) {
    return '#6B7280' // gray-500 for good contrast on white background
  }

  // Use darker text for contrast on class-colored backgrounds
  return '#4B5563' // gray-600 for good contrast
}

const getTierDisplayName = () => {
  if (props.isDisabled) {
    return 'Current player limit'
  }

  if (!props.slot || props.slot.isCharacter) {
    return `T${props.character.unlockedTiers.r}R/T${props.character.unlockedTiers.d}D`
  }

  const tierName = `T${props.slot.tier}`
  const typeName = props.slot.tierType === 'R' ? 'R' : 'D'
  return `${tierName}${typeName}`
}

const getBackgroundColor = () => {
  if (props.isDisabled) {
    return '#FEF2F2' // red-50 for disabled slots
  }

  if (!props.slot) {
    return '#FFFFFF' // white background for empty slots
  }

  // Use class color as background with reduced opacity
  const classColor = getClassColor(props.slot.class)
  return classColor + '25' // Add 25% opacity
}

const getDisplayNameColor = () => {
  if (!props.slot) {
    return '#374151' // gray-700 for good contrast on white background
  }

  // Use dark text for contrast on class-colored backgrounds
  return '#1F2937' // gray-800 for good contrast
}
</script>
