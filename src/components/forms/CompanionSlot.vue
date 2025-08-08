<template>
  <div
    class="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer hover:bg-blue-50"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-900"> Companion {{ slotNumber }} </span>
      <div class="w-2 h-2 rounded-full bg-green-500"></div>
    </div>

    <CompanionForm
      v-model="formData"
      :character-race="characterRace"
      :unlocked-tiers="unlockedTiers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TierLevel, WoWClass, Role } from '@/types'
import CompanionForm from './CompanionForm.vue'

// Props
interface Props {
  slotNumber: number
  characterRace: string
  unlockedTiers: {
    r: TierLevel
    d: TierLevel
  }
}

defineProps<Props>()

// Local state
const formData = ref({
  name: '',
  class: '' as WoWClass,
  role: '' as Role,
  tier: 0 as TierLevel,
})

// Emits
const emit = defineEmits<{
  select: []
  'update:form': [
    form: {
      name: string
      class: string
      role: string
      tier: number
    },
  ]
}>()

// Watch for form changes
watch(
  formData,
  (newForm) => {
    emit('update:form', newForm)
  },
  { deep: true },
)
</script>
