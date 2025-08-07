<template>
  <div class="flex items-center justify-end space-x-3 pt-4">
    <Button type="button" variant="secondary" size="sm" @click="$emit('cancel')"> Cancel </Button>
    <Button type="submit" size="sm" :disabled="isSubmitting">
      {{ isSubmitting ? 'Saving...' : submitText }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'

// Props
interface Props {
  isSubmitting?: boolean
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  submitText: 'Save',
})

// Emits
defineEmits<{
  cancel: []
}>()
</script>
