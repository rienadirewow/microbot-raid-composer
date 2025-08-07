<template>
  <div class="mb-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <p class="mt-2 text-gray-600">{{ description }}</p>
      </div>
      <div v-if="$slots.action" class="flex items-center space-x-4">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>
