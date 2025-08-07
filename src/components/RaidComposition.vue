<template>
  <div class="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg border border-slate-200 p-8">
    <RaidGrid :composition="composition" :characters="characters" @slot-click="handleSlotClick" />

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
import { ref, computed, onMounted } from 'vue'
import type { PlayerCharacter, CharacterRow, PlayerSlot, WoWClass, Role, TierType } from '@/types'
import RaidGrid from './RaidGrid.vue'
import SlotAssignmentModal from './SlotAssignmentModal.vue'

// Props
interface Props {
  characters: PlayerCharacter[]
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update-composition': [composition: CharacterRow[]]
}>()

// State
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

const handleAssignSlot = (wowClass: WoWClass, role: Role, tierType: TierType) => {
  const row = composition.value[assignmentModal.value.rowIndex]
  if (!row) return

  const isFirstSlot = assignmentModal.value.slotIndex === 0
  const selectedTier =
    tierType === 'R' ? row.character.unlockedTiers.r : row.character.unlockedTiers.d

  const newSlot: PlayerSlot = {
    class: wowClass,
    role,
    tier: selectedTier,
    tierType,
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

// Lifecycle
onMounted(() => {
  initializeCharacterGroups()
})
</script>
