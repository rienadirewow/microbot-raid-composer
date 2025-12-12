import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { ThemePreference } from '@/types'
import { useStorage } from '@/composables/useStorage'

export const useThemeStore = defineStore('theme', () => {
  const preference = ref<ThemePreference>('system')
  const systemPrefersDark = ref(false)
  const { get, set } = useStorage()

  const resolved = computed<'light' | 'dark'>(() => {
    if (preference.value === 'system') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return preference.value
  })

  const isDark = computed(() => resolved.value === 'dark')

  const applyTheme = () => {
    if (resolved.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setTheme = async (newPreference: ThemePreference) => {
    preference.value = newPreference
    applyTheme()
    const settings = (await get<Record<string, unknown>>('settings')) || {}
    await set('settings', { ...settings, theme: newPreference })
  }

  const initTheme = async () => {
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      applyTheme()
    })

    const settings = await get<{ theme?: ThemePreference }>('settings')
    if (settings?.theme) {
      preference.value = settings.theme
    }
    applyTheme()
  }

  watch(resolved, () => {
    applyTheme()
  })

  return {
    preference,
    resolved,
    isDark,
    setTheme,
    initTheme,
  }
})
