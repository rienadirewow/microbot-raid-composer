<template>
  <div
    class="fixed inset-0 bg-gray-900/50 dark:bg-black/70 overflow-y-auto h-full w-full z-50"
    @click.self="$emit('close')"
  >
    <div class="relative top-10 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ title }}</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  title: string
}

defineProps<Props>()

// Emits
defineEmits<{
  close: []
}>()
</script>
