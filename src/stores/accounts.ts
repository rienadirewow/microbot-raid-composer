import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Account } from '@/types'
import { useStorage } from '@/composables/useStorage'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const selectedAccountId = ref<string | null>(null)
  const { get, set, getAccounts, setAccounts, isAuthenticated } = useStorage()

  const selectedAccount = computed(() =>
    accounts.value.find((a) => a.id === selectedAccountId.value) || null
  )

  const loadAccounts = async () => {
    try {
      const stored = await getAccounts()
      accounts.value = stored || []

      const settings = await get<{ selectedAccountId?: string }>('settings')
      if (settings?.selectedAccountId && accounts.value.some((a) => a.id === settings.selectedAccountId)) {
        selectedAccountId.value = settings.selectedAccountId
      } else if (accounts.value.length > 0) {
        selectedAccountId.value = accounts.value[0].id
      }
    } catch (error) {
      console.error('Failed to load accounts:', error)
      accounts.value = []
    }
  }

  watch(isAuthenticated, async () => {
    await loadAccounts()
  })

  const addAccount = async (name: string) => {
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
    }

    accounts.value.push(newAccount)
    await setAccounts(accounts.value)

    if (!selectedAccountId.value) {
      selectedAccountId.value = newAccount.id
      await saveSelectedAccount()
    }

    return newAccount
  }

  const updateAccount = async (id: string, name: string) => {
    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      accounts.value[index] = { ...accounts.value[index], name }
      await setAccounts(accounts.value)
      return accounts.value[index]
    }
    throw new Error('Account not found')
  }

  const deleteAccount = async (id: string) => {
    if (accounts.value.length <= 1) {
      throw new Error('Cannot delete the last account')
    }

    const index = accounts.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      accounts.value.splice(index, 1)
      await setAccounts(accounts.value)

      if (selectedAccountId.value === id) {
        selectedAccountId.value = accounts.value[0]?.id || null
        await saveSelectedAccount()
      }
      return true
    }
    return false
  }

  const selectAccount = async (id: string) => {
    if (accounts.value.some((a) => a.id === id)) {
      selectedAccountId.value = id
      await saveSelectedAccount()
    }
  }

  const saveSelectedAccount = async () => {
    const settings = (await get<Record<string, unknown>>('settings')) || {}
    await set('settings', { ...settings, selectedAccountId: selectedAccountId.value })
  }

  const getAccountById = (id: string) => accounts.value.find((a) => a.id === id)

  return {
    accounts,
    selectedAccountId,
    selectedAccount,
    loadAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    getAccountById,
  }
})
