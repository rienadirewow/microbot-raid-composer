<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Select Companion for Slot {{ slotNumber }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Character Groups -->
        <div class="space-y-6">
          <div
            v-for="character in charactersStore.characters"
            :key="character.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <!-- Character Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :class="character.faction === 'alliance' ? 'bg-blue-600' : 'bg-red-600'"
                ></div>
                <h4 class="font-medium text-gray-900">{{ character.name }}</h4>
                <span class="text-sm text-gray-500">
                  Level {{ character.level }} {{ character.race }} {{ character.class }}
                </span>
              </div>
              <span class="text-sm text-gray-500"> 4/4 companions available </span>
            </div>

            <!-- Companion Slots -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div
                v-for="companionIndex in 4"
                :key="companionIndex"
                class="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer hover:bg-blue-50"
                @click="selectCompanion(character, companionIndex)"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-900">
                    Companion {{ companionIndex }}
                  </span>
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                </div>

                <div class="space-y-2">
                  <input
                    v-model="companionForms[`${character.id}-${companionIndex}`].name"
                    type="text"
                    placeholder="Companion name"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />

                  <select
                    v-model="companionForms[`${character.id}-${companionIndex}`].class"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    <option
                      v-for="wowClass in getAvailableClasses(character)"
                      :key="wowClass"
                      :value="wowClass"
                    >
                      {{ wowClass.charAt(0).toUpperCase() + wowClass.slice(1) }}
                    </option>
                  </select>

                  <select
                    v-model="companionForms[`${character.id}-${companionIndex}`].role"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="tank">Tank</option>
                    <option value="healer">Healer</option>
                    <option value="meleedps">Melee DPS</option>
                    <option value="rangedps">Ranged DPS</option>
                  </select>

                  <select
                    v-model="companionForms[`${character.id}-${companionIndex}`].tier"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Tier</option>
                    <optgroup label="Raid Tiers">
                      <option
                        v-for="tier in getAvailableRaidTiers(character)"
                        :key="tier"
                        :value="tier"
                      >
                        T{{ tier }}R
                      </option>
                    </optgroup>
                    <optgroup label="Dungeon Tiers">
                      <option
                        v-for="tier in getAvailableDungeonTiers(character)"
                        :key="tier"
                        :value="tier"
                      >
                        T{{ tier }}D
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlayerCharacter, CompanionAssignment, WoWClass, Role, TierLevel } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { CLASS_RACE_RESTRICTIONS } from '@/data/wow-data'

// Props
interface Props {
  slotNumber: number
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  select: [companion: CompanionAssignment]
}>()

// Store
const charactersStore = useCharactersStore()

// State
const companionForms = ref<
  Record<
    string,
    {
      name: string
      class: WoWClass
      role: Role
      tier: TierLevel
    }
  >
>({})

// Computed
const getAvailableCompanionSlots = (character: PlayerCharacter) => {
  return 4 // All characters are level 60
}

const getAvailableClasses = (character: PlayerCharacter) => {
  return Object.keys(CLASS_RACE_RESTRICTIONS).filter((wowClass) =>
    CLASS_RACE_RESTRICTIONS[wowClass as WoWClass].includes(character.race),
  ) as WoWClass[]
}

const getAvailableRaidTiers = (character: PlayerCharacter): TierLevel[] => {
  return Array.from({ length: character.unlockedTiers.r + 1 }, (_, i) => i as TierLevel)
}

const getAvailableDungeonTiers = (character: PlayerCharacter): TierLevel[] => {
  return Array.from({ length: character.unlockedTiers.d + 1 }, (_, i) => i as TierLevel)
}

// Methods
const selectCompanion = (character: PlayerCharacter, companionIndex: number) => {
  const formKey = `${character.id}-${companionIndex}`
  const form = companionForms.value[formKey]

  if (!form || !form.name || !form.class || !form.role || !form.tier) {
    alert('Please fill in all companion details')
    return
  }

  const companion: CompanionAssignment = {
    id: crypto.randomUUID(),
    name: form.name,
    class: form.class,
    role: form.role,
    tier: form.tier,
    race: character.race,
    ownerId: character.id,
  }

  emit('select', companion)
  emit('close')
}
</script>
