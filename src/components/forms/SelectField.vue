<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      :class="{ 'border-red-500': error }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">{{ placeholder }}</option>
      <slot />
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  id: string
  label: string
  modelValue: string
  placeholder?: string
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  required: false,
  error: '',
})

// Emits
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
