<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  title: string
}

defineProps<Props>()
</script>
