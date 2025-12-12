<template>
  <Modal title="Manage Accounts" @close="$emit('close')">
    <div class="space-y-4">
      <div class="space-y-2">
        <div
          v-for="account in accountsStore.accounts"
          :key="account.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div v-if="editingId === account.id" class="flex-1 mr-2">
            <input
              v-model="editingName"
              @keyup.enter="saveEdit(account.id)"
              @keyup.esc="cancelEdit"
              autofocus
              class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span v-else class="font-medium text-gray-900 dark:text-white">{{ account.name }}</span>

          <div class="flex items-center space-x-2">
            <template v-if="editingId === account.id">
              <button
                @click="saveEdit(account.id)"
                class="text-green-600 hover:text-green-700 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="cancelEdit"
                class="text-red-600 hover:text-red-700 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </template>
            <template v-else>
              <button
                @click="startEdit(account)"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                v-if="accountsStore.accounts.length > 1"
                @click="deleteAccount(account.id)"
                class="text-red-400 hover:text-red-600 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <input
          v-model="newAccountName"
          @keyup.enter="addAccount"
          placeholder="New account name"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="addAccount"
          :disabled="!newAccountName.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Account } from '@/types'
import { useAccountsStore } from '@/stores/accounts'
import Modal from './Modal.vue'

defineEmits<{
  close: []
}>()

const accountsStore = useAccountsStore()
const newAccountName = ref('')
const editingId = ref<string | null>(null)
const editingName = ref('')

const addAccount = async () => {
  if (newAccountName.value.trim()) {
    await accountsStore.addAccount(newAccountName.value.trim())
    newAccountName.value = ''
  }
}

const startEdit = (account: Account) => {
  editingId.value = account.id
  editingName.value = account.name
}

const saveEdit = async (id: string) => {
  if (editingName.value.trim()) {
    await accountsStore.updateAccount(id, editingName.value.trim())
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingId.value = null
  editingName.value = ''
}

const deleteAccount = async (id: string) => {
  if (confirm('Delete this account? All characters and raids in this account will need to be reassigned.')) {
    await accountsStore.deleteAccount(id)
  }
}
</script>
