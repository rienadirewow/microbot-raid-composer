import { ref, computed, watch } from 'vue'
import type { PlayerCharacter, RaidComposition, UserData, Account } from '@/types'
import { useSupabase } from './useSupabase'

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
  keys(): Promise<string[]>
}

class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`LocalStorage get error for key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Consider clearing old data.')
      }
      throw error
    }
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }

  async keys(): Promise<string[]> {
    return Object.keys(localStorage)
  }
}

class SupabaseAdapter implements StorageAdapter {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { data, error } = await this.supabase
        .from('user_data')
        .select('data')
        .eq('user_id', user.id)
        .eq('data_type', key)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = not found
        console.error('Supabase get error:', error)
        return null
      }

      return data?.data ?? null
    } catch (error) {
      console.error(`Supabase get error for key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { error } = await this.supabase.from('user_data').upsert(
        {
          user_id: user.id,
          data_type: key,
          data: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,data_type' }
      )

      if (error) {
        console.error('Supabase set error:', error)
        throw new Error(`Failed to save ${key}: ${error.message}`)
      }
    } catch (error) {
      console.error(`Supabase set error for key ${key}:`, error)
      throw error
    }
  }

  async remove(key: string): Promise<void> {
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { error } = await this.supabase
        .from('user_data')
        .delete()
        .eq('user_id', user.id)
        .eq('data_type', key)

      if (error) {
        console.error('Supabase remove error:', error)
        throw new Error(`Failed to remove ${key}: ${error.message}`)
      }
    } catch (error) {
      console.error(`Supabase remove error for key ${key}:`, error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { error } = await this.supabase.from('user_data').delete().eq('user_id', user.id)

      if (error) {
        console.error('Supabase clear error:', error)
        throw new Error(`Failed to clear data: ${error.message}`)
      }
    } catch (error) {
      console.error('Supabase clear error:', error)
      throw error
    }
  }

  async keys(): Promise<string[]> {
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      if (!user) {
        throw new Error('No authenticated user found')
      }

      const { data, error } = await this.supabase
        .from('user_data')
        .select('data_type')
        .eq('user_id', user.id)

      if (error) {
        console.error('Supabase keys error:', error)
        return []
      }

      return data?.map((row: any) => row.data_type) ?? []
    } catch (error) {
      console.error('Supabase keys error:', error)
      return []
    }
  }
}

export const useStorage = () => {
  const { supabaseClient, isAuthenticated } = useSupabase()

  const adapter = computed(() => {
    // Always use Supabase since we'll have either authenticated or anonymous users
    const selectedAdapter = new SupabaseAdapter(supabaseClient)

    return selectedAdapter
  })

  // Generic storage methods
  const get = <T>(key: string): Promise<T | null> => adapter.value.get<T>(key)
  const set = <T>(key: string, value: T): Promise<void> => adapter.value.set(key, value)
  const remove = (key: string): Promise<void> => adapter.value.remove(key)
  const clear = (): Promise<void> => adapter.value.clear()
  const keys = (): Promise<string[]> => adapter.value.keys()

  const getAccounts = async (): Promise<Account[]> => {
    return (await get<Account[]>('accounts')) ?? []
  }

  const setAccounts = async (accounts: Account[]): Promise<void> => {
    await set('accounts', accounts)
  }

  // Domain-specific methods for WoW data
  const getPlayerCharacters = async (): Promise<PlayerCharacter[]> => {
    const characters = (await get<PlayerCharacter[]>('characters')) ?? []

    return characters
  }

  const setPlayerCharacters = async (characters: PlayerCharacter[]): Promise<void> => {
    await set('characters', characters)
  }

  const getRaidCompositions = async (): Promise<RaidComposition[]> => {
    return (await get<RaidComposition[]>('raids')) ?? []
  }

  const setRaidCompositions = async (raids: RaidComposition[]): Promise<void> => {
    await set('raids', raids)
  }

  const getUserData = async (): Promise<UserData> => {
    const [characters, raids, settings] = await Promise.all([
      getPlayerCharacters(),
      getRaidCompositions(),
      get<UserData['settings']>('settings'),
    ])

    return {
      characters,
      raids,
      settings: settings ?? { autoSave: true },
    }
  }

  const saveUserData = async (data: Partial<UserData>): Promise<void> => {
    const promises: Promise<void>[] = []

    if (data.characters) {
      promises.push(setPlayerCharacters(data.characters))
    }
    if (data.raids) {
      promises.push(setRaidCompositions(data.raids))
    }
    if (data.settings) {
      promises.push(set('settings', data.settings))
    }

    await Promise.all(promises)
  }

  return {
    // Generic methods
    get,
    set,
    remove,
    clear,
    keys,

    // Domain-specific methods
    getAccounts,
    setAccounts,
    getPlayerCharacters,
    setPlayerCharacters,
    getRaidCompositions,
    setRaidCompositions,
    getUserData,
    saveUserData,

    // State
    isAuthenticated,
  }
}
