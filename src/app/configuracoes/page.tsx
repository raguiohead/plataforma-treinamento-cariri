'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, Button } from '@/components/ui'
import { useThemeStore } from '@/stores'
import { useAuthStore } from '@/stores'
import {
  Moon,
  Sun,
  Monitor,
  Shield,
  Trash2,
  LogOut,
  Check,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Theme = 'light' | 'dark' | 'system'

const themeOptions: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'light',
    label: 'Claro',
    icon: <Sun className="w-5 h-5" />,
    description: 'Tema claro padrão',
  },
  {
    value: 'dark',
    label: 'Escuro',
    icon: <Moon className="w-5 h-5" />,
    description: 'Tema escuro para ambientes com pouca luz',
  },
  {
    value: 'system',
    label: 'Sistema',
    icon: <Monitor className="w-5 h-5" />,
    description: 'Usar configuração do sistema',
  },
]

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useThemeStore()
  const { user, logout, resetProgress } = useAuthStore()
  const router = useRouter()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  const handleResetProgress = () => {
    resetProgress()
    setShowResetConfirm(false)
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Configurações</h1>

        {/* Aparência */}
        <Card className="p-6 dark:bg-surface-800 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 text-unimed-green-500" />
            Aparência
          </h2>

          <div className="space-y-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  theme === option.value
                    ? 'border-unimed-green-500 bg-unimed-green-50 dark:bg-unimed-green-900/20'
                    : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    theme === option.value
                      ? 'bg-unimed-green-500 text-white'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
                  }`}
                >
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-surface-900 dark:text-white">{option.label}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">{option.description}</p>
                </div>
                {theme === option.value && (
                  <Check className="w-5 h-5 text-unimed-green-500" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Privacidade */}
        <Card className="p-6 dark:bg-surface-800 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-unimed-green-500" />
            Privacidade e Dados
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Resetar progresso</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Apaga todo seu progresso e começa do zero
                  </p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 dark:bg-surface-800">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">
                Confirmar Reset
              </h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Tem certeza que deseja apagar todo seu progresso? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleResetProgress}
                >
                  Resetar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Conta */}
        <Card className="p-6 dark:bg-surface-800 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-unimed-green-500" />
            Conta
          </h2>

          {user && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700">
                <p className="text-sm text-surface-500 dark:text-surface-400">Logado como</p>
                <p className="font-medium text-surface-900 dark:text-white">{user.email}</p>
              </div>

              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </div>
          )}
        </Card>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-xs text-surface-400 dark:text-surface-500">
            Treinamento Unimed Cariri v1.0.0
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
