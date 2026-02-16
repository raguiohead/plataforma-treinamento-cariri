'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Função para aplicar o tema no DOM
function applyThemeToDOM(theme: Theme) {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (theme === 'system' && systemDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        applyThemeToDOM(theme)
        set({ theme })
      },
    }),
    {
      name: 'unimed-theme',
      onRehydrateStorage: () => (state) => {
        // Aplica o tema quando o estado é hidratado do localStorage
        if (state?.theme) {
          applyThemeToDOM(state.theme)
        }
      },
    }
  )
)

// Export para uso externo (compatibilidade)
export const applyTheme = applyThemeToDOM
