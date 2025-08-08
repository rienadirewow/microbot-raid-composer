<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div v-if="!isEditing" class="flex items-center space-x-2">
          <h2 class="text-xl font-semibold text-gray-900">{{ raidName }}</h2>
          <button
            @click="startEditing"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit raid name"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
        <div v-else class="flex items-center space-x-2">
          <input
            ref="nameInput"
            v-model="editingName"
            @keyup.enter="saveName"
            @keyup.esc="cancelEditing"
            @blur="saveName"
            class="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
            :maxlength="50"
          />
          <button
            @click="saveName"
            class="text-green-600 hover:text-green-700 transition-colors"
            title="Save name"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            @click="cancelEditing"
            class="text-red-600 hover:text-red-700 transition-colors"
            title="Cancel editing"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <ProgressBar :value="filledSlots" :max="40" />
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center space-x-4">
      <Button variant="success" size="sm" @click="$emit('save')">Save Raid</Button>
      <Button variant="warning" size="sm" @click="$emit('export')">Export Commands</Button>
      <Button variant="secondary" size="sm" @click="$emit('clear')">Clear</Button>
      <Button variant="danger" size="sm" @click="$emit('delete')">Delete Raid</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ProgressBar from './ui/ProgressBar.vue'
import Button from './ui/Button.vue'
import FactionBadge from './ui/FactionBadge.vue'

// Props
interface Props {
  raidName: string
  filledSlots: number
  isAutoSaving?: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  save: []
  export: []
  clear: []
  delete: []
  updateName: [name: string]
}>()

// Reactive state for editing
const isEditing = ref(false)
const editingName = ref('')
const nameInput = ref<HTMLInputElement>()

// Methods
const startEditing = () => {
  editingName.value = props.raidName
  isEditing.value = true
  nextTick(() => {
    nameInput.value?.focus()
    nameInput.value?.select()
  })
}

const saveName = () => {
  const trimmedName = editingName.value.trim()
  if (trimmedName && trimmedName !== props.raidName) {
    emit('updateName', trimmedName)
  }
  isEditing.value = false
}

const cancelEditing = () => {
  isEditing.value = false
  editingName.value = ''
}
</script>
