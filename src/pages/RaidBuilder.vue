<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Raids</h1>
          <p class="mt-2 text-gray-600">Create and manage your WoW Classic raid compositions</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="createNewRaid"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Raid
          </button>
        </div>
      </div>
    </div>

    <!-- Current Raid Status -->
    <div v-if="raidsStore.currentRaid" class="mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ raidsStore.currentRaid.name }}
            </h2>
            <p class="text-sm text-gray-600">Mixed Faction Raid</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-600">Fill Progress</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ raidsStore.filledSlots }}/40 slots
              </p>
            </div>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${raidsStore.fillPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center space-x-4">
          <button
            @click="saveCurrentRaid"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Save Raid
          </button>
          <button
            @click="exportRaid"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Export Commands
          </button>
          <button
            @click="clearCurrentRaid"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Companion Availability -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Available Companions</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="character in charactersStore.characters"
              :key="character.id"
              class="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="character.faction === 'alliance' ? 'bg-blue-600' : 'bg-red-600'"
                ></div>
                <span class="text-sm font-medium text-gray-900">{{ character.name }}</span>
                <span class="text-xs text-gray-500">{{ character.class }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="w-2 h-2 rounded-full border"
                  :class="
                    i <= getAvailableCompanionSlots(character)
                      ? 'bg-green-500 border-green-500'
                      : 'bg-gray-300 border-gray-300'
                  "
                ></div>
                <span class="text-xs text-gray-600 ml-1">
                  {{ getAvailableCompanionSlots(character) }}/4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Current Raid -->
    <div v-else class="mb-8">
      <div class="bg-white rounded-lg shadow p-12 text-center">
        <svg
          class="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No active raid</h3>
        <p class="mt-2 text-gray-600">
          Create a new raid to get started with building your composition.
        </p>
        <div class="mt-6 flex items-center justify-center">
          <button
            @click="createNewRaid"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Raid
          </button>
        </div>
      </div>
    </div>

    <!-- Saved Raids -->
    <div v-if="raidsStore.raids.length > 0" class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Saved Raids</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="raid in raidsStore.raids"
          :key="raid.id"
          class="bg-white rounded-lg shadow p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
          @click="loadRaid(raid.id)"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-gray-900">{{ raid.name }}</h3>
            <div class="w-3 h-3 rounded-full bg-purple-600"></div>
          </div>
          <p class="text-sm text-gray-600 mb-2">Mixed Faction</p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">
              {{ raid.slots.filter((s) => s.assignment).length }}/40 filled
            </span>
            <span class="text-gray-400">
              {{ new Date(raid.updatedAt).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Character Requirements -->
    <div
      v-if="charactersStore.totalCharacters === 0"
      class="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
    >
      <div class="flex items-center">
        <svg
          class="w-6 h-6 text-yellow-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-yellow-800">No characters found</h3>
          <p class="text-yellow-700">
            You need to add some characters first before you can build raids.
            <router-link to="/characters" class="underline font-medium"
              >Go to Character Manager</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { PlayerCharacter } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'

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
