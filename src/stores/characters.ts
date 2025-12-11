import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { PlayerCharacter, TierLevel, Role } from '@/types'
import { useStorage } from '@/composables/useStorage'
import { useAccountsStore } from './accounts'
import { CLASS_DEFAULT_ROLES } from '@/data/wow-data'

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<PlayerCharacter[]>([])
  const { getPlayerCharacters, setPlayerCharacters, isAuthenticated } = useStorage()
  const accountsStore = useAccountsStore()

  // Load characters from storage
  const loadCharacters = async () => {
    try {
      const stored = await getPlayerCharacters()
      let loadedCharacters = stored || []

      let needsSave = false
      loadedCharacters = loadedCharacters.map((character) => {
        let updated = { ...character }

        if (!updated.accountId) {
          needsSave = true
          updated = { ...updated, accountId: 'default' }
        }

        if (!updated.defaultRole && updated.class) {
          needsSave = true
          updated = { ...updated, defaultRole: CLASS_DEFAULT_ROLES[updated.class] }
        }

        return updated
      })

      characters.value = loadedCharacters

      // Save migrated data if needed
      if (needsSave) {
        await setPlayerCharacters(characters.value)
        console.log('Migrated character default roles')
      }
    } catch (error) {
      console.error('Failed to load characters:', error)
      characters.value = []
    }
  }

  // Watch for authentication changes and reload data
  watch(isAuthenticated, async () => {
    await loadCharacters()
  })

  const accountCharacters = computed(() => {
    if (!accountsStore.selectedAccountId) return []
    return characters.value.filter((c) => c.accountId === accountsStore.selectedAccountId)
  })

  const addCharacter = async (
    character: Omit<PlayerCharacter, 'id' | 'accountId' | 'createdAt'>,
  ) => {
    if (!accountsStore.selectedAccountId) {
      throw new Error('No account selected')
    }

    const newCharacter: PlayerCharacter = {
      ...character,
      id: crypto.randomUUID(),
      accountId: accountsStore.selectedAccountId,
      createdAt: new Date(),
    }

    characters.value.push(newCharacter)
    await setPlayerCharacters(characters.value)
    return newCharacter
  }

  // Update an existing character
  const updateCharacter = async (id: string, updates: Partial<PlayerCharacter>) => {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      characters.value[index] = { ...characters.value[index], ...updates }
      await setPlayerCharacters(characters.value)
      return characters.value[index]
    }
    throw new Error('Character not found')
  }

  // Update character tiers only
  const updateCharacterTiers = async (id: string, tiers: { r: TierLevel; d: TierLevel }) => {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      characters.value[index] = { ...characters.value[index], unlockedTiers: tiers }
      await setPlayerCharacters(characters.value)
      return characters.value[index]
    }
    throw new Error('Character not found')
  }

  // Update character default role only
  const updateCharacterRole = async (id: string, role: Role) => {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      characters.value[index] = { ...characters.value[index], defaultRole: role }
      await setPlayerCharacters(characters.value)
      return characters.value[index]
    }
    throw new Error('Character not found')
  }

  // Delete a character
  const deleteCharacter = async (id: string) => {
    const index = characters.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      characters.value.splice(index, 1)
      await setPlayerCharacters(characters.value)
      return true
    }
    return false
  }

  const getCharacterById = (id: string) => {
    return characters.value.find((c) => c.id === id)
  }

  const migrateCharactersToAccount = async (accountId: string) => {
    characters.value = characters.value.map((char) =>
      !char.accountId || char.accountId === 'default' ? { ...char, accountId } : char,
    )
    await setPlayerCharacters(characters.value)
  }

  const allianceCharacters = computed(() =>
    accountCharacters.value.filter((c) => c.faction === 'alliance'),
  )

  const hordeCharacters = computed(() =>
    accountCharacters.value.filter((c) => c.faction === 'horde'),
  )

  const charactersByFaction = computed(() => ({
    alliance: allianceCharacters.value,
    horde: hordeCharacters.value,
  }))

  const totalCharacters = computed(() => accountCharacters.value.length)

  return {
    characters,
    loadCharacters,
    addCharacter,
    updateCharacter,
    updateCharacterTiers,
    updateCharacterRole,
    deleteCharacter,
    getCharacterById,
    migrateCharactersToAccount,
    accountCharacters,
    allianceCharacters,
    hordeCharacters,
    charactersByFaction,
    totalCharacters,
  }
})
