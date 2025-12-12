<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <span class="max-w-32 truncate">{{
        accountsStore.selectedAccount?.name || 'Select Account'
      }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div class="py-1 max-h-64 overflow-y-auto">
        <button
          v-for="account in accountsStore.accounts"
          :key="account.id"
          @click="selectAccount(account.id)"
          class="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-blue-50 dark:bg-blue-900/30': account.id === accountsStore.selectedAccountId }"
        >
          <span class="truncate">{{ account.name }}</span>
          <svg
            v-if="account.id === accountsStore.selectedAccountId"
            class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-700">
        <button
          @click="openManageModal"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Manage Accounts
        </button>
      </div>
    </div>

    <AccountManageModal v-if="showManageModal" @close="showManageModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountManageModal from './AccountManageModal.vue'

const accountsStore = useAccountsStore()
const isOpen = ref(false)
const showManageModal = ref(false)
const dropdownRef = ref<HTMLElement>()

const selectAccount = async (id: string) => {
  await accountsStore.selectAccount(id)
  isOpen.value = false
}

const openManageModal = () => {
  isOpen.value = false
  showManageModal.value = true
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
