import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { PlayerCharacter, Faction, TierLevel, Role } from '@/types'
import { useStorage } from '@/composables/useStorage'
import { CLASS_DEFAULT_ROLES } from '@/data/wow-data'

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<PlayerCharacter[]>([])
  const { getPlayerCharacters, setPlayerCharacters, isAuthenticated } = useStorage()

  // Load characters from storage
  const loadCharacters = async () => {
    try {
      const stored = await getPlayerCharacters()
      let loadedCharacters = stored || []
      
      // Migration: Add default roles to existing characters that don't have them
      let needsSave = false
      loadedCharacters = loadedCharacters.map(character => {
        if (!character.defaultRole && character.class) {
          needsSave = true
          return {
            ...character,
            defaultRole: CLASS_DEFAULT_ROLES[character.class]
          }
        }
        return character
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

  // Add a new character
  const addCharacter = async (character: Omit<PlayerCharacter, 'id' | 'createdAt'>) => {
    const newCharacter: PlayerCharacter = {
      ...character,
      id: crypto.randomUUID(),
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

  // Get character by ID
  const getCharacterById = (id: string) => {
    return characters.value.find((c) => c.id === id)
  }

  // Computed properties
  const allianceCharacters = computed(() =>
    characters.value.filter((c) => c.faction === 'alliance'),
  )

  const hordeCharacters = computed(() => characters.value.filter((c) => c.faction === 'horde'))

  const charactersByFaction = computed(() => ({
    alliance: allianceCharacters.value,
    horde: hordeCharacters.value,
  }))

  const totalCharacters = computed(() => characters.value.length)

  return {
    // State
    characters,

    // Actions
    loadCharacters,
    addCharacter,
    updateCharacter,
    updateCharacterTiers,
    updateCharacterRole,
    deleteCharacter,
    getCharacterById,

    // Computed
    allianceCharacters,
    hordeCharacters,
    charactersByFaction,
    totalCharacters,
  }
})
