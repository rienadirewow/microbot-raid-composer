<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <PageHeader title="Raids" description="Create and manage your WoW Classic raid compositions">
      <template #action>
        <Button @click="createNewRaid">New Raid</Button>
      </template>
    </PageHeader>

    <!-- Combined Raid Container -->
    <div v-if="raidsStore.currentRaid" class="bg-white rounded-lg shadow p-6">
      <!-- Title and Actions -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
          <div v-if="!isEditing" class="flex items-center space-x-2">
            <h2 class="text-xl font-semibold text-gray-900">{{ raidsStore.currentRaid.name }}</h2>
            <button
              @click="startEditing"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              title="Edit raid name"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <input
              ref="nameInput"
              v-model="editingName"
              @keyup.enter="saveName"
              @keyup.esc="cancelEditing"
              @blur="saveName"
              class="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
              :maxlength="50"
            />
            <button
              @click="saveName"
              class="text-green-600 hover:text-green-700 transition-colors"
              title="Save name"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            <button
              @click="cancelEditing"
              class="text-red-600 hover:text-red-700 transition-colors"
              title="Cancel editing"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <Button variant="success" size="sm" @click="saveCurrentRaid">Save Raid</Button>
          <Button variant="warning" size="sm" @click="exportRaid">Export Commands</Button>
          <Button variant="secondary" size="sm" @click="clearCurrentRaid">Clear</Button>
          <Button variant="danger" size="sm" @click="deleteCurrentRaid">Delete Raid</Button>
        </div>
      </div>

      <!-- Progress and Role Advisor -->
      <div class="flex items-center justify-between mb-4">
        <ProgressBar :value="raidsStore.filledSlots" :max="40" />
        <div class="flex items-center space-x-3 text-sm text-slate-600">
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>Tank: {{ roleCounts.tank }}/{{ suggestedRoles.tank }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>Healer: {{ roleCounts.healer }}/{{ suggestedRoles.healer }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>DPS: {{ roleCounts.dps }}/{{ suggestedRoles.dps }}</span>
          </div>
        </div>
      </div>

      <!-- Current Player Selection -->
      <div class="mb-6">
        <div class="flex items-center mb-3">
          <button
            @click="showPlayerSelector = true"
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors mr-3"
            :class="
              currentPlayer
                ? 'border-amber-500 bg-amber-50 text-amber-600'
                : 'border-gray-300 bg-white text-gray-400 hover:border-amber-400 hover:text-amber-500'
            "
            :title="currentPlayer ? 'Change Current Player' : 'Select Current Player'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </button>
          <div v-if="currentPlayer" class="flex items-center space-x-2">
            <span
              class="text-lg font-semibold"
              :style="{ color: getClassColor(currentPlayer.class) }"
            >
              {{ capitalizeFirst(currentPlayer.name) }}
            </span>
            <span class="text-sm text-gray-600">{{
              getClassDisplayName(currentPlayer.class)
            }}</span>
            <span class="text-sm text-gray-500">
              T{{ currentPlayer.unlockedTiers.r }}R, T{{ currentPlayer.unlockedTiers.d }}D
            </span>
          </div>
          <div v-else class="text-gray-500 italic">No current player selected</div>
        </div>

        <!-- Warning when no current player -->
        <div v-if="!currentPlayer" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-sm text-yellow-800">Please select a current player to continue</span>
          </div>
        </div>
      </div>

      <!-- Raid Grid -->
      <RaidGrid
        :composition="composition"
        :characters="charactersStore.characters"
        :current-player-id="currentPlayerId"
        @slot-click="handleSlotClick"
        @update-current-player="handleUpdateCurrentPlayer"
      />

      <!-- Player Selection Modal -->
      <div
        v-if="showPlayerSelector"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showPlayerSelector = false"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Current Player</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <button
              v-for="character in charactersStore.characters"
              :key="character.id"
              @click="selectCurrentPlayer(character)"
              class="w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md"
              :class="
                currentPlayer?.id === character.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              "
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium" :style="{ color: getClassColor(character.class) }">
                    {{ capitalizeFirst(character.name) }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ getClassDisplayName(character.class) }} ({{ character.faction }})
                  </p>
                </div>
                <div v-if="currentPlayer?.id === character.id" class="text-amber-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="showPlayerSelector = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Slot Assignment Modal -->
      <SlotAssignmentModal
        :is-open="assignmentModal.isOpen"
        :row-index="assignmentModal.rowIndex"
        :slot-index="assignmentModal.slotIndex"
        :current-slot="currentSlot"
        :character="currentCharacter"
        :is-first-slot="assignmentModal.slotIndex === 0"
        @close="closeAssignmentModal"
        @assign-slot="handleAssignSlot"
        @clear-slot="handleClearSlot"
      />
    </div>

    <!-- No Current Raid -->
    <EmptyState
      v-else
      title="No active raid"
      description="Create a new raid to get started with building your composition."
    >
      <template #action>
        <Button size="lg" @click="createNewRaid">Create New Raid</Button>
      </template>
    </EmptyState>

    <!-- Saved Raids -->
    <div v-if="raidsStore.raids.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Saved Raids</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SavedRaidCard
          v-for="raid in raidsStore.raids"
          :key="raid.id"
          :raid-name="raid.name"
          :filled-slots="raid.slots.filter((s) => s.assignment).length"
          :updated-at="raid.updatedAt"
          @click="loadRaid(raid.id)"
        />
      </div>
    </div>

    <!-- Character Requirements -->
    <WarningBanner
      v-if="charactersStore.totalCharacters === 0"
      title="No characters found"
      description="You need to add some characters first before you can build raids."
    >
      <template #action>
        <router-link to="/characters" class="underline font-medium"
          >Go to Character Manager</router-link
        >
      </template>
    </WarningBanner>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import type {
  CharacterRow,
  CompanionAssignment,
  PlayerSlot,
  WoWClass,
  Role,
  TierType,
  TierLevel,
  PlayerCharacter,
} from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import PageHeader from '../components/layout/PageHeader.vue'
import Button from '../components/ui/Button.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import WarningBanner from '../components/ui/WarningBanner.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import SavedRaidCard from '../components/SavedRaidCard.vue'
import RaidGrid from '../components/RaidGrid.vue'
import SlotAssignmentModal from '../components/SlotAssignmentModal.vue'

// Stores
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// State
const currentPlayerId = ref<string>('')
const showPlayerSelector = ref(false)
const isEditing = ref(false)
const editingName = ref('')
const nameInput = ref<HTMLInputElement>()

// Raid composition state
const composition = ref<CharacterRow[]>([])
const assignmentModal = ref<{
  isOpen: boolean
  rowIndex: number
  slotIndex: number
}>({
  isOpen: false,
  rowIndex: 0,
  slotIndex: 0,
})

// Lifecycle
onMounted(async () => {
  await Promise.all([charactersStore.loadCharacters(), raidsStore.loadRaids()])
  if (raidsStore.currentRaid) {
    initializeCharacterGroups()
  }
})

// Computed
const currentPlayer = computed(() => {
  return charactersStore.characters.find((char) => char.id === currentPlayerId.value) || null
})

const currentSlot = computed(() => {
  const row = composition.value[assignmentModal.value.rowIndex]
  return row?.slots[assignmentModal.value.slotIndex] || null
})

const currentCharacter = computed(() => {
  const row = composition.value[assignmentModal.value.rowIndex]
  return row?.character || charactersStore.characters[0]
})

const roleCounts = computed(() => {
  const counts = { tank: 0, healer: 0, dps: 0 }

  composition.value.forEach((row) => {
    row.slots.forEach((slot) => {
      if (slot) {
        if (slot.role === 'tank') counts.tank++
        else if (slot.role === 'healer') counts.healer++
        else if (['dps', 'mdps', 'rdps'].includes(slot.role)) counts.dps++
      }
    })
  })

  return counts
})

const suggestedRoles = computed(() => {
  const groupCount = composition.value.length
  return {
    tank: Math.ceil(groupCount / 2), // 1 tank per 2 groups
    healer: groupCount + 1, // 1 healer per group + 1
    dps: groupCount * 5 - Math.ceil(groupCount / 2) - (groupCount + 1), // rest dps
  }
})

// Methods
const createNewRaid = () => {
  raidsStore.createNewRaid('mixed')
  // Initialize character groups for the new raid immediately
  initializeCharacterGroupsForNewRaid()
}

const saveCurrentRaid = async () => {
  await raidsStore.saveCurrentRaid()
}

const exportRaid = () => {
  const commands = raidsStore.generateExportString()
  if (commands) {
    navigator.clipboard.writeText(commands)
    alert('Commands copied to clipboard!')
  } else {
    alert('No companions assigned to export.')
  }
}

const clearCurrentRaid = () => {
  if (confirm('Are you sure you want to clear the current raid? This action cannot be undone.')) {
    raidsStore.currentRaid = null
  }
}

const deleteCurrentRaid = () => {
  if (confirm('Are you sure you want to delete this raid? This action cannot be undone.')) {
    raidsStore.deleteCurrentRaid()
  }
}

const loadRaid = (raidId: string) => {
  raidsStore.loadRaid(raidId)
  if (raidsStore.currentRaid) {
    initializeCharacterGroups()
  }
}

const updateRaidComposition = async (newComposition: CharacterRow[]) => {
  composition.value = newComposition
  if (!raidsStore.currentRaid) return

  // Convert the new composition format to the old format
  const updatedSlots = raidsStore.currentRaid.slots.map((slot, index) => {
    // Find which character row and slot this corresponds to
    const rowIndex = Math.floor(index / 5) // 5 slots per row
    const slotInRow = index % 5 // 0-4 for each row

    if (rowIndex < composition.value.length) {
      const characterRow = composition.value[rowIndex]
      const playerSlot = characterRow.slots[slotInRow]

      if (playerSlot) {
        // Convert PlayerSlot to CompanionAssignment
        const assignment: CompanionAssignment = {
          id: `${characterRow.character.id}-${slotInRow}`,
          name: playerSlot.isCharacter
            ? characterRow.character.name
            : `${characterRow.character.name}'s Companion`,
          class: playerSlot.class,
          role: playerSlot.role,
          tier: playerSlot.tier,
          race: characterRow.character.race,
          ownerId: characterRow.character.id,
        }

        return {
          ...slot,
          assignment,
        }
      }
    }

    // Return slot without assignment if no data
    return {
      ...slot,
      assignment: undefined,
    }
  })

  // Update the current raid with the new slots
  raidsStore.currentRaid.slots = updatedSlots
  raidsStore.currentRaid.updatedAt = new Date()

  // Autosave the raid
  await raidsStore.saveCurrentRaid()
}

const updateRaidName = async (newName: string) => {
  raidsStore.updateCurrentRaidName(newName)
  // Autosave the raid after name change
  await raidsStore.saveCurrentRaid()
}

const handleUpdateCurrentPlayer = (playerId: string) => {
  currentPlayerId.value = playerId
}

const initializeCharacterGroupsForNewRaid = () => {
  console.log('Initializing character groups for NEW raid...')
  console.log('Characters:', charactersStore.characters)

  // Initialize with empty slots and include lite characters by default
  composition.value = charactersStore.characters.map((character) => {
    const slots: (PlayerSlot | null)[] = Array(5).fill(null)

    // Auto-assign first slot with character's class and default role
    const defaultRole = canAssignRole(character.class, 'tank')
      ? 'tank'
      : canAssignRole(character.class, 'healer')
        ? 'healer'
        : 'dps'

    slots[0] = {
      class: character.class,
      role: defaultRole,
      tier: character.unlockedTiers.r,
      tierType: 'R',
      isCharacter: true,
      characterName: character.name,
      isControlMember: true,
    }

    // Include lite character in second slot by default
    slots[1] = {
      class: character.class,
      role: defaultRole,
      tier: character.unlockedTiers.r,
      tierType: 'R',
      isCharacter: true,
      characterName: character.name,
      isControlMember: false,
    }

    return {
      character,
      slots,
    }
  })

  console.log('Final composition for new raid:', composition.value)
}

const initializeCharacterGroups = () => {
  console.log('Initializing character groups for EXISTING raid...')
  console.log('Current raid:', raidsStore.currentRaid)
  console.log('Characters:', charactersStore.characters)

  if (raidsStore.currentRaid) {
    // Initialize with existing raid data
    composition.value = charactersStore.characters.map((character) => {
      const slots: (PlayerSlot | null)[] = Array(5).fill(null)

      // Find the character's row in the raid (assuming characters are in order)
      const characterIndex = charactersStore.characters.findIndex((c) => c.id === character.id)
      if (characterIndex !== -1) {
        // Map raid slots to character slots
        for (let i = 0; i < 5; i++) {
          const raidSlotIndex = characterIndex * 5 + i
          const raidSlot = raidsStore.currentRaid!.slots[raidSlotIndex]

          if (raidSlot?.assignment) {
            slots[i] = {
              class: raidSlot.assignment.class,
              role: raidSlot.assignment.role,
              tier: raidSlot.assignment.tier,
              tierType: raidSlot.assignment.tier === character.unlockedTiers.r ? 'R' : 'D',
              isCharacter: i === 0,
              characterName: character.name,
              isControlMember: i === 0,
            }
          }
        }
      }

      return {
        character,
        slots,
      }
    })
  }

  console.log('Final composition for existing raid:', composition.value)
}

const canAssignRole = (wowClass: string, role: string): boolean => {
  // Simple role validation - can be enhanced with CLASS_ROLE_RESTRICTIONS
  if (role === 'tank') {
    return ['warrior', 'paladin', 'druid'].includes(wowClass)
  }
  if (role === 'healer') {
    return ['paladin', 'priest', 'shaman', 'druid'].includes(wowClass)
  }
  return true // All classes can be DPS
}

const handleSlotClick = (rowIndex: number, slotIndex: number) => {
  assignmentModal.value = {
    isOpen: true,
    rowIndex,
    slotIndex,
  }
}

const closeAssignmentModal = () => {
  assignmentModal.value.isOpen = false
}

const handleAssignSlot = (wowClass: WoWClass, role: Role, tierType: TierType, tier: TierLevel) => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  const isFirstSlot = assignmentModal.value.slotIndex === 0

  const newSlot: PlayerSlot = {
    class: wowClass,
    role,
    tier,
    tierType,
    isCharacter: isFirstSlot,
    characterName: isFirstSlot ? row.character.name : undefined,
    isControlMember: row.character.name === 'Current Player',
  }

  row.slots[assignmentModal.value.slotIndex] = newSlot

  // Emit update
  updateRaidComposition(composition.value)
}

const handleClearSlot = () => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  row.slots[assignmentModal.value.slotIndex] = null

  // Emit update
  updateRaidComposition(composition.value)
}

// Name editing methods
const startEditing = () => {
  isEditing.value = true
  editingName.value = raidsStore.currentRaid?.name || ''
  nextTick(() => {
    nameInput.value?.focus()
  })
}

const saveName = () => {
  if (editingName.value.trim() && raidsStore.currentRaid) {
    updateRaidName(editingName.value.trim())
  }
  isEditing.value = false
}

const cancelEditing = () => {
  isEditing.value = false
  editingName.value = ''
}

const selectCurrentPlayer = (character: PlayerCharacter) => {
  currentPlayerId.value = character.id
  showPlayerSelector.value = false
}

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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
</script>
