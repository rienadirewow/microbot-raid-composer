<template>
  <Modal :title="character ? 'Edit Character' : 'Add Character'" @close="$emit('close')">
    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Name -->
      <FormField
        id="name"
        label="Character Name"
        v-model="form.name"
        type="text"
        required
        :error="errors.name"
        ref="nameInput"
      />

      <!-- Race -->
      <SelectField
        id="race"
        label="Race"
        v-model="form.race"
        placeholder="Select Race"
        required
        @update:modelValue="handleRaceChange"
      >
        <optgroup label="Alliance">
          <option v-for="race in ALLIANCE_RACES" :key="race" :value="race">
            {{ formatRaceName(race) }}
          </option>
        </optgroup>
        <optgroup label="Horde">
          <option v-for="race in HORDE_RACES" :key="race" :value="race">
            {{ formatRaceName(race) }}
          </option>
        </optgroup>
      </SelectField>

      <!-- Class -->
      <SelectField
        id="class"
        label="Class"
        v-model="form.class"
        placeholder="Select Class"
        required
        @update:modelValue="handleClassChange"
      >
        <option v-for="wowClass in availableClasses" :key="wowClass" :value="wowClass">
          {{ wowClass.charAt(0).toUpperCase() + wowClass.slice(1) }}
        </option>
      </SelectField>


      <!-- Licenses -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"> Licenses </label>
        <div class="grid grid-cols-6 gap-2">
          <label
            v-for="tier in RAID_TIERS"
            :key="tier"
            class="flex items-center space-x-2 px-3 py-2 border rounded-md cursor-pointer transition-colors focus-within:outline-2"
            :class="getTierColor(tier, form.unlockedTiers.r >= tier)"
          >
            <input
              v-model="form.unlockedTiers.r"
              type="radio"
              :value="tier"
              name="raid-tier"
              class="sr-only"
            />
            <span class="text-xs"> T{{ tier }}R </span>
          </label>

          <label
            v-for="tier in DUNGEON_TIERS"
            :key="tier"
            class="flex items-center space-x-2 px-3 py-2 border rounded-md cursor-pointer transition-colors focus-within:outline-2"
            :class="getTierColor(tier, form.unlockedTiers.d >= tier)"
          >
            <input
              v-model="form.unlockedTiers.d"
              type="radio"
              :value="tier"
              name="dungeon-tier"
              class="sr-only"
            />
            <span class="text-xs"> T{{ tier }}D </span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <FormActions
        :is-submitting="isSubmitting"
        :submit-text="character ? 'Update' : 'Create'"
        @cancel="$emit('close')"
      />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { PlayerCharacter, Faction, Race, WoWClass, TierLevel, Role } from '@/types'
import {
  CLASS_RACE_RESTRICTIONS,
  CLASS_DEFAULT_ROLES,
  validateClassRace,
  ALLIANCE_RACES,
  HORDE_RACES,
} from '@/data/wow-data'
import Modal from '../ui/Modal.vue'
import FormField from './FormField.vue'
import SelectField from './SelectField.vue'
import FormActions from './FormActions.vue'

// Props
interface Props {
  character?: PlayerCharacter | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  save: [characterData: Omit<PlayerCharacter, 'id' | 'createdAt'>]
}>()

// State
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  faction: '' as Faction,
  race: '' as Race,
  class: '' as WoWClass,
  unlockedTiers: {
    r: 0 as TierLevel,
    d: 0 as TierLevel,
  },
})

const nameInput = ref<HTMLInputElement>()

// Computed
const availableClasses = computed(() => {
  if (!form.value.race) return []
  return Object.keys(CLASS_RACE_RESTRICTIONS).filter((wowClass) =>
    validateClassRace(wowClass as WoWClass, form.value.race),
  ) as WoWClass[]
})


const RAID_TIERS: TierLevel[] = [0, 1, 2, 3, 4, 5]
const DUNGEON_TIERS: TierLevel[] = [0, 1, 2, 3, 4, 5]

// WoW gear quality colors for tiers
const getTierColor = (tier: TierLevel, isUnlocked: boolean) => {
  if (!isUnlocked) {
    return 'bg-gray-100 text-gray-400 border-gray-100'
  }

  // Map tiers to WoW gear quality colors
  const tierColors: Record<TierLevel, string> = {
    0: 'font-bold bg-gray-200 text-gray-700 border-gray-500', // Grey
    1: 'font-bold bg-white text-gray-900 border-gray-500', // White
    2: 'font-bold bg-green-100 text-green-800 border-green-400', // Green
    3: 'font-bold bg-blue-100 text-blue-800 border-blue-400', // Blue
    4: 'font-bold bg-purple-100 text-purple-800 border-purple-400', // Purple
    5: 'font-bold bg-orange-100 text-orange-800 border-orange-400', // Orange
  }

  return tierColors[tier]
}

// Watchers
watch(
  () => props.character,
  (character) => {
    if (character) {
      form.value = {
        name: character.name,
        faction: character.faction,
        race: character.race,
        class: character.class,
        unlockedTiers: { ...character.unlockedTiers },
      }
    } else {
      // Reset form for new character
      form.value = {
        name: '',
        faction: '' as Faction,
        race: '' as Race,
        class: '' as WoWClass,
        unlockedTiers: {
          r: 0 as TierLevel,
          d: 0 as TierLevel,
        },
      }
    }
  },
  { immediate: true },
)

// Watchers
watch(
  () => form.value.race,
  () => {
    form.value.class = '' as WoWClass
    errors.value = {}
  },
)

// Autofocus name field when form opens
watch(
  () => props.character,
  (character) => {
    if (!character) {
      // New character form - focus name field
      nextTick(() => {
        nameInput.value?.focus()
      })
    }
  },
  { immediate: true },
)

// Methods
const formatRaceName = (race: string) => {
  return race.charAt(0).toUpperCase() + race.slice(1).replace(/([A-Z])/g, ' $1')
}


const handleRaceChange = () => {
  form.value.class = '' as WoWClass
}

const handleClassChange = () => {
  // Reset validation errors when class changes
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Character name is required'
  }

  if (!form.value.race) {
    errors.value.race = 'Race is required'
  }

  if (!form.value.class) {
    errors.value.class = 'Class is required'
  }

  // Validate class/race combination
  if (form.value.class && form.value.race) {
    if (!validateClassRace(form.value.class, form.value.race)) {
      errors.value.class = `Invalid class/race combination for ${form.value.class} and ${form.value.race}`
    }
  }


  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate API call

    // Determine faction from race
    const allianceRaces = ['human', 'dwarf', 'nightelf', 'gnome']
    const faction: Faction = allianceRaces.includes(form.value.race) ? 'alliance' : 'horde'

    const characterData: Omit<PlayerCharacter, 'id' | 'createdAt'> = {
      name: form.value.name.trim(),
      faction,
      race: form.value.race,
      class: form.value.class,
      defaultRole: CLASS_DEFAULT_ROLES[form.value.class],
      level: 60,
      unlockedTiers: form.value.unlockedTiers,
    }

    // Emit save event
    emit('save', characterData)
  } catch (error) {
    console.error('Failed to save character:', error)
    errors.value.general = 'Failed to save character. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
