<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Character Manager</h1>
          <p class="mt-2 text-gray-600">Manage your WoW characters and their tier progression</p>
        </div>
        <button
          @click="showCreateForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <span>Add Character</span>
        </button>
      </div>
    </div>

    <!-- Character Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Characters</p>
            <p class="text-2xl font-bold text-gray-900">{{ charactersStore.totalCharacters }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Alliance</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ charactersStore.allianceCharacters.length }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Horde</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ charactersStore.hordeCharacters.length }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Character List -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Characters</h2>
      </div>
      <div class="p-6">
        <div v-if="charactersStore.totalCharacters === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No characters found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by adding your first character.</p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CharacterCard
            v-for="character in charactersStore.characters"
            :key="character.id"
            :character="character"
            @edit="editCharacter"
            @delete="deleteCharacter"
            @update:tiers="updateCharacterTiers"
          />
        </div>
      </div>
    </div>

    <!-- Character Form Modal -->
    <CharacterForm
      v-if="showCreateForm || editingCharacter"
      :character="editingCharacter"
      @close="closeForm"
      @save="saveCharacter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PlayerCharacter, TierLevel } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import CharacterCard from './CharacterCard.vue'
import CharacterForm from './CharacterForm.vue'

// State
const showCreateForm = ref(false)
const editingCharacter = ref<PlayerCharacter | null>(null)

// Store
const charactersStore = useCharactersStore()

// Lifecycle
onMounted(async () => {
  await charactersStore.loadCharacters()
})

// Methods
const editCharacter = (character: PlayerCharacter) => {
  editingCharacter.value = character
}

const deleteCharacter = async (characterId: string) => {
  if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
    await charactersStore.deleteCharacter(characterId)
  }
}

const closeForm = () => {
  showCreateForm.value = false
  editingCharacter.value = null
}

const saveCharacter = async (characterData: Omit<PlayerCharacter, 'id' | 'createdAt'>) => {
  try {
    if (editingCharacter.value) {
      await charactersStore.updateCharacter(editingCharacter.value.id, characterData)
    } else {
      await charactersStore.addCharacter(characterData)
    }
    closeForm()
  } catch (error) {
    console.error('Failed to save character:', error)
    alert('Failed to save character. Please try again.')
  }
}

const updateCharacterTiers = async (characterId: string, tiers: { r: TierLevel; d: TierLevel }) => {
  try {
    await charactersStore.updateCharacterTiers(characterId, tiers)
  } catch (error) {
    console.error('Failed to update character tiers:', error)
    alert('Failed to update character tiers. Please try again.')
  }
}
</script>
