<template>
  <div
    class="rounded-lg py-1.5 px-3 border-2 transition-colors"
    :class="[
      character.faction === 'alliance' ? 'border-blue-600' : 'border-red-600',
      'hover:border-opacity-75',
    ]"
    :style="{ backgroundColor: getClassColor(character.class) }"
  >
    <!-- Character Info -->
    <div class="flex items-center space-x-3 mb-1.5">
      <div class="flex items-center space-x-2">
        <h3 class="text-lg font-semibold text-gray-900 capitalize">{{ character.name }}</h3>
        <span class="text-xs text-gray-700">{{ character.class }}</span>
        <button 
          @click="cycleRole"
          class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full transition-colors cursor-pointer border"
          :class="getRoleBadgeClass(character.defaultRole)"
          :title="character.defaultRole ? `Click to change role (${formatRoleName(character.defaultRole)})` : 'Click to set role'"
        >
          {{ character.defaultRole ? formatRoleName(character.defaultRole) : 'Set Role' }}
        </button>
      </div>

      <!-- delete button -->
      <button
        @click="$emit('delete', character.id)"
        class="ml-auto p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer"
        title="Delete character"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>

    <!-- Tier Progression -->
    <div class="mb-1">
      <!-- Inline Tier Editor -->
      <div class="space-y-1.5">
        <TierSelector v-model="editingTiers" @update:modelValue="handleTierUpdate" />
        <div v-if="isEditing" class="flex items-center justify-end space-x-2 mt-1">
          <button
            @click="cancelTierEdit"
            class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveTierChanges"
            class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlayerCharacter, TierLevel, Role } from '@/types'
import { getClassColor } from '@/data/classes'
import { CLASS_ROLE_RESTRICTIONS } from '@/data/wow-data'
import TierSelector from './forms/TierSelector.vue'

// Props
interface Props {
  character: PlayerCharacter
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  edit: [character: PlayerCharacter]
  delete: [characterId: string]
  'update:tiers': [characterId: string, tiers: { r: TierLevel; d: TierLevel }]
  'update:role': [characterId: string, role: Role]
}>()

// Reactive state for inline editing
const isEditing = ref(false)
const editingTiers = ref({ ...props.character.unlockedTiers })

// Computed
const availableRoles = computed(() => {
  return CLASS_ROLE_RESTRICTIONS[props.character.class] || []
})

// WoW gear quality colors for tiers
const getTierColor = (tier: TierLevel, isUnlocked: boolean) => {
  if (!isUnlocked) {
    return 'bg-gray-100 text-gray-500 border-gray-300'
  }

  // Map tiers to WoW gear quality colors
  const tierColors: Record<TierLevel, string> = {
    0: 'bg-gray-100 text-gray-700 border-gray-400', // Grey
    1: 'bg-white text-gray-900 border-gray-400', // White
    2: 'bg-green-100 text-green-800 border-green-400', // Green
    3: 'bg-blue-100 text-blue-800 border-blue-400', // Blue
    4: 'bg-purple-100 text-purple-800 border-purple-400', // Purple
    5: 'bg-orange-100 text-orange-800 border-orange-400', // Orange
  }

  return tierColors[tier]
}

// Methods
const formatRoleName = (role: Role) => {
  const roleNames: Record<Role, string> = {
    tank: 'Tank',
    healer: 'Healer',
    mdps: 'Melee DPS',
    rdps: 'Ranged DPS',
    dps: 'DPS',
    frost: 'Frost',
    fire: 'Fire',
    arcane: 'Arcane',
    magic: 'Magic',
    might: 'Might',
  }
  return roleNames[role] || role
}

const getRoleBadgeClass = (role: Role | undefined) => {
  if (!role) {
    return 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
  }

  const baseClasses = 'hover:opacity-80'
  switch (role) {
    case 'tank':
      return `bg-blue-100 text-blue-800 border-blue-200 ${baseClasses}`
    case 'healer':
      return `bg-green-100 text-green-800 border-green-200 ${baseClasses}`
    case 'mdps':
    case 'rdps':
    case 'dps':
    case 'might':
      return `bg-red-100 text-red-800 border-red-200 ${baseClasses}`
    case 'frost':
      return `bg-cyan-100 text-cyan-800 border-cyan-200 ${baseClasses}`
    case 'fire':
      return `bg-orange-100 text-orange-800 border-orange-200 ${baseClasses}`
    case 'arcane':
      return `bg-purple-100 text-purple-800 border-purple-200 ${baseClasses}`
    case 'magic':
      return `bg-pink-100 text-pink-800 border-pink-200 ${baseClasses}`
    default:
      return `bg-gray-100 text-gray-800 border-gray-200 ${baseClasses}`
  }
}

const handleTierUpdate = (newTiers: { r: TierLevel; d: TierLevel }) => {
  isEditing.value = true
  editingTiers.value = newTiers
}

const saveTierChanges = () => {
  // Emit the tier update
  emit('update:tiers', props.character.id, editingTiers.value)
  isEditing.value = false
}

const cancelTierEdit = () => {
  editingTiers.value = { ...props.character.unlockedTiers }
  isEditing.value = false
}

// Start editing when edit button is clicked
const startEditing = () => {
  isEditing.value = true
  editingTiers.value = { ...props.character.unlockedTiers }
}

const cycleRole = () => {
  const currentRole = props.character.defaultRole
  
  // If no role is set, start with the first available role for the class
  if (!currentRole) {
    if (availableRoles.value.length > 0) {
      emit('update:role', props.character.id, availableRoles.value[0])
    }
    return
  }
  
  const currentIndex = availableRoles.value.indexOf(currentRole)
  const nextIndex = (currentIndex + 1) % availableRoles.value.length
  const nextRole = availableRoles.value[nextIndex]
  
  emit('update:role', props.character.id, nextRole)
}
</script>
