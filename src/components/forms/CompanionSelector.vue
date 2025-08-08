<template>
  <Modal :title="`Select Companion for Slot ${slotNumber}`" @close="$emit('close')">
    <!-- Character Groups -->
    <div class="space-y-6">
      <CompanionCard
        v-for="character in charactersStore.characters"
        :key="character.id"
        :character="character"
        :available-slots="4"
        @select="selectCompanion"
        @update:form="updateCompanionForm"
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button type="button" variant="secondary" size="sm" @click="$emit('close')"> Cancel </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PlayerCharacter, CompanionAssignment, WoWClass, Role, TierLevel } from '@/types'
import { useCharactersStore } from '@/stores/characters'
import { CLASS_RACE_RESTRICTIONS } from '@/data/wow-data'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import CompanionCard from './CompanionCard.vue'

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

const updateCompanionForm = (character: PlayerCharacter, companionIndex: number, form: any) => {
  const formKey = `${character.id}-${companionIndex}`
  companionForms.value[formKey] = form
}
</script>
