import { useAccountsStore } from '@/stores/accounts'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'

export const useMigration = () => {
  const migrateToMultiAccount = async () => {
    const accountsStore = useAccountsStore()
    const charactersStore = useCharactersStore()
    const raidsStore = useRaidsStore()

    console.log('Migration check:', {
      accounts: accountsStore.accounts.length,
      characters: charactersStore.characters.length,
      raids: raidsStore.raids.length,
      charactersData: charactersStore.characters.map(c => ({ id: c.id, name: c.name, accountId: c.accountId })),
    })

    const hasUnmigratedCharacters = charactersStore.characters.some(
      (c) => !c.accountId || c.accountId === 'default'
    )
    const hasUnmigratedRaids = raidsStore.raids.some(
      (r) => !r.accountId || r.accountId === 'default'
    )

    console.log('Migration needed:', { hasUnmigratedCharacters, hasUnmigratedRaids })

    if (!hasUnmigratedCharacters && !hasUnmigratedRaids) {
      if (accountsStore.accounts.length === 0) {
        console.log('No accounts exist, creating default account')
        await accountsStore.addAccount('Default Account')
      }
      return false
    }

    let defaultAccount = accountsStore.accounts.find((a) => a.name === 'Default Account')

    if (!defaultAccount) {
      defaultAccount = await accountsStore.addAccount('Default Account')
    }

    if (hasUnmigratedCharacters) {
      await charactersStore.migrateCharactersToAccount(defaultAccount.id)
    }

    if (hasUnmigratedRaids) {
      await raidsStore.migrateRaidsToAccount(defaultAccount.id)
    }

    await accountsStore.selectAccount(defaultAccount.id)

    return true
  }

  return {
    migrateToMultiAccount,
  }
}
