<template>
  <div
    class="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg border border-slate-200 p-6"
  >
    <RaidGrid
      :composition="composition"
      :characters="characters"
      :current-player-id="currentPlayerId"
      @slot-click="handleSlotClick"
      @update-current-player="handleUpdateCurrentPlayer"
    />

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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type {
  PlayerCharacter,
  CharacterRow,
  PlayerSlot,
  WoWClass,
  Role,
  TierType,
  TierLevel,
  RaidComposition as RaidCompositionType,
  Race,
} from '@/types'
import RaidGrid from './RaidGrid.vue'
import SlotAssignmentModal from './SlotAssignmentModal.vue'

// Props
interface Props {
  characters: PlayerCharacter[]
  currentRaid?: RaidCompositionType
  currentPlayerId?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update-composition': [composition: CharacterRow[]]
  'update-current-player': [playerId: string]
}>()

// State
const composition = ref<CharacterRow[]>([])
const currentPlayerId = ref<string>(props.currentPlayerId || '')
const assignmentModal = ref<{
  isOpen: boolean
  rowIndex: number
  slotIndex: number
}>({
  isOpen: false,
  rowIndex: 0,
  slotIndex: 0,
})

// Computed
const currentSlot = computed(() => {
  const row = composition.value[assignmentModal.value.rowIndex]
  return row?.slots[assignmentModal.value.slotIndex] || null
})

const currentCharacter = computed(() => {
  const row = composition.value[assignmentModal.value.rowIndex]
  return row?.character || props.characters[0]
})

// Methods
const initializeCharacterGroups = () => {
  if (props.currentRaid) {
    // Initialize with existing raid data
    composition.value = props.characters.map((character) => {
      const slots: (PlayerSlot | null)[] = Array(5).fill(null)

      // Find the character's row in the raid (assuming characters are in order)
      const characterIndex = props.characters.findIndex((c) => c.id === character.id)
      if (characterIndex !== -1) {
        // Map raid slots to character slots
        for (let i = 0; i < 5; i++) {
          const raidSlotIndex = characterIndex * 5 + i
          const raidSlot = props.currentRaid!.slots[raidSlotIndex]

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
  } else {
    // Initialize with empty slots
    composition.value = props.characters.map((character) => {
      const slots: (PlayerSlot | null)[] = Array(5).fill(null)

      // Auto-assign first slot with character's class and default role
      const defaultRole: Role = canAssignRole(character.class, 'tank')
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

      return {
        character,
        slots,
      }
    })
  }
}

const canAssignRole = (wowClass: WoWClass, role: Role): boolean => {
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

  assignmentModal.value = {
    isOpen: true,
    rowIndex,
    slotIndex,
  }
}

const closeAssignmentModal = () => {
  assignmentModal.value.isOpen = false
}

const handleAssignSlot = (wowClass: WoWClass, role: Role, tierType: TierType, tier: TierLevel, race?: Race) => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  const isFirstSlot = assignmentModal.value.slotIndex === 0

  const newSlot: PlayerSlot = {
    class: wowClass,
    role,
    tier,
    tierType,
    race,
    isCharacter: isFirstSlot,
    characterName: isFirstSlot ? row.character.name : undefined,
    isControlMember: row.character.name === 'Current Player',
  }

  row.slots[assignmentModal.value.slotIndex] = newSlot

  // Emit update
  emit('update-composition', composition.value)
}

const handleClearSlot = () => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  row.slots[assignmentModal.value.slotIndex] = null

  // Emit update
  emit('update-composition', composition.value)
}

const handleUpdateCurrentPlayer = (playerId: string) => {
  currentPlayerId.value = playerId
  emit('update-current-player', playerId)
}

// Lifecycle
onMounted(() => {
  initializeCharacterGroups()
})

// Watch for changes in currentRaid or characters
watch(
  [() => props.currentRaid, () => props.characters],
  () => {
    initializeCharacterGroups()
  },
  { deep: true },
)
</script>
