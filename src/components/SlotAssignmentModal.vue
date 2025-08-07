<template>
  <Modal v-if="isOpen" :title="modalTitle" @close="$emit('close')">
    <div class="space-y-6">
      <!-- License Type Selection - Only show for non-first slots -->
      <div v-if="!isFirstSlot">
        <h3 class="text-lg font-bold text-slate-800 mb-3">Select License Type</h3>
        <div class="space-y-3">
          <!-- Raid tiers -->
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="tier in [0, 1, 2, 3, 4, 5]"
              :key="`R${tier}`"
              @click="selectLicenseType('R', tier as TierLevel)"
              :disabled="!availableRaidTiers.includes(tier as TierLevel)"
              class="flex items-center justify-center px-2 py-1 border rounded cursor-pointer transition-colors text-xs"
              :class="getLicenseTypeButtonClass('R', tier as TierLevel)"
            >
              T{{ tier }}R
            </button>
          </div>
          <!-- Dungeon tiers -->
          <div class="grid grid-cols-6 gap-1">
            <button
              v-for="tier in [0, 1, 2, 3, 4, 5]"
              :key="`D${tier}`"
              @click="selectLicenseType('D', tier as TierLevel)"
              :disabled="!availableDungeonTiers.includes(tier as TierLevel)"
              class="flex items-center justify-center px-2 py-1 border rounded cursor-pointer transition-colors text-xs"
              :class="getLicenseTypeButtonClass('D', tier as TierLevel)"
            >
              T{{ tier }}D
            </button>
          </div>
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

      <!-- Class Selection - Only show for non-first slots -->
      <div v-if="!isFirstSlot">
        <h3 class="text-lg font-bold text-slate-800 mb-3">Select Class</h3>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="wowClass in availableClasses"
            :key="wowClass"
            @click="selectedClass = wowClass"
            :disabled="!canAssignRole(wowClass, selectedRole)"
            class="p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md"
            :class="
              selectedClass === wowClass
                ? 'border-blue-500'
                : canAssignRole(wowClass, selectedRole)
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 cursor-not-allowed opacity-50'
            "
            :style="{
              backgroundColor: getClassButtonBackground(wowClass),
            }"
          >
            <div class="flex items-center justify-between">
              <h4
                class="font-bold text-base"
                :style="{
                  color: canAssignRole(wowClass, selectedRole) ? '#1F2937' : '#6B7280',
                }"
              >
                {{ getClassDisplayName(wowClass) }}
              </h4>
            </div>
          </button>
        </div>
      </div>

      <!-- Tier Info -->
      <div class="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-slate-200">
        <p class="text-base text-slate-700 font-medium">
          <strong>Selected Gear Tier:</strong> T{{ getCurrentTier() }}{{ selectedTierType }}
          {{ isFirstSlot ? ' (Character tier)' : ` (Inherited from ${character.name})` }}
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
import type { PlayerSlot, PlayerCharacter, Role, WoWClass, TierType, TierLevel } from '@/types'
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
  assignSlot: [wowClass: WoWClass, role: Role, tierType: TierType, tier: TierLevel]
  clearSlot: []
}>()

// Helper functions (defined before use)
const getDefaultRole = (): Role => {
  // For character slots, prioritize tank > healer > dps
  if (props.isFirstSlot) {
    if (canAssignRole(props.character.class, 'tank')) {
      return 'tank'
    } else if (canAssignRole(props.character.class, 'healer')) {
      return 'healer'
    } else {
      return 'dps'
    }
  }
  
  // For companion slots, default to dps
  return 'dps'
}

const getDefaultTierType = (): TierType => {
  // Default to the license type with the higher tier
  if (props.character.unlockedTiers.r >= props.character.unlockedTiers.d) {
    return 'R'
  } else {
    return 'D'
  }
}

const getHighestAvailableTier = (): TierLevel => {
  // For first slot (character), use the character's highest tier
  if (props.isFirstSlot) {
    return Math.max(props.character.unlockedTiers.r, props.character.unlockedTiers.d) as TierLevel
  }

  // For group members, use the character's highest tier as default
  return Math.max(props.character.unlockedTiers.r, props.character.unlockedTiers.d) as TierLevel
}

// State
const selectedRole = ref<Role>(props.currentSlot?.role || getDefaultRole())
const selectedClass = ref<WoWClass>(
  props.currentSlot?.class || (props.isFirstSlot ? props.character.class : 'warrior'),
)
const selectedTierType = ref<TierType>(props.currentSlot?.tierType || getDefaultTierType())

// License type selection state
const selectedLicenseType = ref<{ type: TierType; tier: TierLevel }>({
  type: props.currentSlot?.tierType || 'R',
  tier: props.currentSlot?.tier || getHighestAvailableTier(),
})

// Computed
const modalTitle = computed(() => {
  return `Configure ${props.isFirstSlot ? props.character.name : `${props.character.name}'s Group Member`}`
})

const roleButtons = computed(() => {
  const baseRoles = [
    { role: 'tank' as Role, icon: ShieldIcon, color: '#3B82F6' },
    { role: 'healer' as Role, icon: HeartIcon, color: '#10B981' },
    { role: 'dps' as Role, icon: SwordIcon, color: '#EF4444' },
  ]

  // Only filter roles for character slots (first slot)
  if (props.isFirstSlot) {
    return baseRoles.filter((roleButton) => {
      // Check if the character's class can fulfill this role
      return canAssignRole(props.character.class, roleButton.role)
    })
  }

  // For companion/group member slots, show all roles
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

const availableRaidTiers = computed(() => {
  const tiers: TierLevel[] = []
  for (let i = 0; i <= props.character.unlockedTiers.r; i++) {
    tiers.push(i as TierLevel)
  }
  return tiers
})

const availableDungeonTiers = computed(() => {
  const tiers: TierLevel[] = []
  for (let i = 0; i <= props.character.unlockedTiers.d; i++) {
    tiers.push(i as TierLevel)
  }
  return tiers
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
  if (props.isFirstSlot) {
    return selectedTierType.value === 'R'
      ? props.character.unlockedTiers.r
      : props.character.unlockedTiers.d
  }

  // For group members, use the selected license type
  return selectedLicenseType.value.tier
}



const selectLicenseType = (type: TierType, tier: TierLevel) => {
  selectedLicenseType.value = { type, tier }
  selectedTierType.value = type
}

const getLicenseTypeButtonClass = (type: TierType, tier: TierLevel) => {
  const isSelected =
    selectedLicenseType.value.type === type && selectedLicenseType.value.tier === tier
  const isAvailable =
    type === 'R'
      ? availableRaidTiers.value.includes(tier)
      : availableDungeonTiers.value.includes(tier)

  // Get tier color based on WoW gear quality colors
  const getTierColor = (tier: TierLevel) => {
    switch (tier) {
      case 0:
        return 'bg-gray-200 text-gray-700 border-gray-500'
      case 1:
        return 'bg-white text-gray-900 border-gray-500'
      case 2:
        return 'bg-green-100 text-green-800 border-green-400'
      case 3:
        return 'bg-blue-100 text-blue-800 border-blue-400'
      case 4:
        return 'bg-purple-100 text-purple-800 border-purple-400'
      case 5:
        return 'bg-orange-100 text-orange-800 border-orange-400'
      default:
        return 'bg-gray-200 text-gray-700 border-gray-500'
    }
  }

  if (!isAvailable) {
    return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
  }

  if (isSelected) {
    return `font-bold ${getTierColor(tier)} border-3 shadow-lg scale-105`
  } else {
    return `font-bold ${getTierColor(tier)} hover:opacity-80 hover:scale-105 transition-transform`
  }
}

const getClassButtonBackground = (wowClass: string) => {
  if (!canAssignRole(wowClass as WoWClass, selectedRole.value)) {
    return '#F3F4F6' // gray-100 for disabled
  }

  // Use class color as background with reduced opacity
  const classColor = getClassColor(wowClass)
  return classColor + '25' // Add 25% opacity
}

const handleAssign = () => {
  if (canAssignRole(selectedClass.value, selectedRole.value)) {
    const tier = getCurrentTier()
    emit('assignSlot', selectedClass.value, selectedRole.value, selectedTierType.value, tier)
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
