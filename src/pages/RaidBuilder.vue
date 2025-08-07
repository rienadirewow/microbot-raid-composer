<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <PageHeader title="Raids" description="Create and manage your WoW Classic raid compositions">
      <template #action>
        <Button @click="createNewRaid">New Raid</Button>
      </template>
    </PageHeader>

    <!-- Current Raid Status -->
    <RaidStatus
      v-if="raidsStore.currentRaid"
      :raid-name="raidsStore.currentRaid.name"
      raid-type="Mixed Faction Raid"
      :filled-slots="raidsStore.filledSlots"
      :characters="charactersStore.characters"
      :get-available-companion-slots="getAvailableCompanionSlots"
      @save="saveCurrentRaid"
      @export="exportRaid"
      @clear="clearCurrentRaid"
    />

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
          raid-type="Mixed Faction"
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
import { onMounted } from 'vue'
import type { PlayerCharacter } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import PageHeader from '../components/layout/PageHeader.vue'
import Button from '../components/ui/Button.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import WarningBanner from '../components/ui/WarningBanner.vue'
import RaidStatus from '../components/RaidStatus.vue'
import SavedRaidCard from '../components/SavedRaidCard.vue'

// Stores
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

// Lifecycle
onMounted(async () => {
  await Promise.all([charactersStore.loadCharacters(), raidsStore.loadRaids()])
})

// Methods
const createNewRaid = () => {
  raidsStore.createNewRaid('mixed')
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

const loadRaid = (raidId: string) => {
  raidsStore.loadRaid(raidId)
}

const getAvailableCompanionSlots = (character: PlayerCharacter) => {
  // Count how many companions from this character are already assigned to the current raid
  const assignedCompanions = raidsStore.currentRaidSlots.filter(
    (slot) => slot.assignment?.ownerId === character.id,
  ).length

  return Math.max(0, 4 - assignedCompanions)
}
</script>
