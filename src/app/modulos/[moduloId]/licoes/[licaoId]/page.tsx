'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AppLayout } from '@/components/layout'
import { Button, Badge, ProgressBar, ModuleIcon } from '@/components/ui'
import { ConteudoRenderer } from '@/components/licao/ConteudoRenderer'
import { useAuthStore } from '@/stores'
import {
  getModuloById,
  getLicaoById,
  getLicaoAnterior,
  getLicaoProxima,
  calcularProgressoModulo,
  isModuloCompleto,
  isLicaoBloqueada,
  formatarTempo,
} from '@/lib/modulos'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Lock,
} from 'lucide-react'
import Link from 'next/link'

export default function LicaoPage() {
  const params = useParams()
  const router = useRouter()
  const { user, completeLesson, completeModule, setCurrentPosition } = useAuthStore()

  const moduloId = params.moduloId as string
  const licaoId = params.licaoId as string

  const modulo = getModuloById(moduloId)
  const licao = modulo ? getLicaoById(moduloId, licaoId) : undefined

  const licaoAnterior = getLicaoAnterior(moduloId, licaoId)
  const licaoProxima = getLicaoProxima(moduloId, licaoId)

  const isCompleta = user?.progress?.completedLessons?.includes(licaoId) ?? false
  const progressoModulo = user 
    ? calcularProgressoModulo(moduloId, user.progress?.completedLessons ?? []) 
    : 0

  // Atualiza posição atual ao entrar na lição
  useEffect(() => {
    if (user && modulo && licao) {
      setCurrentPosition(moduloId, licaoId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduloId, licaoId])

  // Redireciona se módulo/lição não existir
  if (!modulo || !licao) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-surface-300 dark:text-surface-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Lição não encontrada</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Esta lição não existe ou foi removida.</p>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  // Verifica se lição está bloqueada
  const isBloqueada = user 
    ? isLicaoBloqueada(moduloId, licaoId, user.progress?.completedLessons ?? [])
    : true

  if (isBloqueada && !isCompleta) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex justify-center mb-4">
            <Lock className="w-16 h-16 text-surface-300 dark:text-surface-600" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Lição Bloqueada</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Complete a lição anterior para desbloquear esta.</p>
          <Link href={`/modulos/${moduloId}`}>
            <Button>Ver Módulo</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  // Índices para breadcrumb
  const licaoIndex = modulo.licoes.findIndex(l => l.id === licaoId) + 1

  // Verifica se é a última lição do módulo atual
  const isUltimaLicaoDoModulo = !licaoProxima || licaoProxima.moduloId !== moduloId

  const handleMarcarCompleta = () => {
    if (!user) return

    // Marca lição como completa
    completeLesson(licaoId, licao.duracao)

    // Verifica se o módulo foi completado
    const licoesAtualizadas = [...(user.progress?.completedLessons ?? []), licaoId]
    if (isModuloCompleto(moduloId, licoesAtualizadas)) {
      completeModule(moduloId)
    }

    // Se há próxima lição no mesmo módulo, navega para ela
    if (licaoProxima && licaoProxima.moduloId === moduloId) {
      router.push(`/modulos/${licaoProxima.moduloId}/licoes/${licaoProxima.licaoId}`)
    } else {
      // Última lição do módulo - vai para o quiz
      router.push(`/quiz/${moduloId}`)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-4">
            <Link 
              href="/dashboard" 
              className="hover:text-surface-700 dark:hover:text-surface-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span>/</span>
            <Link 
              href={`/modulos/${moduloId}`}
              className="hover:text-surface-700 dark:hover:text-surface-200 transition-colors flex items-center gap-1"
            >
              <ModuleIcon name={modulo.icone} className="w-4 h-4" />
              {modulo.titulo}
            </Link>
            <span>/</span>
            <span className="text-surface-900 dark:text-white font-medium">
              Lição {licaoIndex}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <ProgressBar value={progressoModulo} size="md" />
            </div>
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
              {progressoModulo}% do módulo
            </span>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
                {licao.titulo}
              </h1>
              <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{licao.duracao} min
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  Lição {licaoIndex} de {modulo.licoes.length}
                </span>
              </div>
            </div>
            {isCompleta && (
              <Badge variant="success" size="lg" className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Concluída
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-soft dark:shadow-none p-6 md:p-8 mb-6">
          <ConteudoRenderer conteudo={licao.conteudo} />
        </div>

        {/* Navigation Footer */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-soft dark:shadow-none p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Previous */}
            <div className="flex-1">
              {licaoAnterior && (
                <Link href={`/modulos/${licaoAnterior.moduloId}/licoes/${licaoAnterior.licaoId}`}>
                  <Button 
                    variant="outline" 
                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                </Link>
              )}
            </div>

            {/* Complete Button */}
            <div>
              {!isCompleta ? (
                <Button
                  size="lg"
                  onClick={handleMarcarCompleta}
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                >
                  Marcar como Concluída
                </Button>
              ) : isUltimaLicaoDoModulo ? (
                <Link href={`/quiz/${moduloId}`}>
                  <Button
                    size="lg"
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Fazer Quiz do Módulo
                  </Button>
                </Link>
              ) : licaoProxima ? (
                <Link href={`/modulos/${licaoProxima.moduloId}/licoes/${licaoProxima.licaoId}`}>
                  <Button
                    size="lg"
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Próxima Lição
                  </Button>
                </Link>
              ) : (
                <Link href="/certificado">
                  <Button size="lg">
                    Ver Certificado
                  </Button>
                </Link>
              )}
            </div>

            {/* Next */}
            <div className="flex-1 flex justify-end">
              {licaoProxima && licaoProxima.moduloId === moduloId && !isCompleta && (
                <Button 
                  variant="ghost" 
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={handleMarcarCompleta}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">Pular</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
