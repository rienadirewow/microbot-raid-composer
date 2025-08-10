import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { RaidComposition, RaidSlot, CompanionAssignment, Faction, CharacterSlotGroup } from '@/types'
import { useStorage } from '@/composables/useStorage'
import { TOTAL_RAID_SLOTS, RAID_GROUPS, SLOTS_PER_GROUP } from '@/data/wow-data'

export const useRaidsStore = defineStore('raids', () => {
  const raids = ref<RaidComposition[]>([])
  const currentRaid = ref<RaidComposition | null>(null)
  const { getRaidCompositions, setRaidCompositions, isAuthenticated } = useStorage()

  // Load raids from storage
  const loadRaids = async () => {
    try {
      const stored = await getRaidCompositions()
      raids.value = stored || []
    } catch (error) {
      console.error('Failed to load raids:', error)
      raids.value = []
    }
  }

  // Watch for authentication changes and reload data
  watch(isAuthenticated, async () => {
    await loadRaids()
  })

  // Create a new raid
  const createNewRaid = (faction: Faction, name?: string) => {
    // Create legacy slots for backward compatibility
    const slots: RaidSlot[] = []
    let slotNumber = 1

    for (const group of RAID_GROUPS) {
      for (let i = 0; i < SLOTS_PER_GROUP; i++) {
        slots.push({
          slot: slotNumber,
          group: group as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        })
        slotNumber++
      }
    }

    const newRaid: RaidComposition = {
      id: crypto.randomUUID(),
      name: name || 'New Raid',
      faction,
      currentPlayerId: undefined,
      characterSlots: [], // Start with empty character slots
      slots, // Legacy format
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    raids.value.push(newRaid)
    currentRaid.value = newRaid
    setRaidCompositions(raids.value)
    return newRaid
  }

  // Assign a companion to a raid slot
  const assignCompanion = (slotNumber: number, companion: CompanionAssignment) => {
    if (!currentRaid.value) return false

    const slot = currentRaid.value.slots.find((s) => s.slot === slotNumber)
    if (slot) {
      slot.assignment = companion
      currentRaid.value.updatedAt = new Date()
      setRaidCompositions(raids.value)
      return true
    }
    return false
  }

  // Remove assignment from a slot
  const removeAssignment = (slotNumber: number) => {
    if (!currentRaid.value) return false

    const slot = currentRaid.value.slots.find((s) => s.slot === slotNumber)
    if (slot && slot.assignment) {
      slot.assignment = undefined
      currentRaid.value.updatedAt = new Date()
      setRaidCompositions(raids.value)
      return true
    }
    return false
  }

  // Save current raid
  const saveCurrentRaid = async () => {
    if (!currentRaid.value) return false

    const index = raids.value.findIndex((r) => r.id === currentRaid.value!.id)
    if (index !== -1) {
      raids.value[index] = { ...currentRaid.value }
    } else {
      raids.value.push(currentRaid.value)
    }

    await setRaidCompositions(raids.value)
    return true
  }

  // Load a raid as current
  const loadRaid = (raidId: string) => {
    const raid = raids.value.find((r) => r.id === raidId)
    if (raid) {
      currentRaid.value = { ...raid }
      return true
    }
    return false
  }

  // Delete a raid
  const deleteRaid = async (raidId: string) => {
    const index = raids.value.findIndex((r) => r.id === raidId)
    if (index !== -1) {
      raids.value.splice(index, 1)
      if (currentRaid.value?.id === raidId) {
        currentRaid.value = null
      }
      await setRaidCompositions(raids.value)
      return true
    }
    return false
  }

  // Delete current raid
  const deleteCurrentRaid = async () => {
    if (!currentRaid.value) return false
    return await deleteRaid(currentRaid.value.id)
  }

  // Update current raid name
  const updateCurrentRaidName = (newName: string) => {
    if (!currentRaid.value) return false

    currentRaid.value.name = newName
    currentRaid.value.updatedAt = new Date()

    // Update in the raids array as well
    const index = raids.value.findIndex((r) => r.id === currentRaid.value!.id)
    if (index !== -1) {
      raids.value[index] = { ...currentRaid.value }
    }

    return true
  }

  // Generate export string for the current raid
  const generateExportString = () => {
    if (!currentRaid.value) return ''

    const commands: string[] = []

    for (const slot of currentRaid.value.slots) {
      if (slot.assignment) {
        const { name, tier, class: wowClass, role, race } = slot.assignment
        commands.push(`.z addinvite ${name} ${tier} ${wowClass} ${role} default ${race}`)
      }
    }

    return commands.join('\n')
  }

  // Computed properties
  const currentRaidSlots = computed(() => currentRaid.value?.slots || [])

  const filledSlots = computed(
    () => currentRaidSlots.value.filter((slot) => slot.assignment).length,
  )

  const emptySlots = computed(
    () => currentRaidSlots.value.filter((slot) => !slot.assignment).length,
  )

  const fillPercentage = computed(() =>
    currentRaid.value ? (filledSlots.value / TOTAL_RAID_SLOTS) * 100 : 0,
  )

  const raidsByFaction = computed(() => ({
    mixed: raids.value.filter((r) => r.faction === 'mixed'),
  }))

  return {
    // State
    raids,
    currentRaid,

    // Actions
    loadRaids,
    createNewRaid,
    assignCompanion,
    removeAssignment,
    saveCurrentRaid,
    loadRaid,
    deleteRaid,
    deleteCurrentRaid,
    updateCurrentRaidName,
    generateExportString,

    // Computed
    currentRaidSlots,
    filledSlots,
    emptySlots,
    fillPercentage,
    raidsByFaction,
  }
})
