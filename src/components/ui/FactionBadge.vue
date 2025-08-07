<template>
  <div
    class="w-3 h-3 rounded-full"
    :class="faction === 'alliance' ? 'bg-blue-600' : 'bg-red-600'"
  ></div>
</template>

<script setup lang="ts">
import type { Faction } from '@/types'

// Props
interface Props {
  faction: Faction
}

defineProps<Props>()
</script>
