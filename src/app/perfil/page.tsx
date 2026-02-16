'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, Button, Input } from '@/components/ui'
import { useAuthStore } from '@/stores'
import { calcularDashboardStats, getTotalDuracao, formatarTempo } from '@/lib/modulos'
import { calcularNotaMedia, getTotalQuizzesCompletos } from '@/lib/quizzes'
import {
  User,
  Mail,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'

export default function PerfilPage() {
  const { user, updateUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-surface-500 dark:text-surface-400">Faça login para acessar seu perfil</p>
        </div>
      </AppLayout>
    )
  }

  const stats = calcularDashboardStats(user.progress)
  const notaMedia = calcularNotaMedia(user.progress)
  const quizzesCompletos = getTotalQuizzesCompletos(user.progress)
  const tempoTotal = formatarTempo(user.progress.tempoEstudo ?? 0)

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      updateUser({ name: name.trim(), email: email.trim() })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setName(user.name)
    setEmail(user.email)
    setIsEditing(false)
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Meu Perfil</h1>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="w-4 h-4" />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="p-6 dark:bg-surface-800 dark:border-surface-700">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-unimed-green-500 to-unimed-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Save className="w-4 h-4" />}
                      onClick={handleSave}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<X className="w-4 h-4" />}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-surface-700 dark:text-surface-300">
                      <User className="w-5 h-5 text-surface-400" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-surface-700 dark:text-surface-300">
                      <Mail className="w-5 h-5 text-surface-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-surface-700 dark:text-surface-300">
                      <Calendar className="w-5 h-5 text-surface-400" />
                      <span>Membro desde {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 dark:bg-surface-800 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-unimed-green-100 dark:bg-unimed-green-900/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-unimed-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats.licoesCompletas}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Lições Completas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-surface-800 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-unimed-blue-100 dark:bg-unimed-blue-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-unimed-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{quizzesCompletos}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Quizzes Feitos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-surface-800 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{tempoTotal}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Tempo de Estudo</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-surface-800 dark:border-surface-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{notaMedia}%</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Nota Média</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6 dark:bg-surface-800 dark:border-surface-700">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-unimed-green-500" />
            Conquistas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Conquistado */}
            {stats.licoesCompletas >= 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700">
                <Target className="w-8 h-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-surface-900 dark:text-white text-center">Primeira Lição</span>
              </div>
            )}

            {stats.modulosCompletos >= 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
                <BookOpen className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-surface-900 dark:text-white text-center">Módulo Completo</span>
              </div>
            )}

            {quizzesCompletos >= 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
                <CheckCircle2 className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-surface-900 dark:text-white text-center">Quiz Master</span>
              </div>
            )}

            {stats.progressoGeral === 100 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
                <Trophy className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-surface-900 dark:text-white text-center">Treinamento Completo</span>
              </div>
            )}

            {/* Bloqueados */}
            {stats.licoesCompletas < 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 opacity-50">
                <Target className="w-8 h-8 text-surface-400 mb-2" />
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400 text-center">Primeira Lição</span>
              </div>
            )}

            {stats.modulosCompletos < 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 opacity-50">
                <BookOpen className="w-8 h-8 text-surface-400 mb-2" />
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400 text-center">Módulo Completo</span>
              </div>
            )}

            {quizzesCompletos < 1 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 opacity-50">
                <CheckCircle2 className="w-8 h-8 text-surface-400 mb-2" />
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400 text-center">Quiz Master</span>
              </div>
            )}

            {stats.progressoGeral < 100 && (
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 opacity-50">
                <Trophy className="w-8 h-8 text-surface-400 mb-2" />
                <span className="text-sm font-medium text-surface-500 dark:text-surface-400 text-center">Treinamento Completo</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
