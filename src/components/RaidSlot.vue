<template>
  <div
    @click="$emit('click')"
    class="flex-shrink-0 w-48 h-24 border-2 rounded-lg p-3 transition-all duration-200 cursor-pointer hover:shadow-md"
    :class="slotClasses"
  >
    <div class="flex items-start justify-between h-full">
      <div class="flex-1">
        <div class="font-medium text-gray-900">
          {{ displayName }}
        </div>
        <div
          v-if="slot?.role"
          class="inline-block px-2 py-1 text-xs rounded-full mt-1"
          :class="getRoleBadgeClass(slot.role)"
        >
          {{ getRoleDisplayName(slot.role) }}
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ getTierDisplayName() }}
        </div>
      </div>
      <div class="w-4 h-4" :class="iconClasses">
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
    return props.isFirstSlot ? `${props.character.name}-lite` : 'Group Member'
  }

  if (props.slot.isCharacter && props.slot.characterName) {
    return props.slot.characterName
  }

  return getClassDisplayName(props.slot.class)
})

const slotClasses = computed(() => {
  if (!props.slot) {
    return 'border-dashed border-gray-300 bg-white hover:border-gray-400'
  }

  if (props.isFirstSlot) {
    return 'border-green-500 border-4 bg-green-50'
  }

  return 'border-green-400 bg-white'
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
const getRoleBadgeClass = (role: Role) => {
  switch (role) {
    case 'tank':
      return 'bg-blue-100 text-blue-800'
    case 'healer':
      return 'bg-green-100 text-green-800'
    case 'mdps':
    case 'rdps':
    case 'dps':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
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

const getTierDisplayName = () => {
  if (!props.slot) {
    return `R:T${props.character.unlockedTiers.r} D:T${props.character.unlockedTiers.d}`
  }
  
  const tierName = `T${props.slot.tier}`
  const typeName = props.slot.tierType === 'R' ? 'R' : 'D'
  return `${tierName}${typeName} gear`
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
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>'
}

const CrownIcon = {
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>'
}

const ShieldIcon = {
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
}

const HeartIcon = {
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>'
}

const SwordIcon = {
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>'
}

const CheckIcon = {
  template: '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
}
</script>
