<template>
  <div
    @click="$emit('click')"
    class="flex-shrink-0 w-48 h-24 border rounded-xl p-3 transition-all duration-200 cursor-pointer hover:shadow-md overflow-hidden relative"
    :class="slotClasses"
    :style="{ backgroundColor: getBackgroundColor() }"
  >
    <!-- Role badge in top right -->
    <div
      v-if="slot?.role"
      class="absolute top-2 right-2 px-1.5 py-0.5 text-xs font-medium rounded-full"
      :class="getRoleBadgeClass(slot.role)"
    >
      {{ getRoleDisplayName(slot.role) }}
    </div>

    <div class="flex items-start justify-between h-full">
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-base truncate" :style="{ color: getDisplayNameColor() }">
          {{ displayName }}
        </div>
        <div class="text-xs font-medium truncate" :style="{ color: getTierTextColor() }">
          {{ getTierDisplayName() }}
        </div>
      </div>
      <div class="w-5 h-5 flex-shrink-0 ml-2" :class="iconClasses">
        <component :is="getRoleIcon()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerSlot, PlayerCharacter, Role } from '@/types'

// Props
interface Props {
  slot: PlayerSlot | null
  slotIndex: number
  isFirstSlot: boolean
  character: PlayerCharacter
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  click: []
}>()

// Computed
const displayName = computed(() => {
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
  if (!props.slot) {
    return `R:T${props.character.unlockedTiers.r} D:T${props.character.unlockedTiers.d}`
  }

  const tierName = `T${props.slot.tier}`
  const typeName = props.slot.tierType === 'R' ? 'R' : 'D'
  return `${tierName}${typeName}`
}

const getBackgroundColor = () => {
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

const getRoleIcon = () => {
  if (!props.slot) {
    return UserIcon
  }

  if (props.isFirstSlot) {
    return CrownIcon
  }

  switch (props.slot.role) {
    case 'tank':
      return ShieldIcon
    case 'healer':
      return HeartIcon
    case 'mdps':
    case 'rdps':
    case 'dps':
      return SwordIcon
    default:
      return CheckIcon
  }
}

// Icon components
const UserIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>',
}

const CrownIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>',
}

const ShieldIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
}

const HeartIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
}

const SwordIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
}

const CheckIcon = {
  template:
    '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
}
</script>
