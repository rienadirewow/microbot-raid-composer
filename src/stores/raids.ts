import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
  RaidComposition,
  RaidSlot,
  CompanionAssignment,
  Faction,
  CharacterSlotGroup,
  Role,
  WoWClass,
  TierLevel,
  TierType,
} from '@/types'
import { useStorage } from '@/composables/useStorage'
import { TOTAL_RAID_SLOTS, RAID_GROUPS, SLOTS_PER_GROUP } from '@/data/wow-data'
import { useCharactersStore } from './characters'
import { useAccountsStore } from './accounts'

export const useRaidsStore = defineStore('raids', () => {
  const raids = ref<RaidComposition[]>([])
  const currentRaid = ref<RaidComposition | null>(null)
  const { getRaidCompositions, setRaidCompositions, isAuthenticated } = useStorage()
  const accountsStore = useAccountsStore()

  const loadRaids = async () => {
    try {
      const stored = await getRaidCompositions()
      let loadedRaids = stored || []

      let needsSave = false
      loadedRaids = loadedRaids.map((raid) => {
        if (!raid.accountId) {
          needsSave = true
          return {
            ...raid,
            accountId: 'default',
          }
        }
        return raid
      })

      raids.value = loadedRaids

      if (needsSave) {
        await setRaidCompositions(raids.value)
      }
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
    if (!accountsStore.selectedAccountId) {
      throw new Error('No account selected')
    }

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
      accountId: accountsStore.selectedAccountId,
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

  const formatTier = (tier: TierLevel, tierType: TierType): string => {
    if (tier === 0) return 't0'
    return `t${tier}${tierType.toLowerCase()}`
  }

  const formatRoleAndSpec = (role: Role, wowClass: WoWClass): { role: string; spec: string } => {
    if (wowClass === 'paladin' && (role === 'magic' || role === 'might')) {
      return { role: 'dps', spec: role }
    }
    switch (role) {
      case 'mdps':
        return { role: 'meleedps', spec: 'default' }
      case 'rdps':
        return { role: 'rangedps', spec: 'default' }
      default:
        return { role, spec: 'default' }
    }
  }

  const formatLiteRole = (role: Role, wowClass: WoWClass): string => {
    if (wowClass === 'paladin' && (role === 'magic' || role === 'might')) {
      return 'dps'
    }
    switch (role) {
      case 'mdps':
      case 'rdps':
        return 'dps'
      default:
        return role
    }
  }

  const generateExportString = () => {
    if (!currentRaid.value) return ''

    const charactersStore = useCharactersStore()
    const characterSlots = currentRaid.value.characterSlots
    const currentPlayerId = currentRaid.value.currentPlayerId

    if (!characterSlots || characterSlots.length === 0) return ''

    const currentPlayerCompanions: string[] = []
    let currentPlayerLite: string | null = null
    const otherLites: string[] = []
    const otherCompanions: string[] = []

    for (const group of characterSlots) {
      const character = charactersStore.getCharacterById(group.characterId)
      if (!character) continue

      const isCurrentPlayer = group.characterId === currentPlayerId

      if (group.liteSlot) {
        const liteRole = formatLiteRole(group.liteSlot.role, character.class)
        const liteCommand = `.z addlegacy ${character.name} ${liteRole}`

        if (isCurrentPlayer) {
          currentPlayerLite = liteCommand
        } else {
          otherLites.push(liteCommand)
        }
      }

      for (const slot of group.companionSlots) {
        if (!slot) continue

        const tier = formatTier(slot.tier, slot.tierType)
        const { role, spec } = formatRoleAndSpec(slot.role, slot.class)
        const race = slot.race || 'default'

        const compCommand = `.z addinvite ${character.name} ${tier} ${slot.class} ${role} ${spec} ${race}`

        if (isCurrentPlayer) {
          currentPlayerCompanions.push(compCommand)
        } else {
          otherCompanions.push(compCommand)
        }
      }
    }

    // Order: current player's companions (up to 3-4), current player's lite, other lites, other companions
    // If current player has 4 companions, hire those first, then lite goes with other lites
    // If current player has 3 or fewer companions, hire those + lite (total 4), then other lites, then other companions
    const allCommands: string[] = []

    if (currentPlayerCompanions.length >= 4) {
      // 4 companions first, then current player's lite with other lites
      allCommands.push(...currentPlayerCompanions.slice(0, 4))
      if (currentPlayerLite) {
        allCommands.push(currentPlayerLite)
      }
      allCommands.push(...otherLites)
      allCommands.push(...otherCompanions)
      // Any extra companions from current player at the end
      if (currentPlayerCompanions.length > 4) {
        allCommands.push(...currentPlayerCompanions.slice(4))
      }
    } else {
      // 3 or fewer companions, then lite (to make 4), then other lites, then other companions
      allCommands.push(...currentPlayerCompanions)
      if (currentPlayerLite) {
        allCommands.push(currentPlayerLite)
      }
      allCommands.push(...otherLites)
      allCommands.push(...otherCompanions)
    }

    // Generate Lua script
    const commandsArray = allCommands.map((cmd) => `        "${cmd}"`).join(',\n')

    // Get current player name for validation
    const currentPlayerCharacter = currentPlayerId
      ? charactersStore.getCharacterById(currentPlayerId)
      : null
    const expectedPlayerName = currentPlayerCharacter?.name?.toLowerCase() || ''

    const luaScript = `local commands = {
${commandsArray}
}

local expectedPlayer = "${expectedPlayerName}"
local currentPlayer = string.lower(UnitName("player"))

if currentPlayer ~= expectedPlayer then
    DEFAULT_CHAT_FRAME:AddMessage("[Raid Composer] ERROR: Wrong character!", 1, 0, 0)
    DEFAULT_CHAT_FRAME:AddMessage("Expected: " .. expectedPlayer, 1, 0, 0)
    DEFAULT_CHAT_FRAME:AddMessage("Current: " .. currentPlayer, 1, 0, 0)
    return
end

local function countTableElements(tbl)
    local count = 0
    for _ in pairs(tbl) do count = count + 1 end
    return count
end

local delay = 500
local index = 0
local elapsed = 0
local totalCommands = countTableElements(commands)

local indicatorFrame = CreateFrame("Frame", nil, UIParent)
indicatorFrame:SetScript("OnUpdate", function(self)
    elapsed = elapsed + 1
    if elapsed >= delay or index == 0 then
        index = index + 1
        if index <= totalCommands then
            SendChatMessage(commands[index])
            elapsed = 0
        else
            indicatorFrame:SetScript("OnUpdate", nil)
        end
    end
end)`

    return luaScript
  }

  const migrateRaidsToAccount = async (accountId: string) => {
    raids.value = raids.value.map((raid) =>
      !raid.accountId || raid.accountId === 'default' ? { ...raid, accountId } : raid,
    )
    await setRaidCompositions(raids.value)
  }

  const accountRaids = computed(() => {
    if (!accountsStore.selectedAccountId) return []
    return raids.value.filter((r) => r.accountId === accountsStore.selectedAccountId)
  })

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
    migrateRaidsToAccount,

    // Computed
    accountRaids,
    currentRaidSlots,
    filledSlots,
    emptySlots,
    fillPercentage,
    raidsByFaction,
  }
})
