<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Header -->
    <PageHeader title="Raids" description="Create and manage your Microbot-WoW raid compositions">
      <template #action>
        <Button @click="createNewRaid">New Raid</Button>
      </template>
    </PageHeader>

    <!-- No Characters Warning - Show prominently before anything else -->
    <EmptyState
      v-if="charactersStore.totalCharacters === 0"
      title="No characters found"
      description="You need to add some characters before you can build raids."
    >
      <template #action>
        <router-link to="/characters">
          <Button size="lg">Go to Character Manager</Button>
        </router-link>
      </template>
    </EmptyState>

    <!-- Combined Raid Container -->
    <div v-else-if="raidsStore.currentRaid" class="bg-white rounded-lg shadow p-4">
      <!-- Line 1: Raid Name and Actions -->
      <div class="flex items-center justify-between mb-3">
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
          <Button variant="secondary" size="sm" @click="cloneCurrentRaid">Clone Raid</Button>
          <Button variant="danger" size="sm" @click="deleteCurrentRaid">Delete Raid</Button>
        </div>
      </div>

      <!-- Line 2: Progress and Role Distribution -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-4">
          <ProgressBar :value="totalFilledSlots" :max="40" />
          <div class="text-sm text-slate-600">
            <span class="font-medium" :class="{ 'text-green-600': totalFilledSlots >= 40 }"
              >{{ totalFilledSlots }}/40</span
            >
            <span v-if="totalFilledSlots >= 40" class="text-green-600 ml-2 font-semibold"
              >Raid Full!</span
            >
            <span v-else-if="currentPlayer" class="text-amber-600 ml-2"
              >(includes current player)</span
            >
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Tank Counter -->
          <div
            class="flex items-center px-2 py-1.5 rounded-lg border transition-colors"
            :class="getRoleCounterClass('tank')"
          >
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm font-semibold">
              <div class="text-gray-900">Tanks</div>
              <div class="text-xs text-gray-600">
                {{ roleCounts.tank }}/{{ suggestedRoles.tank }}
              </div>
            </div>
          </div>

          <!-- Healer Counter -->
          <div
            class="flex items-center px-2 py-1.5 rounded-lg border transition-colors"
            :class="getRoleCounterClass('healer')"
          >
            <svg class="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm font-semibold">
              <div class="text-gray-900">Healers</div>
              <div class="text-xs text-gray-600">
                {{ roleCounts.healer }}/{{ suggestedRoles.healer }}
              </div>
            </div>
          </div>

          <!-- DPS Counter -->
          <div
            class="flex items-center px-2 py-1.5 rounded-lg border transition-colors"
            :class="getRoleCounterClass('dps')"
          >
            <svg class="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm font-semibold">
              <div class="text-gray-900">DPS</div>
              <div class="text-xs text-gray-600">{{ roleCounts.dps }}/{{ suggestedRoles.dps }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Line 3: Current Player and Export -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
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

        <!-- Export Button -->
        <Button variant="warning" size="sm" @click="exportRaid">Export Commands</Button>
      </div>

      <!-- Current Player Warning -->
      <div class="mb-4">
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
        class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50"
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

      <!-- Slot Remove Modal -->
      <div
        v-if="slotRemoveModal.isOpen"
        class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50"
        @click="cancelSlotRemove"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Remove a Bot</h3>
          <p class="text-gray-600 mb-4">
            Current player can only hire 4 bots. Which one would you like to remove?
          </p>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <button
              v-for="{ index, slot } in slotRemoveModal.filledSlots"
              :key="index"
              @click="removeSlotAndSwitchPlayer(index)"
              class="text-left p-3 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
              :class="{ 'col-span-2': index === 0 }"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-medium" :style="{ color: getClassColor(slot.class) }">
                    {{
                      index === 0
                        ? capitalizeFirst(slotRemoveModalCharacter?.name || '')
                        : getClassDisplayName(slot.class)
                    }}
                  </span>
                  <span class="text-gray-600 ml-2">{{ getSimpleRoleDisplayName(slot.role) }}</span>
                  <span class="text-gray-500 ml-2 text-sm"
                    >T{{ slot.tier }}{{ slot.tierType }}</span
                  >
                </div>
                <svg
                  class="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </button>
          </div>
          <div class="flex justify-end">
            <button
              @click="cancelSlotRemove"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Export Commands Modal -->
      <Modal v-if="showExportModal" title="Export Lua Script" @close="showExportModal = false">
        <div class="space-y-4">
          <div class="relative">
            <div class="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre class="text-green-400 text-sm font-mono whitespace-pre">{{ exportCommands }}</pre>
            </div>
            <button
              @click="copyExportCommands"
              class="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
              :class="
                justCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              "
            >
              <svg v-if="justCopied" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {{ justCopied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <p class="text-sm text-gray-600">
            Paste this Lua script in-game to hire your raid. Hiring order: current player's bots first (up to 4), then all lites, then remaining companions.
          </p>
        </div>
      </Modal>
    </div>

    <!-- No Current Raid (only show if characters exist) -->
    <EmptyState
      v-else-if="charactersStore.totalCharacters > 0"
      title="No active raid"
      description="Create a new raid to get started with building your composition."
    >
      <template #action>
        <Button size="lg" @click="createNewRaid">Create New Raid</Button>
      </template>
    </EmptyState>

    <!-- Saved Raids -->
    <div v-if="raidsStore.raids.length > 0" class="mb-8 mt-8">
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

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue'
import type {
  CharacterRow,
  CompanionAssignment,
  PlayerSlot,
  WoWClass,
  Role,
  TierType,
  TierLevel,
  PlayerCharacter,
  CharacterSlotGroup,
  Race,
} from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { getDefaultRole, CLASS_ROLE_RESTRICTIONS } from '@/data/wow-data'
import PageHeader from '../components/layout/PageHeader.vue'
import Button from '../components/ui/Button.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ProgressBar from '../components/ui/ProgressBar.vue'
import SavedRaidCard from '../components/SavedRaidCard.vue'
import RaidGrid from '../components/RaidGrid.vue'
import SlotAssignmentModal from '../components/SlotAssignmentModal.vue'
import Modal from '../components/ui/Modal.vue'

// Stores
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// State
const currentPlayerId = ref<string>('')
const showPlayerSelector = ref(false)
const isEditing = ref(false)
const editingName = ref('')
const nameInput = ref<HTMLInputElement>()
const showExportModal = ref(false)
const exportCommands = ref('')
const justCopied = ref(false)

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

// Confirmation modal for clearing a slot when changing current player (can only have 4 bots)
const slotRemoveModal = ref<{
  isOpen: boolean
  newPlayerId: string
  filledSlots: { index: number; slot: PlayerSlot }[]
}>({
  isOpen: false,
  newPlayerId: '',
  filledSlots: [],
})

// Lifecycle
onMounted(async () => {
  await Promise.all([charactersStore.loadCharacters(), raidsStore.loadRaids()])
  if (raidsStore.currentRaid) {
    initializeCharacterGroups()
  }
})

// Watch current player changes and auto-save
watch(currentPlayerId, async (newPlayerId) => {
  if (raidsStore.currentRaid) {
    raidsStore.currentRaid.currentPlayerId = newPlayerId || undefined
    await raidsStore.saveCurrentRaid()
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

const slotRemoveModalCharacter = computed(() => {
  const row = composition.value.find((r) => r.character.id === slotRemoveModal.value.newPlayerId)
  return row?.character || null
})

const roleCounts = computed(() => {
  const counts = { tank: 0, healer: 0, dps: 0 }

  // Count current player with their character's default role
  if (currentPlayer.value) {
    const role = currentPlayer.value.defaultRole || getDefaultRole(currentPlayer.value.class)
    if (role === 'tank') counts.tank++
    else if (role === 'healer') counts.healer++
    else counts.dps++
  }

  // Count all companions and lites
  composition.value.forEach((row) => {
    row.slots.forEach((slot) => {
      if (slot) {
        if (slot.role === 'tank') counts.tank++
        else if (slot.role === 'healer') counts.healer++
        else counts.dps++
      }
    })
  })

  return counts
})

const suggestedRoles = computed(() => {
  const totalSlots = totalFilledSlots.value

  // Standard raid composition ratios based on total filled slots
  // Approximately: 10% tanks, 25% healers, 65% dps
  const tanks = Math.max(1, Math.ceil(totalSlots * 0.1)) // At least 1 tank, ~10% of raid
  const healers = Math.max(1, Math.ceil(totalSlots * 0.25)) // At least 1 healer, ~25% of raid
  const dps = Math.max(0, totalSlots - tanks - healers) // Remaining slots for dps

  return {
    tank: tanks,
    healer: healers,
    dps: dps,
  }
})

const totalFilledSlots = computed(() => {
  let count = 0

  // Count current player
  if (currentPlayer.value) {
    count++
  }

  // Count assigned slots
  composition.value.forEach((row) => {
    row.slots.forEach((slot) => {
      if (slot) count++
    })
  })

  return count
})

// Methods
const createNewRaid = async () => {
  raidsStore.createNewRaid('mixed')
  // Initialize character groups for the new raid immediately
  initializeCharacterGroupsForNewRaid()
  // Save the initial composition to storage
  await updateRaidComposition(composition.value)
}

const exportRaid = () => {
  const commands = raidsStore.generateExportString()
  if (commands) {
    exportCommands.value = commands
    navigator.clipboard.writeText(commands)
    justCopied.value = true
    setTimeout(() => {
      justCopied.value = false
    }, 2000)
    showExportModal.value = true
  } else {
    alert('No companions assigned to export.')
  }
}

const copyExportCommands = () => {
  navigator.clipboard.writeText(exportCommands.value)
  justCopied.value = true
  setTimeout(() => {
    justCopied.value = false
  }, 2000)
}

const cloneCurrentRaid = async () => {
  if (!raidsStore.currentRaid) return

  // Create a copy with new ID and name
  const clonedRaid = {
    ...raidsStore.currentRaid,
    id: crypto.randomUUID(),
    name: `${raidsStore.currentRaid.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Add to raids array and set as current
  raidsStore.raids.push(clonedRaid)
  raidsStore.currentRaid = clonedRaid
  await raidsStore.saveCurrentRaid()
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
  composition.value = [...newComposition]
  if (!raidsStore.currentRaid) return

  // Convert to new character slots structure
  const characterSlots: CharacterSlotGroup[] = newComposition.map((row) => {
    const liteSlot = row.slots[0]
      ? {
          class: row.slots[0].class,
          role: row.slots[0].role,
          tier: row.slots[0].tier,
          tierType: row.slots[0].tierType,
          isLite: true,
          characterName: row.character.name,
        }
      : null

    const companionSlots = row.slots.slice(1, 5).map((slot) =>
      slot
        ? {
            class: slot.class,
            role: slot.role,
            tier: slot.tier,
            tierType: slot.tierType,
            race: slot.race,
            isLite: false,
            characterName: undefined,
          }
        : null,
    )

    return {
      characterId: row.character.id,
      liteSlot,
      companionSlots,
    }
  })

  // Update new structure
  raidsStore.currentRaid.characterSlots = characterSlots
  raidsStore.currentRaid.currentPlayerId = currentPlayerId.value || undefined
  raidsStore.currentRaid.updatedAt = new Date()

  // Also update legacy structure for backward compatibility
  const updatedSlots = raidsStore.currentRaid.slots.map((slot, index) => {
    const rowIndex = Math.floor(index / 5)
    const slotInRow = index % 5

    if (rowIndex < composition.value.length) {
      const characterRow = composition.value[rowIndex]
      const playerSlot = characterRow.slots[slotInRow]

      if (playerSlot) {
        const assignment: CompanionAssignment = {
          id: `${characterRow.character.id}-${slotInRow}`,
          name:
            playerSlot.isCharacter && slotInRow === 0
              ? `${characterRow.character.name}-lite`
              : `${characterRow.character.name}'s Companion`,
          class: playerSlot.class,
          role: playerSlot.role,
          tier: playerSlot.tier,
          race: characterRow.character.race,
          ownerId: characterRow.character.id,
        }

        return { ...slot, assignment }
      }
    }

    return { ...slot, assignment: undefined }
  })

  raidsStore.currentRaid.slots = updatedSlots

  // Autosave the raid
  await raidsStore.saveCurrentRaid()
}

const updateRaidName = async (newName: string) => {
  raidsStore.updateCurrentRaidName(newName)
  // Autosave the raid after name change
  await raidsStore.saveCurrentRaid()
}

const handleUpdateCurrentPlayer = (playerId: string) => {
  const oldPlayerId = currentPlayerId.value

  if (playerId !== oldPlayerId) {
    const newPlayerRow = composition.value.find((row) => row.character.id === playerId)
    if (newPlayerRow) {
      const liteSlot = newPlayerRow.slots[0]
      const companionSlots = newPlayerRow.slots.slice(1)
      const filledCompanions = companionSlots.filter((s) => s !== null)

      if (liteSlot && filledCompanions.length === 4) {
        const filledSlots = newPlayerRow.slots
          .map((slot, index) => (slot ? { index, slot } : null))
          .filter((item): item is { index: number; slot: PlayerSlot } => item !== null)

        slotRemoveModal.value = {
          isOpen: true,
          newPlayerId: playerId,
          filledSlots,
        }
        return
      }

      if (liteSlot) {
        const reorderedCompanions: (PlayerSlot | null)[] = [...filledCompanions]
        while (reorderedCompanions.length < 4) {
          reorderedCompanions.push(null)
        }
        newPlayerRow.slots = [liteSlot, ...reorderedCompanions]
        updateRaidComposition(composition.value)
      }
    }
  }

  currentPlayerId.value = playerId
}

const removeSlotAndSwitchPlayer = (slotIndex: number) => {
  const newPlayerRow = composition.value.find(
    (row) => row.character.id === slotRemoveModal.value.newPlayerId,
  )
  if (newPlayerRow) {
    if (slotIndex === 0) {
      newPlayerRow.slots[0] = null
    } else {
      const liteSlot = newPlayerRow.slots[0]
      const companionSlots = newPlayerRow.slots.slice(1).filter((_, i) => i + 1 !== slotIndex)
      while (companionSlots.length < 4) {
        companionSlots.push(null)
      }
      newPlayerRow.slots = [liteSlot, ...companionSlots]
    }
    updateRaidComposition(composition.value)
  }

  currentPlayerId.value = slotRemoveModal.value.newPlayerId
  slotRemoveModal.value.isOpen = false
}

const cancelSlotRemove = () => {
  slotRemoveModal.value.isOpen = false
}

const initializeCharacterGroupsForNewRaid = () => {
  console.log('Initializing character groups for NEW raid...')
  console.log('Characters:', charactersStore.characters)

  // Calculate max characters we can include based on raid limit
  const maxRaidSize = 40
  const currentPlayerCount = currentPlayerId.value ? 1 : 0
  const maxAvailableSlots = maxRaidSize - currentPlayerCount

  // Since each character starts with 1 lite by default, we can include at most maxAvailableSlots characters
  // This ensures we don't exceed the raid size limit even with just lite characters
  const charactersToInclude = charactersStore.characters.slice(
    0,
    Math.min(maxAvailableSlots, charactersStore.characters.length),
  )

  // Initialize with empty slots and include lite characters by default
  composition.value = charactersToInclude.map((character) => {
    const slots: (PlayerSlot | null)[] = Array(5).fill(null)

    // Auto-assign first slot as lite character (free clone)
    // Use character's default role if available, otherwise use class default
    const defaultRole = character.defaultRole || getDefaultRole(character.class)

    slots[0] = {
      class: character.class,
      role: defaultRole,
      tier: character.unlockedTiers.r,
      tierType: 'R',
      isCharacter: true,
      characterName: character.name,
      isControlMember: false, // This is a lite clone, not the control member
    }

    return {
      character,
      slots,
    }
  })

  console.log(
    `Final composition for new raid: ${composition.value.length} character groups (${composition.value.length + currentPlayerCount} total slots used)`,
  )
}

const initializeCharacterGroups = () => {
  console.log('Initializing character groups for EXISTING raid...')
  console.log('Current raid:', raidsStore.currentRaid)
  console.log('Characters:', charactersStore.characters)

  if (raidsStore.currentRaid) {
    currentPlayerId.value = raidsStore.currentRaid.currentPlayerId || ''

    // Use new characterSlots structure if available
    if (raidsStore.currentRaid.characterSlots && raidsStore.currentRaid.characterSlots.length > 0) {
      composition.value = charactersStore.characters.map((character) => {
        const slots: (PlayerSlot | null)[] = Array(5).fill(null)

        // Find this character's slot group in the raid
        const characterSlotGroup = raidsStore.currentRaid!.characterSlots.find(
          (group) => group.characterId === character.id,
        )

        if (characterSlotGroup) {
          // Load lite slot (slot 0) - always use character's current defaultRole
          if (characterSlotGroup.liteSlot) {
            slots[0] = {
              class: character.class,
              role: character.defaultRole || getDefaultRole(character.class),
              tier: characterSlotGroup.liteSlot.tier,
              tierType: characterSlotGroup.liteSlot.tierType,
              isCharacter: true,
              characterName: character.name,
              isControlMember: false,
            }
          }

          // Load companion slots (slots 1-4)
          characterSlotGroup.companionSlots.forEach((companionSlot, index) => {
            if (companionSlot) {
              slots[index + 1] = {
                class: companionSlot.class,
                role: companionSlot.role,
                tier: companionSlot.tier,
                tierType: companionSlot.tierType,
                race: companionSlot.race,
                isCharacter: false,
                characterName: undefined,
                isControlMember: false,
              }
            }
          })
        }

        return { character, slots }
      })
    } else {
      // Fall back to legacy slots structure
      composition.value = charactersStore.characters.map((character) => {
        const slots: (PlayerSlot | null)[] = Array(5).fill(null)

        const characterIndex = charactersStore.characters.findIndex((c) => c.id === character.id)
        if (characterIndex !== -1) {
          for (let i = 0; i < 5; i++) {
            const raidSlotIndex = characterIndex * 5 + i
            const raidSlot = raidsStore.currentRaid!.slots[raidSlotIndex]

            if (raidSlot?.assignment) {
              slots[i] = {
                class: i === 0 ? character.class : raidSlot.assignment.class,
                role:
                  i === 0
                    ? character.defaultRole || getDefaultRole(character.class)
                    : raidSlot.assignment.role,
                tier: raidSlot.assignment.tier,
                tierType: raidSlot.assignment.tier === character.unlockedTiers.r ? 'R' : 'D',
                isCharacter: i === 0,
                characterName: character.name,
                isControlMember: i === 0,
              }
            }
          }
        }

        return { character, slots }
      })
    }
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

const handleSlotClick = (characterId: string, slotIndex: number) => {
  const rowIndex = composition.value.findIndex((row) => row.character.id === characterId)
  if (rowIndex === -1) return

  const row = composition.value[rowIndex]
  const slot = row?.slots[slotIndex]
  const isFirstSlot = slotIndex === 0

  // For lite slots (first slot), toggle activation directly
  if (isFirstSlot) {
    if (slot) {
      row.slots[slotIndex] = null
    } else {
      row.slots[slotIndex] = {
        class: row.character.class,
        role: row.character.defaultRole || getDefaultRole(row.character.class),
        tier: Math.max(row.character.unlockedTiers.r, row.character.unlockedTiers.d) as TierLevel,
        tierType: row.character.unlockedTiers.r >= row.character.unlockedTiers.d ? 'R' : 'D',
        race: row.character.race,
        isCharacter: true,
        characterName: row.character.name,
        isControlMember: false,
      }
    }
    updateRaidComposition(composition.value)
    return
  }

  // For companion slots, open the modal
  // If slot is already filled, allow editing
  if (slot) {
    assignmentModal.value = {
      isOpen: true,
      rowIndex,
      slotIndex,
    }
    return
  }

  // Check if raid is full (40 including current player, 39 without)
  const maxRaidSize = 40
  const currentTotal = totalFilledSlots.value

  if (currentTotal >= maxRaidSize) {
    alert(`Raid is full! Maximum size is ${maxRaidSize} (including current player).`)
    return
  }

  assignmentModal.value = {
    isOpen: true,
    rowIndex,
    slotIndex,
  }
}

const closeAssignmentModal = () => {
  assignmentModal.value.isOpen = false
}

const handleAssignSlot = (
  wowClass: WoWClass,
  role: Role,
  tierType: TierType,
  tier: TierLevel,
  race?: Race,
) => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  const isFirstSlot = assignmentModal.value.slotIndex === 0

  const newSlot: PlayerSlot = {
    class: wowClass,
    role,
    tier,
    tierType,
    race: race || (isFirstSlot ? row.character.race : undefined),
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
  showPlayerSelector.value = false
  handleUpdateCurrentPlayer(character.id)
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

const getSimpleRoleDisplayName = (role: Role) => {
  switch (role) {
    case 'tank':
      return 'Tank'
    case 'healer':
      return 'Healer'
    case 'mdps':
      return 'Melee'
    case 'rdps':
      return 'Ranged'
    case 'dps':
    case 'frost':
    case 'fire':
    case 'arcane':
    case 'magic':
    case 'might':
      return 'DPS'
    default:
      return role
  }
}

const getRoleCounterClass = (role: 'tank' | 'healer' | 'dps') => {
  const current = roleCounts.value[role]
  const suggested = suggestedRoles.value[role]

  if (current === 0) {
    return 'bg-gray-50 border-gray-200 text-gray-400'
  } else if (current < suggested) {
    return 'bg-yellow-50 border-yellow-200 text-yellow-800'
  } else if (current === suggested) {
    return 'bg-green-50 border-green-200 text-green-800'
  } else {
    return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}
</script>
