<template>
  <div class="space-y-2">
    <input
      :value="modelValue.name"
      type="text"
      placeholder="Companion name"
      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      @input="updateField('name', ($event.target as HTMLInputElement).value)"
    />

    <select
      :value="modelValue.class"
      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      @change="updateField('class', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Select Class</option>
      <option v-for="wowClass in availableClasses" :key="wowClass" :value="wowClass">
        {{ wowClass.charAt(0).toUpperCase() + wowClass.slice(1) }}
      </option>
    </select>

    <select
      :value="modelValue.role"
      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      @change="updateField('role', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Select Role</option>
      <option value="tank">Tank</option>
      <option value="healer">Healer</option>
      <option value="mdps">Melee DPS</option>
      <option value="rdps">Ranged DPS</option>
    </select>

    <select
      :value="modelValue.tier"
      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      @change="updateField('tier', Number(($event.target as HTMLSelectElement).value))"
    >
      <option value="">Select Tier</option>
      <optgroup label="Raid Tiers">
        <option v-for="tier in availableRaidTiers" :key="tier" :value="tier">T{{ tier }}R</option>
      </optgroup>
      <optgroup label="Dungeon Tiers">
        <option v-for="tier in availableDungeonTiers" :key="tier" :value="tier">
          T{{ tier }}D
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WoWClass, Role, TierLevel, Race } from '@/types'
import { CLASS_RACE_RESTRICTIONS } from '@/data/wow-data'

// Props
interface Props {
  modelValue: {
    name: string
    class: WoWClass
    role: Role
    tier: TierLevel
  }
  characterRace: Race
  unlockedTiers: {
    r: TierLevel
    d: TierLevel
  }
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [
    form: {
      name: string
      class: WoWClass
      role: Role
      tier: TierLevel
    },
  ]
}>()

// Computed
const availableClasses = computed(() => {
  return Object.keys(CLASS_RACE_RESTRICTIONS).filter((wowClass) =>
    CLASS_RACE_RESTRICTIONS[wowClass as WoWClass].includes(props.characterRace),
  ) as WoWClass[]
})

const availableRaidTiers = computed((): TierLevel[] => {
  return Array.from({ length: props.unlockedTiers.r + 1 }, (_, i) => i as TierLevel)
})

const availableDungeonTiers = computed((): TierLevel[] => {
  return Array.from({ length: props.unlockedTiers.d + 1 }, (_, i) => i as TierLevel)
})

// Methods
const updateField = (field: string, value: string | number) => {
  const updatedForm = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updatedForm)
}
</script>
