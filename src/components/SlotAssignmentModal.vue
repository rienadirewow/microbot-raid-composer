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
        <div class="flex flex-wrap gap-3">
          <button
            v-for="roleButton in roleButtons"
            :key="roleButton.role"
            @click="handleRoleSelect(roleButton.role, roleButton.isEnabled)"
            class="flex items-center px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 cursor-pointer"
            :class="[
              !roleButton.isEnabled
                ? 'bg-gray-100 text-gray-400 border-transparent opacity-50 hover:opacity-75'
                : selectedRole === roleButton.role
                  ? 'bg-blue-50 border-blue-500 text-blue-700 hover:shadow-md'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200 hover:shadow-md'
            ]"
            :style="{
              borderColor: roleButton.isEnabled && selectedRole === roleButton.role ? roleButton.color : 'transparent',
            }"
          >
            <component
              :is="roleButton.icon"
              class="h-4 w-4 mr-2"
              :style="{ color: roleButton.isEnabled ? roleButton.color : '#9CA3AF' }"
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
            @click="handleClassSelect(wowClass)"
            class="p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md cursor-pointer"
            :class="
              selectedClass === wowClass
                ? 'border-blue-500'
                : canAssignRole(wowClass, selectedRole)
                  ? 'border-gray-300 hover:border-gray-400'
                  : 'border-gray-200 opacity-50 hover:opacity-70'
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

      <!-- Race Selection - Only show for non-first slots (companions) -->
      <div v-if="!isFirstSlot">
        <h3 class="text-lg font-bold text-slate-800 mb-3">Select Race (Optional)</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="race in availableRaces"
            :key="race"
            @click="toggleRace(race)"
            class="p-3 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-sm"
            :class="
              selectedRace === race
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            "
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ getRaceDisplayName(race) }}</span>
              <div v-if="selectedRace === race" class="w-5 h-5 text-blue-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          Click to select/deselect. Useful for specific needs like Dwarf Priest (Fear Ward)
        </p>
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
import { ref, computed, h, watch } from 'vue'
import type { PlayerSlot, PlayerCharacter, Role, WoWClass, TierType, TierLevel, Race } from '@/types'
import { CLASS_ROLE_RESTRICTIONS, CLASS_DEFAULT_ROLES, ALLIANCE_RACES, HORDE_RACES, CLASS_RACE_RESTRICTIONS } from '@/data/wow-data'
import { getClassColor } from '@/data/classes'
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
  assignSlot: [wowClass: WoWClass, role: Role, tierType: TierType, tier: TierLevel, race?: Race]
  clearSlot: []
}>()

// Helper functions (defined before use)
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

const getDefaultRole = (wowClass?: WoWClass): Role => {
  if (!props.character) {
    return 'mdps'
  }

  if (props.isFirstSlot) {
    if (props.character.defaultRole) {
      return props.character.defaultRole
    }
    return CLASS_DEFAULT_ROLES[props.character.class] || 'mdps'
  }

  const classToUse = wowClass || 'warrior'
  return CLASS_DEFAULT_ROLES[classToUse] || 'mdps'
}

const getDefaultTierType = (): TierType => {
  // Add null check for character
  if (!props.character) {
    return 'R'
  }
  
  // Default to the license type with the higher tier
  if (props.character.unlockedTiers.r >= props.character.unlockedTiers.d) {
    return 'R'
  } else {
    return 'D'
  }
}

const getHighestAvailableTier = (): TierLevel => {
  // Add null check for character
  if (!props.character) {
    return 0
  }

  // For first slot (character), use the character's highest tier
  if (props.isFirstSlot) {
    return Math.max(props.character.unlockedTiers.r, props.character.unlockedTiers.d) as TierLevel
  }

  // For group members, use the character's highest tier as default
  return Math.max(props.character.unlockedTiers.r, props.character.unlockedTiers.d) as TierLevel
}

const getInitialClass = (): WoWClass => {
  return props.currentSlot?.class || (props.isFirstSlot && props.character ? props.character.class : 'warrior')
}

const getInitialRace = (wowClass: WoWClass): Race | undefined => {
  if (props.currentSlot?.race) return props.currentSlot.race
  if (props.isFirstSlot) return undefined
  if (!props.character) return undefined

  const faction = props.character.faction
  if (faction === 'alliance') {
    switch (wowClass) {
      case 'warrior': return 'human'
      case 'rogue': return 'human'
      case 'priest': return 'dwarf'
      case 'mage':
      case 'warlock': return 'gnome'
      default: return undefined
    }
  } else if (faction === 'horde') {
    switch (wowClass) {
      case 'warrior': return 'orc'
      default: return undefined
    }
  }
  return undefined
}

// State
const initialClass = getInitialClass()
const selectedRole = ref<Role>(props.currentSlot?.role || getDefaultRole(initialClass))
const selectedClass = ref<WoWClass>(initialClass)
const selectedTierType = ref<TierType>(props.currentSlot?.tierType || getDefaultTierType())
const selectedRace = ref<Race | undefined>(getInitialRace(initialClass))

// License type selection state
const selectedLicenseType = ref<{ type: TierType; tier: TierLevel }>({
  type: props.currentSlot?.tierType || 'R',
  tier: props.currentSlot?.tier || getHighestAvailableTier(),
})

// Computed
const modalTitle = computed(() => {
  if (!props.character) {
    return 'Configure Slot'
  }
  return `Configure ${props.isFirstSlot ? props.character.name : `${props.character.name}'s Group Member`}`
})

const getRoleButtonConfig = (role: Role, isEnabled: boolean) => {
  const baseConfig = (() => {
    switch (role) {
      case 'tank':
        return { role, icon: ShieldIcon, color: '#3B82F6' }
      case 'healer':
        return { role, icon: HeartIcon, color: '#10B981' }
      case 'mdps':
      case 'rdps':
      case 'dps':
        return { role, icon: SwordIcon, color: '#EF4444' }
      case 'frost':
        return { role, icon: SwordIcon, color: '#69CCF0' }
      case 'fire':
        return { role, icon: SwordIcon, color: '#FF7D0A' }
      case 'arcane':
        return { role, icon: SwordIcon, color: '#9482C9' }
      case 'magic':
        return { role, icon: SwordIcon, color: '#F58CBA' }
      case 'might':
        return { role, icon: SwordIcon, color: '#C79C6E' }
      default:
        return { role, icon: SwordIcon, color: '#EF4444' }
    }
  })()
  return { ...baseConfig, isEnabled }
}

const roleButtons = computed(() => {
  const currentClass = props.isFirstSlot && props.character
    ? props.character.class
    : selectedClass.value
  const allowedRoles = CLASS_ROLE_RESTRICTIONS[currentClass] || []

  const flavoredDpsRoles: Role[] = ['frost', 'fire', 'arcane', 'magic', 'might']
  const hasFlavoredDps = allowedRoles.some(r => flavoredDpsRoles.includes(r))
  const classFlavorRoles = allowedRoles.filter(r => flavoredDpsRoles.includes(r))

  const buttons: { role: Role; icon: any; color: string; isEnabled: boolean }[] = []

  buttons.push(getRoleButtonConfig('tank', allowedRoles.includes('tank')))
  buttons.push(getRoleButtonConfig('healer', allowedRoles.includes('healer')))

  if (hasFlavoredDps) {
    classFlavorRoles.forEach(role => {
      buttons.push(getRoleButtonConfig(role, true))
    })
  } else {
    const hasMdps = allowedRoles.includes('mdps')
    const hasRdps = allowedRoles.includes('rdps')
    const hasDps = allowedRoles.includes('dps')

    if (hasMdps && hasRdps) {
      buttons.push(getRoleButtonConfig('mdps', true))
      buttons.push(getRoleButtonConfig('rdps', true))
    } else if (hasMdps || hasRdps || hasDps) {
      const dpsRole = hasMdps ? 'mdps' : hasRdps ? 'rdps' : 'dps'
      buttons.push(getRoleButtonConfig(dpsRole, true))
    } else {
      buttons.push(getRoleButtonConfig('dps', false))
    }
  }

  return buttons
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
  
  if (!props.character) {
    return allClasses
  }
  
  return allClasses.filter((cls) => {
    // Filter based on faction restrictions
    if (cls === 'paladin' && props.character.faction !== 'alliance') return false
    if (cls === 'shaman' && props.character.faction !== 'horde') return false
    return true
  })
})

const availableRaces = computed(() => {
  const classRaces = CLASS_RACE_RESTRICTIONS[selectedClass.value] || []

  if (!props.character) {
    return classRaces
  }

  // Filter by character faction (parent character determines available races)
  if (props.character.faction === 'alliance') {
    return classRaces.filter(race => ALLIANCE_RACES.includes(race as any))
  } else if (props.character.faction === 'horde') {
    return classRaces.filter(race => HORDE_RACES.includes(race as any))
  }
  return classRaces
})

const getDefaultRaceForClass = (wowClass: WoWClass): Race | undefined => {
  if (!props.character) return undefined
  const faction = props.character.faction

  if (faction === 'alliance') {
    switch (wowClass) {
      case 'warrior':
        return 'human'
      case 'rogue':
        return 'human'
      case 'priest':
        return 'dwarf'
      case 'mage':
      case 'warlock':
        return 'gnome'
      default:
        return undefined
    }
  } else if (faction === 'horde') {
    switch (wowClass) {
      case 'warrior':
        return 'orc'
      default:
        return undefined
    }
  }
  return undefined
}

const getDefaultClassForRole = (role: Role): WoWClass => {
  if (!props.character) return 'warrior'
  const faction = props.character.faction

  const dpsRoles: Role[] = ['dps', 'mdps', 'rdps', 'frost', 'fire', 'arcane', 'magic', 'might']

  if (role === 'tank') {
    return 'warrior'
  } else if (role === 'healer') {
    return faction === 'alliance' ? 'paladin' : 'shaman'
  } else if (dpsRoles.includes(role)) {
    return 'warrior'
  }
  return 'warrior'
}

const handleRoleSelect = (role: Role, isEnabled: boolean) => {
  if (props.isFirstSlot) {
    if (isEnabled) {
      selectedRole.value = role
    }
    return
  }

  if (isEnabled) {
    selectedRole.value = role
  } else {
    const newClass = getDefaultClassForRole(role)
    selectedClass.value = newClass
    selectedRole.value = role
    selectedRace.value = getDefaultRaceForClass(newClass)
  }
}

// Handle class selection
const handleClassSelect = (wowClass: WoWClass) => {
  // For character slots (first slot), don't allow changing the class
  if (props.isFirstSlot) {
    return
  }

  const classRoles = CLASS_ROLE_RESTRICTIONS[wowClass] || []

  // Check if this class was disabled (doesn't support current role)
  const wasDisabled = !classRoles.includes(selectedRole.value)

  selectedClass.value = wowClass
  selectedRace.value = getDefaultRaceForClass(wowClass)

  // If the class was disabled (grayed out), always switch to the class's default role
  // Otherwise, only switch if the current role is not available
  if (wasDisabled || !classRoles.includes(selectedRole.value)) {
    const defaultRole = CLASS_DEFAULT_ROLES[wowClass]
    if (defaultRole && classRoles.includes(defaultRole)) {
      selectedRole.value = defaultRole
    } else if (classRoles.includes('tank')) {
      selectedRole.value = 'tank'
    } else if (classRoles.includes('healer')) {
      selectedRole.value = 'healer'
    } else if (classRoles.includes('mdps')) {
      selectedRole.value = 'mdps'
    } else if (classRoles.includes('rdps')) {
      selectedRole.value = 'rdps'
    } else if (classRoles.includes('dps')) {
      selectedRole.value = 'dps'
    }
  }
  // If current role is 'dps' but the new class has specific dps roles, switch to the first available
  else if (selectedRole.value === 'dps') {
    if (classRoles.includes('mdps')) {
      selectedRole.value = 'mdps'
    } else if (classRoles.includes('rdps')) {
      selectedRole.value = 'rdps'
    }
  }
}

// Watch for class changes to update role selection (fallback)
watch(selectedClass, (newClass) => {
  // If current role is 'dps' but the new class has specific dps roles, switch to the first available
  if (selectedRole.value === 'dps') {
    const classRoles = CLASS_ROLE_RESTRICTIONS[newClass] || []
    if (classRoles.includes('mdps')) {
      selectedRole.value = 'mdps'
    } else if (classRoles.includes('rdps')) {
      selectedRole.value = 'rdps'
    }
  }
})

const availableRaidTiers = computed(() => {
  const tiers: TierLevel[] = []
  const maxTier = props.character ? props.character.unlockedTiers.r : 5
  for (let i = 0; i <= maxTier; i++) {
    tiers.push(i as TierLevel)
  }
  return tiers
})

const availableDungeonTiers = computed(() => {
  const tiers: TierLevel[] = []
  const maxTier = props.character ? props.character.unlockedTiers.d : 5
  for (let i = 0; i <= maxTier; i++) {
    tiers.push(i as TierLevel)
  }
  return tiers
})

// Methods

const getRoleDisplayName = (role: Role) => {
  const currentClassRoles = props.isFirstSlot && props.character
    ? CLASS_ROLE_RESTRICTIONS[props.character.class] || []
    : CLASS_ROLE_RESTRICTIONS[selectedClass.value] || []

  const dpsRoles: Role[] = ['mdps', 'rdps', 'dps', 'frost', 'fire', 'arcane', 'magic', 'might']
  const classDpsRoles = currentClassRoles.filter(r => dpsRoles.includes(r))
  const hasOnlyOneDpsType = classDpsRoles.length === 1

  switch (role) {
    case 'tank':
      return 'Tank'
    case 'healer':
      return 'Healer'
    case 'mdps':
      return hasOnlyOneDpsType ? 'DPS' : 'Melee DPS'
    case 'rdps':
      return hasOnlyOneDpsType ? 'DPS' : 'Ranged DPS'
    case 'dps':
      return 'DPS'
    case 'frost':
      return hasOnlyOneDpsType ? 'DPS' : 'Frost'
    case 'fire':
      return hasOnlyOneDpsType ? 'DPS' : 'Fire'
    case 'arcane':
      return hasOnlyOneDpsType ? 'DPS' : 'Arcane'
    case 'magic':
      return hasOnlyOneDpsType ? 'DPS' : 'Magic'
    case 'might':
      return hasOnlyOneDpsType ? 'DPS' : 'Might'
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


const getCurrentTier = () => {
  if (props.isFirstSlot && props.character) {
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

const getRaceDisplayName = (race: Race) => {
  const raceNames: Record<Race, string> = {
    human: 'Human',
    dwarf: 'Dwarf', 
    nightelf: 'Night Elf',
    gnome: 'Gnome',
    orc: 'Orc',
    undead: 'Undead',
    tauren: 'Tauren',
    troll: 'Troll',
  }
  return raceNames[race] || race
}

const toggleRace = (race: Race) => {
  // Click to select/deselect race
  if (selectedRace.value === race) {
    selectedRace.value = undefined // Deselect
  } else {
    selectedRace.value = race // Select
  }
}

const handleAssign = () => {
  if (canAssignRole(selectedClass.value, selectedRole.value)) {
    const tier = getCurrentTier()
    emit('assignSlot', selectedClass.value, selectedRole.value, selectedTierType.value, tier, selectedRace.value)
    emit('close')
  }
}

const handleClearSlot = () => {
  emit('clearSlot')
  emit('close')
}

// Watch for modal props changes to reset state
watch(
  [() => props.isOpen, () => props.currentSlot, () => props.isFirstSlot, () => props.character],
  () => {
    if (props.isOpen) {
      // Reset modal state when opening
      const newClass = props.currentSlot?.class || (props.isFirstSlot && props.character ? props.character.class : 'warrior')
      selectedRole.value = props.currentSlot?.role || getDefaultRole(newClass)
      selectedClass.value = newClass
      selectedTierType.value = props.currentSlot?.tierType || getDefaultTierType()
      selectedRace.value = getInitialRace(newClass)
      selectedLicenseType.value = {
        type: props.currentSlot?.tierType || 'R',
        tier: props.currentSlot?.tier || getHighestAvailableTier(),
      }
    }
  },
  { immediate: true },
)

// Simple icon render functions
const ShieldIcon = () =>
  h('svg', { class: 'h-4 w-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
      'clip-rule': 'evenodd',
    }),
  ])

const HeartIcon = () =>
  h('svg', { class: 'h-4 w-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
      'clip-rule': 'evenodd',
    }),
  ])

const SwordIcon = () =>
  h('svg', { class: 'h-4 w-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', {
      'fill-rule': 'evenodd',
      d: 'M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z',
      'clip-rule': 'evenodd',
    }),
  ])
</script>
