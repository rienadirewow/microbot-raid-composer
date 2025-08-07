<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :required="required"
      ref="inputRef"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :class="{ 'border-red-500': error }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  required?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  error: '',
})

// Emits
defineEmits<{
  'update:modelValue': [value: string]
}>()

// Template ref for focus
const inputRef = ref<HTMLInputElement>()

// Expose focus method
defineExpose({
  focus: () => inputRef.value?.focus(),
})
</script>
