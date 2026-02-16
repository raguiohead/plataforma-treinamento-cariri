'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserProgress, LoginCredentials, RegisterData, QuizResult } from '@/types'

// Gera ID único simples
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

// Progresso inicial de um novo usuário
const initialProgress: UserProgress = {
  completedModules: [],
  completedLessons: [],
  completedQuizzes: [],
  tempoEstudo: 0,
  xp: 0,
}

interface AuthStore {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  updateProgress: (updates: Partial<UserProgress>) => void
  completeLesson: (lessonId: string, duracao: number) => void
  completeModule: (moduleId: string) => void
  completeQuiz: (result: QuizResult) => void
  earnCertificate: () => void
  setCurrentPosition: (moduleId: string, lessonId: string) => void
  addTempoEstudo: (minutos: number) => void
  obterProgressoModulo: (moduleId: string, totalLicoes: number) => number
  resetProgress: () => void
  clearError: () => void
}

// Simula um "banco de dados" local para demo
const USERS_STORAGE_KEY = 'unimed-training-users'

function getStoredUsers(): Record<string, User & { password: string }> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    console.error('Erro ao ler usuários do localStorage')
    return {}
  }
}

function saveUser(user: User, password: string): void {
  const users = getStoredUsers()
  users[user.email] = { ...user, password }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })

        try {
          // Verifica admin via API (credenciais seguras no servidor)
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (data.success && data.isAdmin) {
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          }
        } catch {
          // Continua para validação local se API falhar
        }

        // Validação local para usuários normais
        const users = getStoredUsers()
        const storedUser = users[credentials.email]

        if (!storedUser) {
          set({ isLoading: false, error: 'Usuário não encontrado' })
          return false
        }

        if (storedUser.password !== credentials.password) {
          set({ isLoading: false, error: 'Senha incorreta' })
          return false
        }

        // Remove password do objeto retornado
        const { password: _, ...user } = storedUser

        // Atualiza último acesso
        const updatedUser: User = {
          ...user,
          progress: {
            ...user.progress,
            lastAccessAt: new Date().toISOString(),
          },
        }

        saveUser(updatedUser, credentials.password)

        set({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        return true
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })

        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 800))

        const users = getStoredUsers()

        if (users[data.email]) {
          set({ isLoading: false, error: 'E-mail já cadastrado' })
          return false
        }

        const newUser: User = {
          id: generateId(),
          name: data.name,
          email: data.email,
          role: 'colaborador',
          department: data.department,
          createdAt: new Date().toISOString(),
          progress: {
            ...initialProgress,
            lastAccessAt: new Date().toISOString(),
          },
        }

        saveUser(newUser, data.password)

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        return true
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (!user) return

        const updatedUser = { ...user, ...updates }
        const users = getStoredUsers()
        const storedUser = users[user.email]

        if (storedUser) {
          saveUser(updatedUser, storedUser.password)
        }

        set({ user: updatedUser })
      },

      updateProgress: (updates: Partial<UserProgress>) => {
        const { user, updateUser } = get()
        if (!user) return

        updateUser({
          progress: { ...user.progress, ...updates },
        })
      },

      completeLesson: (lessonId: string, duracao: number = 0) => {
        const { user, updateProgress, addTempoEstudo } = get()
        if (!user) return

        const completedLessons = user.progress?.completedLessons ?? []
        if (!completedLessons.includes(lessonId)) {
          const currentXp = user.progress?.xp ?? 0
          updateProgress({
            completedLessons: [...completedLessons, lessonId],
            xp: currentXp + 10, // +10 XP por lição
          })
          if (duracao > 0) {
            addTempoEstudo(duracao)
          }
        }
      },

      completeModule: (moduleId: string) => {
        const { user, updateProgress } = get()
        if (!user) return

        const completedModules = user.progress?.completedModules ?? []
        if (!completedModules.includes(moduleId)) {
          const currentXp = user.progress?.xp ?? 0
          updateProgress({
            completedModules: [...completedModules, moduleId],
            xp: currentXp + 50, // +50 XP por módulo
          })
        }
      },

      completeQuiz: (result: QuizResult) => {
        const { user, updateProgress } = get()
        if (!user) return

        const completedQuizzes = user.progress?.completedQuizzes ?? []
        // Substitui resultado existente ou adiciona novo
        const existingIndex = completedQuizzes.findIndex(q => q.quizId === result.quizId)
        const updatedQuizzes = existingIndex >= 0
          ? completedQuizzes.map((q, i) => i === existingIndex ? result : q)
          : [...completedQuizzes, result]

        updateProgress({
          completedQuizzes: updatedQuizzes,
        })
      },

      earnCertificate: () => {
        const { updateProgress } = get()
        updateProgress({
          certificateEarnedAt: new Date().toISOString(),
        })
      },

      setCurrentPosition: (moduleId: string, lessonId: string) => {
        const { updateProgress } = get()
        updateProgress({
          currentModuleId: moduleId,
          currentLessonId: lessonId,
          lastAccessAt: new Date().toISOString(),
        })
      },

      addTempoEstudo: (minutos: number) => {
        const { user, updateProgress } = get()
        if (!user) return
        updateProgress({
          tempoEstudo: (user.progress?.tempoEstudo || 0) + minutos,
        })
      },

      obterProgressoModulo: (moduleId: string, totalLicoes: number) => {
        const { user } = get()
        if (!user || totalLicoes === 0) return 0
        
        const completedLessons = user.progress?.completedLessons ?? []
        const licoesCompletasDoModulo = completedLessons.filter(
          licaoId => licaoId.startsWith(`lic-${moduleId.split('-')[1]}`)
        ).length
        
        return Math.round((licoesCompletasDoModulo / totalLicoes) * 100)
      },

      resetProgress: () => {
        const { user, updateUser } = get()
        if (!user) return

        updateUser({
          progress: { ...initialProgress },
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'unimed-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Garante que progress tenha arrays inicializados (migração de dados antigos)
      onRehydrateStorage: () => (state) => {
        if (state?.user?.progress) {
          state.user.progress = {
            ...initialProgress,
            ...state.user.progress,
            completedModules: state.user.progress.completedModules ?? [],
            completedLessons: state.user.progress.completedLessons ?? [],
            completedQuizzes: state.user.progress.completedQuizzes ?? [],
            tempoEstudo: state.user.progress.tempoEstudo ?? 0,
          }
        }
      },
    }
  )
)
