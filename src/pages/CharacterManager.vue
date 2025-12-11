<template>
  <div class="max-w-6xl mx-auto p-4">
    <!-- Loading State -->
    <LoadingState v-if="isLoading" message="Loading characters..." />

    <template v-else>
      <!-- Header -->
      <PageHeader
        title="Character Manager"
        description="Manage your WoW characters and their tier progression"
      >
        <template #action>
          <Button @click="showCreateForm = true">Add Character</Button>
        </template>
      </PageHeader>

      <!-- Character Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Characters"
          :value="charactersStore.totalCharacters"
          variant="blue"
          icon-path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
        <StatCard
          label="Alliance"
          :value="charactersStore.allianceCharacters.length"
          variant="green"
          icon-path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatCard
          label="Horde"
          :value="charactersStore.hordeCharacters.length"
          variant="red"
          icon-path="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </div>

      <!-- Character List -->
      <CharacterList title="Characters">
        <EmptyState
          v-if="charactersStore.totalCharacters === 0"
          title="No characters found"
          description="Get started by adding your first character."
        />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CharacterCard
            v-for="character in charactersStore.accountCharacters"
            :key="character.id"
            :character="character"
            @edit="editCharacter"
            @delete="deleteCharacter"
            @update:tiers="updateCharacterTiers"
            @update:role="updateCharacterRole"
          />
        </div>
      </CharacterList>

      <!-- Character Form Modal -->
      <CharacterForm
        v-if="showCreateForm || editingCharacter"
        :character="editingCharacter"
        @close="closeForm"
        @save="saveCharacter"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PlayerCharacter, TierLevel, Role } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import CharacterCard from '../components/CharacterCard.vue'
import CharacterForm from '../components/forms/CharacterForm.vue'
import StatCard from '../components/ui/StatCard.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import PageHeader from '../components/layout/PageHeader.vue'
import CharacterList from '../components/layout/CharacterList.vue'
import LoadingState from '../components/ui/LoadingState.vue'
import Button from '../components/ui/Button.vue'

// State
const showCreateForm = ref(false)
const editingCharacter = ref<PlayerCharacter | null>(null)
const isLoading = ref(false)

// Store
const charactersStore = useCharactersStore()

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  try {
    await charactersStore.loadCharacters()
  } finally {
    isLoading.value = false
  }
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

const saveCharacter = async (characterData: Omit<PlayerCharacter, 'id' | 'accountId' | 'createdAt'>) => {
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

const updateCharacterRole = async (characterId: string, role: Role) => {
  try {
    await charactersStore.updateCharacterRole(characterId, role)
  } catch (error) {
    console.error('Failed to update character role:', error)
    alert('Failed to update character role. Please try again.')
  }
}
</script>
