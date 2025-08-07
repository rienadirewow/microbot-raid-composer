<template>
  <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
    <div class="flex items-center">
      <svg
        class="w-6 h-6 text-yellow-600 mr-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <div>
        <h3 class="text-lg font-medium text-yellow-800">{{ title }}</h3>
        <p class="text-yellow-700">
          {{ description }}
          <slot name="action" />
        </p>
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
