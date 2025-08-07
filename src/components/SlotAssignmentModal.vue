<template>
  <Modal v-if="isOpen" :title="modalTitle" @close="$emit('close')">
    <div class="space-y-6">
      <!-- License Type Selection -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-3">Select License Type</h3>
        <div class="flex space-x-3">
          <button
            @click="selectedTierType = 'R'"
            class="flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
            :class="
              selectedTierType === 'R'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
          >
            Raid License (T{{ character.unlockedTiers.r }})
          </button>
          <button
            @click="selectedTierType = 'D'"
            class="flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md"
            :class="
              selectedTierType === 'D'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-100 text-gray-700 hover:bg-purple-200'
            "
          >
            Dungeon License (T{{ character.unlockedTiers.d }})
          </button>
        </div>
      </div>

      <!-- Role Selection -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-3">Select Role</h3>
        <div class="flex space-x-3">
          <button
            v-for="roleButton in roleButtons"
            :key="roleButton.role"
            @click="selectedRole = roleButton.role"
            class="flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-md border-2"
            :class="
              selectedRole === roleButton.role
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
            "
            :style="{
              borderColor: selectedRole === roleButton.role ? roleButton.color : 'transparent',
            }"
          >
            <component
              :is="roleButton.icon"
              class="h-4 w-4 mr-2"
              :style="{ color: roleButton.color }"
            />
            {{ getRoleDisplayName(roleButton.role) }}
          </button>
        </div>
      </div>

      <!-- Class Selection -->
      <div>
        <h3 class="text-lg font-bold text-slate-800 mb-3">
          Select Class {{ isFirstSlot ? '(Character Class)' : '' }}
        </h3>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="wowClass in availableClasses"
            :key="wowClass"
            @click="selectedClass = wowClass"
            :disabled="
              !canAssignRole(wowClass, selectedRole) ||
              (isFirstSlot && wowClass !== character.class)
            "
            class="p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md"
            :class="
              selectedClass === wowClass
                ? 'border-blue-500'
                : canAssignRole(wowClass, selectedRole) &&
                    (!isFirstSlot || wowClass === character.class)
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 cursor-not-allowed opacity-50'
            "
            :style="{
              backgroundColor: getClassButtonBackground(wowClass),
              ringColor: wowClass === character.class ? '#EAB308' : 'transparent',
              ringWidth: wowClass === character.class ? '2px' : '0px',
            }"
          >
            <div class="flex items-center justify-between">
              <h4
                class="font-bold text-base"
                :style="{
                  color:
                    canAssignRole(wowClass, selectedRole) &&
                    (!isFirstSlot || wowClass === character.class)
                      ? '#1F2937'
                      : '#6B7280',
                }"
              >
                {{ getClassDisplayName(wowClass) }}
              </h4>
              <div v-if="wowClass === character.class" class="w-5 h-5 text-amber-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <p
              v-if="!canAssignRole(wowClass, selectedRole)"
              class="text-sm text-red-600 mt-2 font-medium"
            >
              Cannot be {{ getRoleDisplayName(selectedRole) }}
            </p>
            <p
              v-if="isFirstSlot && wowClass !== character.class"
              class="text-sm text-amber-600 mt-2 font-medium"
            >
              Must use character's class
            </p>
          </button>
        </div>
      </div>

      <!-- Tier Info -->
      <div class="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
        <p class="text-base text-slate-700 font-medium">
          <strong>Selected Gear Tier:</strong> T{{ getCurrentTier() }}{{ selectedTierType }}
          {{ isFirstSlot ? ' (Character tier)' : ' (Inherited from character)' }}
        </p>
        <p class="text-base text-slate-700 font-medium mt-2">
          <strong>Faction:</strong> {{ character.faction }}
        </p>
        <p v-if="isFirstSlot" class="text-base text-slate-700 font-medium mt-2">
          <strong>Type:</strong> Control Member
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between pt-6 border-t border-slate-200">
      <Button v-if="currentSlot" type="button" variant="danger" size="sm" @click="handleClearSlot">
        Clear Slot
      </Button>
      <div class="flex space-x-3 ml-auto">
        <Button type="button" variant="secondary" size="sm" @click="$emit('close')">
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          :disabled="
            !canAssignRole(selectedClass, selectedRole) ||
            (isFirstSlot && selectedClass !== character.class)
          "
          @click="handleAssign"
        >
          Assign {{ isFirstSlot ? 'Character' : 'Group Member' }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlayerSlot, PlayerCharacter, Role, WoWClass, TierType } from '@/types'
import { CLASS_ROLE_RESTRICTIONS } from '@/data/wow-data'
import Modal from './ui/Modal.vue'
import Button from './ui/Button.vue'

// Props
interface Props {
  isOpen: boolean
  rowIndex: number
  slotIndex: number
  currentSlot: PlayerSlot | null
  character: PlayerCharacter
  isFirstSlot: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  assignSlot: [wowClass: WoWClass, role: Role, tierType: TierType]
  clearSlot: []
}>()

// State
const selectedRole = ref<Role>(props.currentSlot?.role || 'dps')
const selectedClass = ref<WoWClass>(
  props.currentSlot?.class || (props.isFirstSlot ? props.character.class : 'warrior'),
)
const selectedTierType = ref<TierType>(props.currentSlot?.tierType || 'R')

// Computed
const modalTitle = computed(() => {
  return `Configure ${props.isFirstSlot ? props.character.name : `${props.character.name}'s Group Member`}`
})

const roleButtons = computed(() => {
  const baseRoles = [
    { role: 'tank' as Role, icon: 'ShieldIcon', color: '#3B82F6' },
    { role: 'healer' as Role, icon: 'HeartIcon', color: '#10B981' },
    { role: 'dps' as Role, icon: 'SwordIcon', color: '#EF4444' },
  ]

  // For lite characters (non-control members), only allow applicable roles
  if (!props.isFirstSlot) {
    return baseRoles.filter(roleButton => {
      // Check if the character's class can fulfill this role
      return canAssignRole(props.character.class, roleButton.role)
    })
  }

  return baseRoles
})

const availableClasses = computed(() => {
  const allClasses: WoWClass[] = [
    'warrior',
    'paladin',
    'hunter',
    'rogue',
    'priest',
    'shaman',
    'mage',
    'warlock',
    'druid',
  ]
  return allClasses.filter((cls) => {
    // Filter based on faction restrictions
    if (cls === 'paladin' && props.character.faction !== 'alliance') return false
    if (cls === 'shaman' && props.character.faction !== 'horde') return false
    return true
  })
})

// Methods
const canAssignRole = (wowClass: WoWClass, role: Role): boolean => {
  const allowedRoles = CLASS_ROLE_RESTRICTIONS[wowClass]
  if (!allowedRoles) return false

  // Map our role types to the restrictions
  if (role === 'dps') {
    return (
      allowedRoles.includes('dps') || allowedRoles.includes('mdps') || allowedRoles.includes('rdps')
    )
  }
  if (role === 'mdps') {
    return allowedRoles.includes('mdps') || allowedRoles.includes('dps')
  }
  if (role === 'rdps') {
    return allowedRoles.includes('rdps') || allowedRoles.includes('dps')
  }

  return allowedRoles.includes(role)
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

const getCurrentTier = () => {
  return selectedTierType.value === 'R'
    ? props.character.unlockedTiers.r
    : props.character.unlockedTiers.d
}

const getClassButtonBackground = (wowClass: string) => {
  if (
    !canAssignRole(wowClass as WoWClass, selectedRole.value) ||
    (props.isFirstSlot && wowClass !== props.character.class)
  ) {
    return '#F3F4F6' // gray-100 for disabled
  }

  if (selectedClass.value === wowClass) {
    return '#EFF6FF' // blue-50 for selected
  }

  // Use class color as background with reduced opacity
  const classColor = getClassColor(wowClass)
  return classColor + '20' // Add 20% opacity
}

const handleAssign = () => {
  if (canAssignRole(selectedClass.value, selectedRole.value)) {
    emit('assignSlot', selectedClass.value, selectedRole.value, selectedTierType.value)
    emit('close')
  }
}

const handleClearSlot = () => {
  emit('clearSlot')
  emit('close')
}

// Simple icon components
const ShieldIcon = {
  template:
    '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>',
}

const HeartIcon = {
  template:
    '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>',
}

const SwordIcon = {
  template:
    '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',
}
</script>
